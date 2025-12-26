import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('media')
@Controller('media')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  async upload(@Body() data: any) {
    return this.mediaService.upload(data, 'userId');
  }

  @Get()
  async findAll(@Query() filters: any) {
    return this.mediaService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.mediaService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.mediaService.delete(id);
  }
}
