# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o CMS Portal de Notícias!

## 📋 Processo de Contribuição

### 1. Fork e Clone

```bash
# Fork no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/cms-portal-noticias.git
cd cms-portal-noticias
```

### 2. Configurar Ambiente

```bash
# Executar setup
./scripts.sh setup

# Ou manualmente
pnpm install
docker-compose up -d
pnpm db:migrate
pnpm db:seed
```

### 3. Criar Branch

Use nomes descritivos baseados no tipo de mudança:

```bash
# Features
git checkout -b feature/nome-da-feature

# Bugfixes
git checkout -b fix/descricao-do-bug

# Documentação
git checkout -b docs/descricao-da-doc

# Refactoring
git checkout -b refactor/descricao
```

### 4. Fazer Mudanças

- Escreva código limpo e bem documentado
- Siga os padrões do projeto
- Adicione testes para novas features
- Atualize documentação se necessário

### 5. Commit

Use **Conventional Commits**:

```bash
# Feature
git commit -m "feat: adiciona busca avançada de artigos"

# Bugfix
git commit -m "fix: corrige erro ao publicar artigo"

# Documentação
git commit -m "docs: atualiza guia de instalação"

# Refactoring
git commit -m "refactor: melhora performance do cache"

# Testes
git commit -m "test: adiciona testes para ArticlesService"

# Chore
git commit -m "chore: atualiza dependências"
```

**Tipos de commit**:
- `feat`: Nova feature
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Manutenção de código
- `perf`: Melhorias de performance

### 6. Push e Pull Request

```bash
# Push para seu fork
git push origin feature/nome-da-feature

# Abra Pull Request no GitHub
```

## 📝 Padrões de Código

### TypeScript

- Use **TypeScript strict mode**
- Evite `any` - use tipos específicos
- Documente funções complexas com JSDoc
- Prefira `interface` para objetos públicos
- Use `type` para unions e intersections

```typescript
// ✅ Bom
interface CreateArticleDto {
  title: string;
  content: string;
  categoryId: string;
}

// ❌ Evitar
function createArticle(data: any) { }
```

### Naming Conventions

- **Variáveis/Funções**: camelCase
- **Classes/Interfaces**: PascalCase
- **Constantes**: UPPER_SNAKE_CASE
- **Arquivos**: kebab-case.ts
- **Componentes React**: PascalCase.tsx

```typescript
// Variáveis e funções
const articleCount = 10;
function getArticleById(id: string) {}

// Classes e interfaces
class ArticleService {}
interface ArticleDto {}

// Constantes
const MAX_UPLOAD_SIZE = 5_000_000;

// Arquivos
// article-service.ts
// create-article.dto.ts
```

### Imports

Organize imports em grupos:

```typescript
// 1. Node modules
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// 2. Módulos internos
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

// 3. Tipos
import type { Article, ArticleStatus } from '@cms/database';
```

### Funções

- Funções pequenas e focadas (< 30 linhas)
- Nome descritivo da ação
- Máximo 3-4 parâmetros
- Use object para muitos parâmetros

```typescript
// ✅ Bom
async function createArticle({
  title,
  content,
  authorId,
  categoryId,
}: CreateArticleParams) {
  // ...
}

// ❌ Evitar
async function create(t, c, a, cat, s, p, f) {
  // ...
}
```

### Comentários

- Comente **por que**, não **o que**
- Use JSDoc para funções públicas
- Evite comentários óbvios

```typescript
// ✅ Bom
/**
 * Cria uma nova versão do artigo para manter histórico.
 * Necessário para permitir rollback futuro.
 */
async function createVersion(articleId: string) { }

// ❌ Evitar
// Cria versão
async function createVersion(articleId: string) { }
```

### Error Handling

- Use exceções específicas do NestJS
- Sempre trate erros
- Log de erros apropriadamente

```typescript
// ✅ Bom
async function findArticle(id: string) {
  const article = await prisma.article.findUnique({ where: { id } });
  
  if (!article) {
    throw new NotFoundException('Artigo não encontrado');
  }
  
  return article;
}

// ❌ Evitar
async function findArticle(id: string) {
  return await prisma.article.findUnique({ where: { id } });
}
```

### Async/Await

- Prefira async/await sobre Promises
- Use Promise.all para operações paralelas
- Sempre trate erros

