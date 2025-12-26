import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, PrismaService, RedisService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
