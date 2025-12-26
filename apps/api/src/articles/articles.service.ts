import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { ArticleStatus, ArticleType, Prisma } from '@cms/database';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

@Injectable()
export class ArticlesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  async create(data: any, userId: string) {
    const { tags, ...articleData } = data;

    // Verificar slug único
    const existing = await this.prisma.article.findFirst({
      where: {
        siteId: articleData.siteId,
        slug: articleData.slug,
      },
    });

    if (existing) {
      throw new ConflictException('Slug já existe neste site');
    }

    const article = await this.prisma.article.create({
      data: {
        ...articleData,
        createdBy: userId,
        status: ArticleStatus.DRAFT,
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Adicionar tags
    if (tags && tags.length > 0) {
      await this.addTags(article.id, tags);
    }

    // Criar versão inicial
    await this.createVersion(article.id, userId, 'Versão inicial');

    // Criar checklist editorial
    await this.prisma.editorialChecklist.create({
      data: {
        articleId: article.id,
      },
    });

    // Log de auditoria
    await this.logAudit(userId, 'create', 'article', article.id);

    return article;
  }

  async findAll(filters: any) {
    const {
      siteId,
      status,
      type,
      categoryId,
      authorId,
      search,
      page = 1,
      limit = 20,
      orderBy = 'createdAt',
      order = 'desc',
    } = filters;

    const where: Prisma.ArticleWhereInput = {
      deletedAt: null,
    };

    if (siteId) where.siteId = siteId;
    if (status) where.status = status;
    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (authorId) where.authorId = authorId;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          author: true,
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          [orderBy]: order,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      data: articles,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        versions: {
          orderBy: {
            version: 'desc',
          },
          take: 10,
        },
        checklist: true,
        media: {
          include: {
            media: true,
          },
        },
        relatedArticles: {
          include: {
            relatedArticle: {
              include: {
                author: true,
                category: true,
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        updater: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!article || article.deletedAt) {
      throw new NotFoundException('Artigo não encontrado');
    }

    return article;
  }

  async update(id: string, data: any, userId: string) {
    const article = await this.findOne(id);

    // Verificar lock
    if (article.lockedBy && article.lockedBy !== userId) {
      const lockAge = Date.now() - (article.lockedAt?.getTime() || 0);
      if (lockAge < 5 * 60 * 1000) { // 5 minutos
        throw new ConflictException('Artigo está sendo editado por outro usuário');
      }
    }

    const { tags, ...updateData } = data;

    // Atualizar artigo
    const updated = await this.prisma.article.update({
      where: { id },
      data: {
        ...updateData,
        updatedBy: userId,
        lockedBy: userId,
        lockedAt: new Date(),
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Atualizar tags
    if (tags !== undefined) {
      await this.prisma.articleTag.deleteMany({
        where: { articleId: id },
      });
      if (tags.length > 0) {
        await this.addTags(id, tags);
      }
    }

    // Criar versão
    await this.createVersion(id, userId, 'Atualização');

    // Log de auditoria
    await this.logAudit(userId, 'update', 'article', id, { changes: updateData });

    // Invalidar cache
    await this.invalidateCache(id);

    return updated;
  }

  async changeStatus(id: string, status: ArticleStatus, userId: string) {
    const article = await this.findOne(id);

    // Validações de transição de status
    if (status === ArticleStatus.PUBLISHED && article.status === ArticleStatus.DRAFT) {
      throw new ForbiddenException('Artigo precisa ser revisado antes de publicar');
    }

    const updateData: any = {
      status,
      updatedBy: userId,
    };

    if (status === ArticleStatus.PUBLISHED && !article.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updated = await this.prisma.article.update({
      where: { id },
      data: updateData,
    });

    // Criar versão
    await this.createVersion(id, userId, `Status alterado para ${status}`);

    // Log de auditoria
    await this.logAudit(userId, 'change_status', 'article', id, { status });

    // Invalidar cache
    await this.invalidateCache(id);

    return updated;
  }

  async delete(id: string, userId: string) {
    await this.findOne(id);

    await this.prisma.article.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: userId,
      },
    });

    // Log de auditoria
    await this.logAudit(userId, 'delete', 'article', id);

    // Invalidar cache
    await this.invalidateCache(id);
  }

  async lock(id: string, userId: string) {
    await this.prisma.article.update({
      where: { id },
      data: {
        lockedBy: userId,
        lockedAt: new Date(),
      },
    });

    return { message: 'Artigo bloqueado para edição' };
  }

  async unlock(id: string, userId: string) {
    const article = await this.findOne(id);

    if (article.lockedBy !== userId) {
      throw new ForbiddenException('Você não pode desbloquear este artigo');
    }

    await this.prisma.article.update({
      where: { id },
      data: {
        lockedBy: null,
        lockedAt: null,
      },
    });

    return { message: 'Artigo desbloqueado' };
  }

  async getVersions(id: string) {
    return this.prisma.articleVersion.findMany({
      where: { articleId: id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        version: 'desc',
      },
    });
  }

  async rollback(id: string, versionNumber: number, userId: string) {
    const version = await this.prisma.articleVersion.findUnique({
      where: {
        articleId_version: {
          articleId: id,
          version: versionNumber,
        },
      },
    });

    if (!version) {
      throw new NotFoundException('Versão não encontrada');
    }

    await this.prisma.article.update({
      where: { id },
      data: {
        title: version.title,
        content: version.content,
        updatedBy: userId,
      },
    });

    // Criar nova versão com rollback
    await this.createVersion(id, userId, `Rollback para versão ${versionNumber}`);

    // Log de auditoria
    await this.logAudit(userId, 'rollback', 'article', id, { toVersion: versionNumber });

    // Invalidar cache
    await this.invalidateCache(id);

    return { message: `Artigo restaurado para versão ${versionNumber}` };
  }

  async updateChecklist(id: string, checklistData: any, userId: string) {
    const article = await this.findOne(id);

    if (!article.checklist) {
      throw new NotFoundException('Checklist não encontrado');
    }

    return this.prisma.editorialChecklist.update({
      where: { articleId: id },
      data: {
        ...checklistData,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    });
  }

  async incrementViews(id: string) {
    await this.prisma.article.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // Invalidar cache de métricas
    await this.redis.del(`article:views:${id}`);
  }

  private async createVersion(articleId: string, userId: string, reason: string) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) return;

    const lastVersion = await this.prisma.articleVersion.findFirst({
      where: { articleId },
      orderBy: { version: 'desc' },
    });

    const version = (lastVersion?.version || 0) + 1;

    await this.prisma.articleVersion.create({
      data: {
        articleId,
        version,
        title: article.title,
        content: article.content,
        reason,
        createdBy: userId,
      },
    });
  }

  private async addTags(articleId: string, tagIds: string[]) {
    await this.prisma.articleTag.createMany({
      data: tagIds.map((tagId) => ({
        articleId,
        tagId,
      })),
      skipDuplicates: true,
    });
  }

  private async logAudit(userId: string, action: string, resource: string, resourceId: string, changes?: any) {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        changes,
      },
    });
  }

  private async invalidateCache(articleId: string) {
    await this.redis.del(`article:${articleId}`);
    await this.redis.del(`article:views:${articleId}`);
  }
}
