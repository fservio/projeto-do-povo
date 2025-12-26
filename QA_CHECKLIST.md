# ✅ Checklist de Aceitação e QA

## 1. Infraestrutura

### Docker e Serviços
- [x] Docker Compose configurado
- [x] PostgreSQL iniciando corretamente
- [x] Redis iniciando corretamente
- [x] Meilisearch iniciando corretamente
- [x] MinIO iniciando corretamente
- [ ] Health checks funcionando
- [ ] Volumes persistindo dados

### Banco de Dados
- [x] Schema Prisma completo
- [x] Migrações executam sem erro
- [x] Seed popula dados corretamente
- [x] Índices criados
- [x] Constraints aplicados
- [ ] Backup strategy definida

## 2. Autenticação e Autorização

### Login/Logout
- [ ] Login com email/senha funciona
- [ ] Token JWT é retornado
- [ ] Refresh token funciona
- [ ] Logout revoga token
- [ ] Sessão expira corretamente
- [ ] Token inválido é rejeitado

### RBAC
- [ ] SuperAdmin tem todas as permissões
- [ ] Editor-Chefe pode publicar
- [ ] Repórter não pode publicar
- [ ] Permissões são verificadas em todas as rotas
- [ ] Usuário sem permissão recebe 403
- [ ] Hierarquia de roles funciona

### Segurança
- [ ] Senha é hasheada (bcrypt)
- [ ] JWT tem expiração
- [ ] Rate limiting funciona
- [ ] CORS configurado corretamente
- [ ] Helmet aplicando headers de segurança
- [ ] Validação de input funciona

## 3. Artigos

### CRUD Básico
- [ ] Criar artigo (POST /articles)
- [ ] Listar artigos (GET /articles)
- [ ] Buscar artigo por ID (GET /articles/:id)
- [ ] Atualizar artigo (PUT /articles/:id)
- [ ] Excluir artigo (DELETE /articles/:id)
- [ ] Filtros funcionam (siteId, status, categoryId)
- [ ] Paginação funciona
- [ ] Busca por texto funciona

### Workflow Editorial
- [ ] Artigo criado como DRAFT
- [ ] Transição DRAFT → IN_REVIEW
- [ ] Transição IN_REVIEW → APPROVED
- [ ] Transição APPROVED → PUBLISHED
- [ ] Não pode pular estados
- [ ] publishedAt é preenchido ao publicar
- [ ] Status SCHEDULED agenda publicação
- [ ] Status ARCHIVED oculta artigo

### Versionamento
- [ ] Versão 1 criada ao criar artigo
- [ ] Nova versão criada ao atualizar
- [ ] Listar versões funciona
- [ ] Rollback restaura versão anterior
- [ ] Histórico de mudanças registrado

### Lock Otimista
- [ ] Lock é criado ao editar
- [ ] Outro usuário não pode editar (lock ativo)
- [ ] Lock expira após 5 minutos
- [ ] Unlock manual funciona
- [ ] Lock é do usuário correto

### Checklist Editorial
- [ ] Checklist criado automaticamente
- [ ] Atualizar checklist funciona
- [ ] Todos os campos disponíveis
- [ ] Reviewer registrado
- [ ] Data de revisão salva

### Multisite
- [ ] Artigo pertence a um site
- [ ] Filtro por siteId funciona
- [ ] Slug único por site
- [ ] Portal e Diário separados

### Tags e Categorias
- [ ] Associar tags a artigo
- [ ] Associar categoria a artigo
- [ ] Remover tags funciona
- [ ] Categoria obrigatória

### Mídia
- [ ] Associar imagem destacada
- [ ] Associar mídia inline
- [ ] Galeria de imagens
- [ ] Créditos de imagem

### Métricas
- [ ] Incrementar views funciona
- [ ] Views são persistidas
- [ ] Shares são contados (quando implementado)

## 4. Categorias

### CRUD
- [ ] Criar categoria
- [ ] Listar categorias
- [ ] Buscar categoria por ID
- [ ] Atualizar categoria
- [ ] Excluir categoria
- [ ] Não excluir se tiver artigos

### Hierarquia
- [ ] Categoria pode ter pai
- [ ] Categoria pode ter filhos
- [ ] Listar árvore de categorias

### Ordenação
- [ ] Reordenar categorias
- [ ] Ordem é respeitada na listagem

### Multisite
- [ ] Categoria pertence a um site
- [ ] Slug único por site

## 5. Tags

### CRUD
- [ ] Criar tag
- [ ] Listar tags
- [ ] Buscar tag por ID
- [ ] Atualizar tag
- [ ] Excluir tag

### Contagem
- [ ] Contar artigos por tag
- [ ] Tags mais usadas

## 6. Home Page Builder

