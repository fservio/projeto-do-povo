import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('tags')
@Controller('tags')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Post()
  @Permissions({ resource: 'tags', action: 'create' })
  @ApiOperation({ summary: 'Criar tag' })
  async create(@Body() data: any) {
    return this.tagsService.create(data);
  }

  @Get()
  @Permissions({ resource: 'tags', action: 'read' })
  @ApiOperation({ summary: 'Listar tags' })
  async findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @Permissions({ resource: 'tags', action: 'read' })
  @ApiOperation({ summary: 'Buscar tag' })
  async findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @Put(':id')
  @Permissions({ resource: 'tags', action: 'update' })
  @ApiOperation({ summary: 'Atualizar tag' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.tagsService.update(id, data);
  }

  @Delete(':id')
  @Permissions({ resource: 'tags', action: 'delete' })
  @ApiOperation({ summary: 'Excluir tag' })
  async delete(@Param('id') id: string) {
    return this.tagsService.delete(id);
  }
}
