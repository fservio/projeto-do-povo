# 🚀 Guia de Início Rápido

## Instalação em 5 Passos

### 1. Instalar dependências globais

```bash
# Instalar pnpm (se não tiver)
npm install -g pnpm@8
```

### 2. Instalar dependências do projeto

```bash
cd /home/user/webapp
pnpm install
```

### 3. Configurar ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# O arquivo .env já está configurado para desenvolvimento local
# Não precisa alterar nada para começar
```

### 4. Iniciar infraestrutura

```bash
# Subir Postgres, Redis, Meilisearch e MinIO
docker-compose up -d

# Aguardar todos os serviços ficarem saudáveis (cerca de 30s)
docker-compose ps
```

### 5. Configurar banco de dados

```bash
# Gerar cliente Prisma
cd packages/database && npx prisma generate && cd ../..

# Criar tabelas
pnpm db:migrate

# Popular com dados demo
pnpm db:seed
```

### 6. Iniciar aplicação

```bash
# Iniciar todos os apps (API, Admin, Web)
pnpm dev
```

## ✅ Verificar Instalação

Acesse:

- **API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs
- **Admin**: http://localhost:3001 (quando implementado)
- **Web**: http://localhost:3000 (quando implementado)

## 🔑 Login

Use um dos usuários demo criados pelo seed:

**SuperAdmin**
- Email: `superadmin@dopovo.com.br`
- Senha: `senha123`

**Editor-Chefe**
- Email: `editor@dopovo.com.br`
- Senha: `senha123`

**Repórter**
- Email: `reporter@dopovo.com.br`
- Senha: `senha123`

## 🧪 Testar API

### 1. Fazer login

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@dopovo.com.br",
    "password": "senha123"
  }'
```

Copie o `accessToken` do retorno.

### 2. Listar artigos

```bash
curl http://localhost:4000/articles \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 3. Criar artigo

```bash
curl -X POST http://localhost:4000/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "siteId": "ID_DO_SITE",
    "title": "Novo artigo",
    "slug": "novo-artigo",
    "content": "<p>Conteúdo do artigo</p>",
    "authorId": "ID_DO_AUTOR",
    "categoryId": "ID_DA_CATEGORIA"
  }'
```

## 📊 Explorar Banco de Dados

```bash
# Abrir Prisma Studio
pnpm db:studio
```

Acesse: http://localhost:5555

## 🐛 Troubleshooting

### Porta já em uso

Se alguma porta estiver em uso, edite o `.env`:

```bash
API_PORT=4001
WEB_PORT=3001
ADMIN_PORT=3002
```

### Erro nas migrações

```bash
# Reset completo do banco
pnpm db:reset
```

### Containers não sobem

```bash
# Ver logs
docker-compose logs

# Reiniciar
docker-compose down
docker-compose up -d
```

### Prisma Client não encontrado

```bash
cd packages/database
npx prisma generate
```

## 🎯 Próximos Passos

1. Explorar a API via Swagger: http://localhost:4000/api/docs
2. Estudar o schema Prisma: `packages/database/prisma/schema.prisma`
3. Ver exemplos de artigos no seed: `packages/database/src/seed.ts`
4. Implementar frontend Admin (Next.js)
5. Implementar frontend Web (Next.js)

## 📚 Estrutura do Código

```
apps/api/src/
├── auth/           # Autenticação e autorização
├── articles/       # CRUD de artigos com workflow
├── categories/     # Gestão de categorias
├── tags/           # Gestão de tags
├── media/          # Upload e gestão de mídia
├── home/           # Home page builder
├── comments/       # Sistema de comentários
├── ads/            # Publicidade
├── users/          # Gestão de usuários
└── common/         # Serviços compartilhados
```

## 🔐 Testando Permissões

Cada role tem permissões diferentes. Teste com usuários diferentes para ver o RBAC em ação:

- **SuperAdmin**: Acesso total
- **Editor-Chefe**: Pode publicar e gerenciar conteúdo
- **Repórter**: Pode criar e editar artigos (mas não publicar)

## 💡 Dicas

1. Use Prisma Studio para explorar dados
2. Use Swagger para testar API
3. Veja logs da API no terminal
4. Redis e Meilisearch rodam automaticamente
5. MinIO (S3 local) está em http://localhost:9001

## 🎓 Aprender Mais

- [Documentação completa](README.md)
- [Schema Prisma](packages/database/prisma/schema.prisma)
- [API Swagger](http://localhost:4000/api/docs)