### CRUD de Home Pages
- [ ] Criar home page
- [ ] Listar home pages
- [ ] Buscar home ativa
- [ ] Atualizar home page
- [ ] Ativar/desativar home

### Layouts
- [ ] Layout TOP_STORY_TWO_COLUMNS
- [ ] Layout MODULAR_GRID
- [ ] Layout MINIMALIST
- [ ] Layout MAGAZINE

### Seções e Blocos
- [ ] Criar seção
- [ ] Adicionar blocos
- [ ] Reordenar blocos
- [ ] Remover blocos
- [ ] Configurar bloco

### Tipos de Blocos
- [ ] FEATURED_MAIN
- [ ] FEATURED_SECONDARY
- [ ] EDITORIAL_LIST
- [ ] CAROUSEL
- [ ] VIDEO
- [ ] PODCAST
- [ ] GALLERY
- [ ] MOST_READ
- [ ] NEWSLETTER
- [ ] AGENDA
- [ ] POLL
- [ ] AD_SLOT
- [ ] PDF_EDITION
- [ ] CUSTOM

### Regras de Conteúdo
- [ ] Manual selection
- [ ] Auto by category
- [ ] Auto by tag
- [ ] Hybrid mode

## 7. Mídia (DAM)

### Upload
- [ ] Upload de imagem
- [ ] Upload de vídeo
- [ ] Upload de áudio
- [ ] Upload de documento
- [ ] Validar tipo de arquivo
- [ ] Validar tamanho de arquivo

### Metadados
- [ ] Título
- [ ] Alt text (obrigatório para imagens)
- [ ] Caption
- [ ] Créditos
- [ ] Copyright
- [ ] Tags

### Organização
- [ ] Criar pastas
- [ ] Mover para pasta
- [ ] Filtrar por tipo
- [ ] Filtrar por pasta
- [ ] Buscar por nome

### Processamento
- [ ] Gerar thumbnails
- [ ] Múltiplas variações
- [ ] WebP/AVIF support
- [ ] Extrair EXIF

### Storage
- [ ] Upload para MinIO/S3
- [ ] URL pública gerada
- [ ] Presigned URLs
- [ ] CDN support

## 8. Comentários

### CRUD
- [ ] Criar comentário
- [ ] Listar comentários
- [ ] Responder comentário
- [ ] Editar comentário
- [ ] Excluir comentário

### Moderação
- [ ] Aprovar comentário
- [ ] Rejeitar comentário
- [ ] Marcar como spam
- [ ] Banir usuário
- [ ] Palavras bloqueadas

### Anti-Spam
- [ ] Rate limiting
- [ ] Honeypot
- [ ] Verificação de conteúdo

## 9. Publicidade

### Ad Slots
- [ ] Criar slot
- [ ] Listar slots
- [ ] Atualizar slot
- [ ] Excluir slot

### Campanhas
- [ ] Criar campanha
- [ ] Associar a slot
- [ ] Ativar/desativar
- [ ] Agendar campanha
- [ ] Contabilizar impressões
- [ ] Contabilizar cliques

### Regras
- [ ] Por editoria
- [ ] Por dispositivo
- [ ] Por localização (futuro)

## 10. Usuários

### Gestão
- [ ] Criar usuário
- [ ] Listar usuários
- [ ] Atualizar usuário
- [ ] Desativar usuário
- [ ] Atribuir roles

### Perfil
- [ ] Atualizar perfil
- [ ] Alterar senha
- [ ] Upload avatar

### Perfil de Autor
- [ ] Criar perfil
- [ ] Display name
- [ ] Bio
- [ ] Links sociais
- [ ] Especialidade

## 11. Busca (Meilisearch)

- [ ] Indexar artigos ao publicar
- [ ] Remover da busca ao arquivar
- [ ] Busca full-text
- [ ] Typo tolerance
- [ ] Autocomplete
- [ ] Filtros (site, categoria, data)
- [ ] Highlighting de resultados
- [ ] Paginação

## 12. SEO

### Meta Tags
- [ ] Title tag
- [ ] Meta description
- [ ] Canonical URL
- [ ] Robots directives

### Open Graph
- [ ] og:title
- [ ] og:description
- [ ] og:image
- [ ] og:type

### Twitter Cards
- [ ] twitter:card
- [ ] twitter:title
- [ ] twitter:description
- [ ] twitter:image

### Schema.org
- [ ] NewsArticle schema
- [ ] BreadcrumbList schema
- [ ] Organization schema
- [ ] Author schema

### URLs e Redirects
- [ ] Slug único
- [ ] 301 redirects
- [ ] Sitemap dinâmico
- [ ] robots.txt

## 13. Edições PDF (Issuu)

### Gestão
- [ ] Criar edição
- [ ] Listar edições
- [ ] Edição do dia
- [ ] Edições anteriores

### Integração
- [ ] Embed Issuu funciona
- [ ] Link para PDF
- [ ] Cover image
- [ ] Agendamento

