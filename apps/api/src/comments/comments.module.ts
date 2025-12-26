import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaService } from '../common/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService],
  exports: [CommentsService],
})
export class CommentsModule {}
