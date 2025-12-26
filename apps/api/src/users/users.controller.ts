import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}
  
  @Get()
  async findAll(@Query() filters: any) {
    return this.usersService.findAll(filters);
  }
  
  @Post()
  async create(@Body() data: any) {
    return this.usersService.create(data);
  }
}
