import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; slug: string }) {
    return this.prisma.tag.create({ data });
  }

  async findAll() {
    return this.prisma.tag.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.tag.findUnique({
      where: { id },
      include: {
        articles: {
          include: {
            article: true,
          },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.tag.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
