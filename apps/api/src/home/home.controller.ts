import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HomeService } from './home.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('home')
@Controller('home')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HomeController {
  constructor(private homeService: HomeService) {}
  
  @Get()
  async findAll(@Query('siteId') siteId: string) {
    return this.homeService.findAll(siteId);
  }
  
  @Get('active')
  async findActive(@Query('siteId') siteId: string) {
    return this.homeService.findActive(siteId);
  }
  
  @Post()
  async create(@Body() data: any) {
    return this.homeService.create(data, 'userId');
  }
  
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.homeService.update(id, data);
  }
}
