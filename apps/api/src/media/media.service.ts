import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implementar upload para MinIO/S3
  async upload(file: any, userId: string) {
    return { message: 'Upload implementado' };
  }

  async findAll(filters: any) {
    return this.prisma.mediaAsset.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.mediaAsset.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.mediaAsset.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.mediaAsset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
