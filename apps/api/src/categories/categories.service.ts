import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const existing = await this.prisma.category.findFirst({
      where: {
        siteId: data.siteId,
        slug: data.slug,
      },
    });

    if (existing) {
      throw new ConflictException('Categoria com este slug já existe');
    }

    return this.prisma.category.create({
      data,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findAll(siteId?: string) {
    return this.prisma.category.findMany({
      where: {
        ...(siteId && { siteId }),
        active: true,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        articles: {
          take: 10,
          where: {
            status: 'PUBLISHED',
          },
          orderBy: {
            publishedAt: 'desc',
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async update(id: string, data: any) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    // Verificar se tem artigos
    const articlesCount = await this.prisma.article.count({
      where: { categoryId: id },
    });

    if (articlesCount > 0) {
      throw new ConflictException('Categoria possui artigos vinculados');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  async reorder(siteId: string, categoryIds: string[]) {
    const updates = categoryIds.map((id, index) =>
      this.prisma.category.update({
        where: { id },
        data: { order: index },
      })
    );

    await this.prisma.$transaction(updates);

    return { message: 'Ordem atualizada com sucesso' };
  }
}
