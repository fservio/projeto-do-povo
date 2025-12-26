import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('comments')
@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
  
  @Get()
  async findAll(@Query() filters: any) {
    return this.commentsService.findAll(filters);
  }
  
  @Post()
  async create(@Body() data: any) {
    return this.commentsService.create(data);
  }
}
