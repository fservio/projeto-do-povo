import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}
  
  async findAll(siteId: string) {
    return this.prisma.homePage.findMany({ where: { siteId } });
  }
  
  async findActive(siteId: string) {
    return this.prisma.homePage.findFirst({ 
      where: { siteId, active: true },
      include: { sections: { include: { blocks: true } } }
    });
  }
  
  async create(data: any, userId: string) {
    return this.prisma.homePage.create({ data: { ...data, createdBy: userId } });
  }
  
  async update(id: string, data: any) {
    return this.prisma.homePage.update({ where: { id }, data });
  }
}
