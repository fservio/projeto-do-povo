import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  async findAll(filters: any) {
    return { data: [], message: 'To be implemented' };
  }
  
  async create(data: any) {
    return { message: 'To be implemented' };
  }
}
