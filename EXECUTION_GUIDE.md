# 🚀 Guia de Execução Imediata

## ⚡ TL;DR - Começar Agora

```bash
# 1. Setup completo (uma vez)
./scripts.sh setup

# 2. Iniciar desenvolvimento
./scripts.sh dev

# 3. Acessar
# API: http://localhost:4000/api/docs
# Login: superadmin@dopovo.com.br / senha123
```

## 📋 Pré-requisitos

Certifique-se de ter instalado:
- Node.js 18+ 
- pnpm 8+
- Docker
- Docker Compose

## 🎯 Cenários de Uso

### Cenário 1: Setup Inicial (Primeira Vez)

```bash
# Verificar pré-requisitos
node --version   # Deve ser 18+
pnpm --version   # Deve ser 8+
docker --version
docker-compose --version

# Executar setup completo
./scripts.sh setup

# Aguardar conclusão (2-3 minutos)
# ✓ Dependências instaladas
# ✓ Serviços Docker iniciados
# ✓ Banco de dados criado
# ✓ Dados demo populados
```

### Cenário 2: Desenvolvimento Diário

```bash
# Verificar saúde dos serviços
./scripts.sh health

# Se algum serviço estiver OFF:
docker-compose up -d

# Iniciar desenvolvimento
./scripts.sh dev

# Isso abre 3 terminais virtuais:
# - API em http://localhost:4000
# - Admin em http://localhost:3001 (quando implementado)
# - Web em http://localhost:3000 (quando implementado)
```

### Cenário 3: Testar API

```bash
# Abrir Swagger UI
open http://localhost:4000/api/docs

# Ou via curl:

# 1. Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@dopovo.com.br","password":"senha123"}' | jq

# 2. Copiar o accessToken do retorno

# 3. Listar artigos
curl http://localhost:4000/articles \
  -H "Authorization: Bearer SEU_TOKEN" | jq

# 4. Buscar artigo específico
curl http://localhost:4000/articles/ARTICLE_ID \
  -H "Authorization: Bearer SEU_TOKEN" | jq
```

### Cenário 4: Explorar Banco de Dados

```bash
# Abrir Prisma Studio
./scripts.sh studio

# Acesse: http://localhost:5555
# Você pode:
# - Ver todos os dados
# - Editar registros
# - Criar novos registros
# - Explorar relações
```

### Cenário 5: Backup e Restore

```bash
# Criar backup
./scripts.sh backup
# Gera: backup_YYYYMMDD_HHMMSS.sql

# Restaurar backup
./scripts.sh restore backup_20240115_120000.sql
```

### Cenário 6: Reset Completo

```bash
# Se algo der errado, reset tudo:
./scripts.sh reset

# Depois refazer setup:
./scripts.sh setup
```

### Cenário 7: Ver Logs

```bash
# Todos os logs
./scripts.sh logs

# Log de serviço específico
./scripts.sh logs postgres
./scripts.sh logs redis
./scripts.sh logs api

# Parar logs: Ctrl+C
```

## 🔍 Verificações Importantes

### Verificar se serviços estão rodando

```bash
./scripts.sh health

# Deve mostrar:
# ✓ PostgreSQL: OK
# ✓ Redis: OK
# ✓ Meilisearch: OK
# ✓ MinIO: OK
```

### Verificar portas em uso

```bash
# API deve estar em 4000
curl -I http://localhost:4000/health

# Prisma Studio pode usar 5555
# PostgreSQL usa 5432
# Redis usa 6379
# Meilisearch usa 7700
# MinIO usa 9000 e 9001
```

## 🐛 Troubleshooting Rápido

### Problema: "pnpm: command not found"
```bash
npm install -g pnpm@8
```

### Problema: "docker: command not found"
```bash
# Instale Docker Desktop
# https://www.docker.com/products/docker-desktop
```

