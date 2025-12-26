import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { MediaModule } from './media/media.module';
import { HomeModule } from './home/home.module';
import { CommentsModule } from './comments/comments.module';
import { AdsModule } from './ads/ads.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './common/prisma.service';
import { RedisService } from './common/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    ArticlesModule,
    CategoriesModule,
    TagsModule,
    MediaModule,
    HomeModule,
    CommentsModule,
    AdsModule,
    UsersModule,
  ],
  providers: [PrismaService, RedisService],
  exports: [PrismaService, RedisService],
})
export class AppModule {}
