import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdsService } from './ads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ads')
@Controller('ads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdsController {
  constructor(private adsService: AdsService) {}
  
  @Get()
  async findAll(@Query() filters: any) {
    return this.adsService.findAll(filters);
  }
  
  @Post()
  async create(@Body() data: any) {
    return this.adsService.create(data);
  }
}