### Problema: Porta 4000 já em uso
```bash
# Descobrir processo
lsof -i :4000

# Matar processo
kill -9 PID

# Ou mudar porta no .env
echo "API_PORT=4001" >> .env
```

### Problema: "Error connecting to PostgreSQL"
```bash
# Verificar container
docker-compose ps postgres

# Se parado, iniciar
docker-compose up -d postgres

# Ver logs
docker-compose logs postgres

# Restart
docker-compose restart postgres
```

### Problema: Prisma Client não encontrado
```bash
cd packages/database
npx prisma generate
cd ../..
```

### Problema: Erro nas migrações
```bash
# Reset banco (CUIDADO: apaga dados)
./scripts.sh reset
./scripts.sh setup
```

## 📊 Acessos Rápidos

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| API Swagger | http://localhost:4000/api/docs | N/A |
| API Health | http://localhost:4000/health | N/A |
| Prisma Studio | http://localhost:5555 | N/A |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin |
| Meilisearch | http://localhost:7700 | masterKey |
| Admin (futuro) | http://localhost:3001 | superadmin@dopovo.com.br |
| Web (futuro) | http://localhost:3000 | N/A |

## 🎓 Usuários Demo

Após o seed, você tem 3 usuários:

### SuperAdmin (Acesso Total)
- **Email**: superadmin@dopovo.com.br
- **Senha**: senha123
- **Pode**: Tudo

### Editor-Chefe
- **Email**: editor@dopovo.com.br
- **Senha**: senha123
- **Pode**: Gerenciar conteúdo, publicar

### Repórter
- **Email**: reporter@dopovo.com.br
- **Senha**: senha123
- **Pode**: Criar e editar artigos

## ✨ Fluxos Práticos

### Criar um Artigo

```bash
# 1. Login via Swagger
# http://localhost:4000/api/docs

# 2. POST /auth/login
{
  "email": "reporter@dopovo.com.br",
  "password": "senha123"
}

# 3. Copiar accessToken

# 4. Authorize no Swagger (botão no topo direito)

# 5. POST /articles
{
  "siteId": "ID_DO_SITE", # Ver no Prisma Studio
  "title": "Minha Primeira Notícia",
  "slug": "minha-primeira-noticia",
  "content": "<p>Conteúdo da notícia em HTML</p>",
  "excerpt": "Resumo da notícia",
  "authorId": "ID_DO_AUTOR", # Ver no Prisma Studio
  "categoryId": "ID_DA_CATEGORIA" # Ver no Prisma Studio
}

# 6. Artigo criado com status DRAFT
```

### Publicar um Artigo

```bash
# 1. Login como Editor-Chefe
# 2. GET /articles - listar artigos
# 3. PUT /articles/{id}/status
{
  "status": "PUBLISHED"
}
# 4. Artigo publicado!
```

### Explorar Versões

```bash
# 1. GET /articles/{id}/versions
# 2. Ver histórico completo
# 3. POST /articles/{id}/rollback
{
  "version": 1
}
# 4. Artigo revertido para versão 1
```

## 🎯 Próximos Passos

Depois de rodar o projeto:

1. **Explorar API**
   - Abrir Swagger
   - Testar todos os endpoints
   - Ver validações e erros

2. **Explorar Banco**
   - Abrir Prisma Studio
   - Ver todas as entidades
   - Entender relações

3. **Ler Documentação**
   - README.md: Visão geral
   - ARCHITECTURE.md: Detalhes técnicos
   - QA_CHECKLIST.md: O que funciona

4. **Contribuir**
   - Ler CONTRIBUTING.md
   - Escolher uma feature
   - Fazer PR

## 📞 Ajuda

Se tiver problemas:

1. Verificar logs: `./scripts.sh logs`
2. Verificar saúde: `./scripts.sh health`
3. Ler troubleshooting acima
4. Abrir issue no GitHub

## 🎉 Pronto!

Agora você tem um CMS completo rodando localmente!

**Explore, teste e contribua!** 🚀
