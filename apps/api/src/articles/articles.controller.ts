import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('articles')
@Controller('articles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Post()
  @Permissions({ resource: 'articles', action: 'create' })
  @ApiOperation({ summary: 'Criar novo artigo' })
  async create(@Body() data: any, @Request() req) {
    return this.articlesService.create(data, req.user.userId);
  }

  @Get()
  @Permissions({ resource: 'articles', action: 'read' })
  @ApiOperation({ summary: 'Listar artigos' })
  @ApiQuery({ name: 'siteId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'authorId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(@Query() query: any) {
    return this.articlesService.findAll(query);
  }

  @Get(':id')
  @Permissions({ resource: 'articles', action: 'read' })
  @ApiOperation({ summary: 'Buscar artigo por ID' })
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Put(':id')
  @Permissions({ resource: 'articles', action: 'update' })
  @ApiOperation({ summary: 'Atualizar artigo' })
  async update(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.articlesService.update(id, data, req.user.userId);
  }

  @Put(':id/status')
  @Permissions({ resource: 'articles', action: 'update' })
  @ApiOperation({ summary: 'Alterar status do artigo' })
  async changeStatus(@Param('id') id: string, @Body() data: { status: string }, @Request() req) {
    return this.articlesService.changeStatus(id, data.status as any, req.user.userId);
  }

  @Delete(':id')
  @Permissions({ resource: 'articles', action: 'delete' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir artigo' })
  async delete(@Param('id') id: string, @Request() req) {
    await this.articlesService.delete(id, req.user.userId);
  }

  @Post(':id/lock')
  @Permissions({ resource: 'articles', action: 'update' })
  @ApiOperation({ summary: 'Bloquear artigo para edição' })
  async lock(@Param('id') id: string, @Request() req) {
    return this.articlesService.lock(id, req.user.userId);
  }

  @Post(':id/unlock')
  @Permissions({ resource: 'articles', action: 'update' })
  @ApiOperation({ summary: 'Desbloquear artigo' })
  async unlock(@Param('id') id: string, @Request() req) {
    return this.articlesService.unlock(id, req.user.userId);
  }

  @Get(':id/versions')
  @Permissions({ resource: 'articles', action: 'read' })
  @ApiOperation({ summary: 'Listar versões do artigo' })
  async getVersions(@Param('id') id: string) {
    return this.articlesService.getVersions(id);
  }

  @Post(':id/rollback')
  @Permissions({ resource: 'articles', action: 'update' })
  @ApiOperation({ summary: 'Reverter para versão anterior' })
  async rollback(@Param('id') id: string, @Body() data: { version: number }, @Request() req) {
    return this.articlesService.rollback(id, data.version, req.user.userId);
  }

  @Put(':id/checklist')
  @Permissions({ resource: 'articles', action: 'update' })
  @ApiOperation({ summary: 'Atualizar checklist editorial' })
  async updateChecklist(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.articlesService.updateChecklist(id, data, req.user.userId);
  }

  @Post(':id/view')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Incrementar visualizações' })
  async incrementViews(@Param('id') id: string) {
    await this.articlesService.incrementViews(id);
  }
}