```typescript
// ✅ Bom
async function loadArticleData(id: string) {
  const [article, comments, related] = await Promise.all([
    getArticle(id),
    getComments(id),
    getRelated(id),
  ]);
  
  return { article, comments, related };
}

// ❌ Evitar
function loadArticleData(id: string) {
  return getArticle(id).then(article => {
    return getComments(id).then(comments => {
      return getRelated(id).then(related => {
        return { article, comments, related };
      });
    });
  });
}
```

## 🧪 Testes

### Estrutura de Testes

```
src/
├── articles/
│   ├── articles.service.ts
│   ├── articles.service.spec.ts   # Unit tests
│   ├── articles.controller.ts
│   └── articles.controller.spec.ts
└── test/
    └── articles.e2e-spec.ts        # E2E tests
```

### Cobertura Mínima

- **Unit tests**: 70% de cobertura
- **Integration tests**: Fluxos críticos
- **E2E tests**: Cenários principais

### Executar Testes

```bash
# Todos os testes
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E
pnpm test:e2e
```

### Exemplo de Teste

```typescript
describe('ArticlesService', () => {
  let service: ArticlesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ArticlesService, PrismaService],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create an article', async () => {
      const dto = {
        title: 'Test Article',
        content: 'Content',
        authorId: 'author-id',
        categoryId: 'category-id',
      };

      const result = await service.create(dto, 'user-id');

      expect(result).toBeDefined();
      expect(result.title).toBe(dto.title);
      expect(result.status).toBe('DRAFT');
    });

    it('should throw if slug already exists', async () => {
      const dto = {
        title: 'Test',
        slug: 'existing-slug',
        // ...
      };

      await expect(service.create(dto, 'user-id'))
        .rejects
        .toThrow(ConflictException);
    });
  });
});
```

## 📚 Documentação

### Quando Documentar

- Novas features
- Mudanças em APIs
- Mudanças em configuração
- Novos conceitos

### Onde Documentar

- **README.md**: Visão geral e setup
- **ARCHITECTURE.md**: Decisões técnicas
- **Código**: JSDoc para funções públicas
- **API**: Swagger annotations

### Exemplo de JSDoc

```typescript
/**
 * Cria um novo artigo no sistema.
 * 
 * @param data - Dados do artigo
 * @param userId - ID do usuário criador
 * @returns Artigo criado com status DRAFT
 * @throws {ConflictException} Se slug já existe
 * @throws {NotFoundException} Se categoria não existe
 * 
 * @example
 * const article = await service.create({
 *   title: 'Novo Artigo',
 *   slug: 'novo-artigo',
 *   content: '<p>Conteúdo</p>',
 *   authorId: 'author-id',
 *   categoryId: 'category-id'
 * }, 'user-id');
 */
async function create(data: CreateArticleDto, userId: string): Promise<Article> {
  // ...
}
```

## 🔍 Code Review

### Checklist do Autor

Antes de abrir PR:

- [ ] Código compila sem erros
- [ ] Testes passam
- [ ] Lint sem erros
- [ ] Documentação atualizada
- [ ] Commit messages seguem padrão
- [ ] PR tem descrição clara

### Checklist do Reviewer

Ao revisar PR:

- [ ] Código segue padrões do projeto
- [ ] Lógica está correta
- [ ] Testes adequados
- [ ] Performance adequada
- [ ] Segurança considerada
- [ ] Documentação suficiente

## 🐛 Reportar Bugs

Use o template de issue:

```markdown
### Descrição
Descrição clara do bug

### Passos para Reproduzir
1. Fazer login
2. Criar artigo
3. Clicar em publicar
4. Ver erro

### Comportamento Esperado
Artigo deveria ser publicado

### Comportamento Atual
Erro 500

### Ambiente
- OS: macOS 14
- Node: 18.17.0
- pnpm: 8.14.0

### Logs
```
[error] ...
```
```

## 💡 Sugerir Features

Use o template de issue:

```markdown
### Descrição
Descrição da feature

### Motivação
Por que essa feature é útil

### Proposta de Implementação
Como poderia ser implementada

### Alternativas Consideradas
Outras abordagens possíveis
```

## 📬 Contato

- **Issues**: Para bugs e features
- **Discussions**: Para perguntas gerais
- **Email**: dev@dopovo.com.br

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT).

---

**Obrigado por contribuir! 🎉**