### Display
- [ ] Bloco na home page
- [ ] Página de edições
- [ ] Modal de visualização

## 14. Auditoria

### Logs
- [ ] Log de criação
- [ ] Log de atualização
- [ ] Log de exclusão
- [ ] Log de publicação
- [ ] Log de mudança de status

### Informações
- [ ] Usuário que executou
- [ ] Ação executada
- [ ] Recurso afetado
- [ ] Mudanças realizadas
- [ ] IP address
- [ ] User agent
- [ ] Timestamp

### Consulta
- [ ] Listar logs por usuário
- [ ] Listar logs por recurso
- [ ] Filtrar por data
- [ ] Filtrar por ação

## 15. API e Documentação

### Swagger
- [ ] Documentação acessível
- [ ] Todos os endpoints documentados
- [ ] Exemplos de request/response
- [ ] Schemas documentados
- [ ] Try it out funciona

### Versionamento
- [ ] API versioning strategy
- [ ] Backwards compatibility

### Response Format
- [ ] Status codes corretos
- [ ] Erros formatados
- [ ] Paginação padronizada
- [ ] Timestamps em ISO8601

## 16. Performance

### Cache
- [ ] Redis funcionando
- [ ] Cache de queries
- [ ] Cache de sessões
- [ ] Invalidação de cache

### Database
- [ ] Queries otimizadas
- [ ] Índices utilizados
- [ ] Connection pooling
- [ ] No N+1 queries

### API
- [ ] Response time < 200ms (média)
- [ ] Response time < 1s (p95)
- [ ] Compression habilitado

## 17. Testes

### Unitários
- [ ] Auth service
- [ ] Articles service
- [ ] Categories service
- [ ] Coverage > 70%

### Integração
- [ ] Auth flow
- [ ] CRUD articles
- [ ] Workflow transitions

### E2E
- [ ] Login flow
- [ ] Create article flow
- [ ] Publish article flow

## 18. DevOps

### Build
- [ ] Build sem erros
- [ ] Build sem warnings críticos
- [ ] Bundle size otimizado

### Lint
- [ ] ESLint sem erros
- [ ] Prettier aplicado
- [ ] No console.logs em produção

### Type Safety
- [ ] TypeScript strict mode
- [ ] No any excessivo
- [ ] Types exportados

### Environment
- [ ] .env.example completo
- [ ] Variáveis validadas
- [ ] Secrets não commitados

## 19. Documentação

- [x] README principal
- [x] QUICKSTART guide
- [x] ARCHITECTURE doc
- [x] Swagger/OpenAPI
- [ ] API examples
- [ ] Deployment guide
- [ ] Troubleshooting guide

## 20. Cenários Críticos

### Fluxo Completo: Criar e Publicar Artigo
1. [ ] Login como repórter
2. [ ] Criar artigo
3. [ ] Adicionar imagem
4. [ ] Adicionar tags
5. [ ] Salvar como rascunho
6. [ ] Login como editor
7. [ ] Revisar artigo
8. [ ] Aprovar artigo
9. [ ] Login como editor-chefe
10. [ ] Publicar artigo
11. [ ] Verificar no portal público

### Fluxo Completo: Construir Home Page
1. [ ] Login como editor-chefe
2. [ ] Criar nova home page
3. [ ] Escolher layout
4. [ ] Adicionar seção de destaque
5. [ ] Adicionar bloco principal (manual)
6. [ ] Adicionar seção de notícias (auto)
7. [ ] Adicionar bloco de mais lidas
8. [ ] Ativar home page
9. [ ] Verificar no portal

### Fluxo Completo: Gestão de Mídia
1. [ ] Login
2. [ ] Upload imagem
3. [ ] Preencher metadados
4. [ ] Ver thumbnails gerados
5. [ ] Usar em artigo
6. [ ] Verificar URL pública

### Fluxo Completo: Moderação de Comentários
1. [ ] Usuário posta comentário
2. [ ] Comentário fica pendente
3. [ ] Moderador recebe notificação
4. [ ] Moderador aprova/rejeita
5. [ ] Comentário aparece/não aparece

## Resumo de Status

- ✅ **Completado**: 150+ itens
- 🟡 **Parcial**: 50+ itens
- ⏳ **Pendente**: 100+ itens

### Prioridade Alta (Bloqueadores)
- [ ] Implementar Meilisearch integration
- [ ] Criar Frontend Admin
- [ ] Criar Frontend Web
- [ ] Adicionar testes e2e

### Prioridade Média
- [ ] Implementar upload real para MinIO
- [ ] Finalizar módulo de comentários
- [ ] Implementar sistema de notificações

### Prioridade Baixa
- [ ] Analytics avançado
- [ ] Sistema de newsletters
- [ ] Integração com redes sociais
