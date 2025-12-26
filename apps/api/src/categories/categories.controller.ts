import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @Permissions({ resource: 'categories', action: 'create' })
  @ApiOperation({ summary: 'Criar categoria' })
  async create(@Body() data: any) {
    return this.categoriesService.create(data);
  }

  @Get()
  @Permissions({ resource: 'categories', action: 'read' })
  @ApiOperation({ summary: 'Listar categorias' })
  async findAll(@Query('siteId') siteId?: string) {
    return this.categoriesService.findAll(siteId);
  }

  @Get(':id')
  @Permissions({ resource: 'categories', action: 'read' })
  @ApiOperation({ summary: 'Buscar categoria' })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  @Permissions({ resource: 'categories', action: 'update' })
  @ApiOperation({ summary: 'Atualizar categoria' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.categoriesService.update(id, data);
  }

  @Delete(':id')
  @Permissions({ resource: 'categories', action: 'delete' })
  @ApiOperation({ summary: 'Excluir categoria' })
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }

  @Post('reorder')
  @Permissions({ resource: 'categories', action: 'update' })
  @ApiOperation({ summary: 'Reordenar categorias' })
  async reorder(@Body() data: { siteId: string; categoryIds: string[] }) {
    return this.categoriesService.reorder(data.siteId, data.categoryIds);
  }
}
