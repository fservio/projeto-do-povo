import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaService } from '../common/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [HomeController],
  providers: [HomeService, PrismaService],
  exports: [HomeService],
})
export class HomeModule {}
