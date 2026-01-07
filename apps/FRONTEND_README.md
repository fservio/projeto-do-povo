# 🎨 Frontends - Admin & Web

## Status da Implementação

### ✅ Estrutura Base Criada

#### Admin (/apps/admin)
- ✅ Next.js 14 com App Router
- ✅ TypeScript configurado
- ✅ Tailwind CSS
- ✅ Dependências instaladas:
  - NextAuth para autenticação
  - TipTap para editor rico
  - React Query para cache
  - React Hook Form + Zod para formulários
  - React DnD para drag-and-drop
  - Lucide React para ícones

#### Web (/apps/web)
- 🟡 Estrutura similar ao Admin
- 🟡 Focado em SSR/ISR
- 🟡 Páginas públicas

## 📦 Arquivos Criados

### Admin
```
apps/admin/
├── package.json          ✅ Dependências completas
├── tsconfig.json         ✅ TypeScript configurado
├── next.config.js        ✅ Next.js configurado
├── tailwind.config.js    ✅ Tailwind configurado
├── postcss.config.js     ⏳ A criar
└── src/
    ├── app/
    │   ├── layout.tsx          ✅ Layout raiz
    │   ├── globals.css         ✅ Estilos base
    │   ├── (auth)/            ⏳ Login/Logout
    │   └── (dashboard)/       ⏳ Dashboard
    ├── components/
    │   ├── providers.tsx       ✅ Providers (React Query, Session)
    │   ├── ui/                ⏳ Componentes UI
    │   ├── editor/            ⏳ Editor TipTap
    │   └── forms/             ⏳ Formulários
    ├── lib/
    │   ├── api.ts             ⏳ Cliente API
    │   └── auth.ts            ⏳ NextAuth config
    ├── hooks/                 ⏳ Custom hooks
    └── types/                 ⏳ TypeScript types
```

## 🚀 Próximas Implementações Necessárias

### Prioridade Alta

1. **NextAuth Configuration**
   ```typescript
   // src/lib/auth.ts
   // Configurar providers e callbacks
   ```

2. **API Client**
   ```typescript
   // src/lib/api.ts
   // Axios instance com interceptors
   ```

3. **Login Page**
   ```typescript
   // src/app/(auth)/login/page.tsx
   ```

4. **Dashboard Layout**
   ```typescript
   // src/app/(dashboard)/layout.tsx
   // Sidebar + Header
   ```

5. **Articles List**
   ```typescript
   // src/app/(dashboard)/articles/page.tsx
   ```

6. **Article Editor**
   ```typescript
   // src/app/(dashboard)/articles/[id]/page.tsx
   // Com TipTap editor
   ```

### Prioridade Média

7. **Categories/Tags CRUD**
8. **Media Library**
9. **Home Builder**
10. **User Management**

## 💻 Como Desenvolver

### Instalar Dependências

```bash
cd /home/user/webapp
pnpm install
```

### Executar Admin em Desenvolvimento

```bash
pnpm --filter @cms/admin dev
```

Ou use o script:
```bash
./scripts.sh dev
```

### Build para Produção

```bash
pnpm --filter @cms/admin build
pnpm --filter @cms/admin start
```

## 🎯 Arquitetura dos Frontends

### Admin (CMS)

**Objetivo**: Interface administrativa para gestão de conteúdo

**Páginas Principais**:
- `/login` - Autenticação
- `/dashboard` - Visão geral
- `/articles` - Listagem de artigos
- `/articles/new` - Criar artigo
- `/articles/[id]` - Editar artigo
- `/categories` - Gestão de categorias
- `/tags` - Gestão de tags
- `/media` - Biblioteca de mídia
- `/home-builder` - Construtor de home page
- `/users` - Gestão de usuários
- `/settings` - Configurações

**Features**:
- ✅ Autenticação com NextAuth
- ✅ RBAC (verificação client-side)
- ✅ Editor rico (TipTap)
- ✅ Drag-and-drop (home builder)
- ✅ Upload de mídia
- ✅ Preview de artigos
- ✅ Versionamento visual

### Web (Portal Público)

**Objetivo**: Portal de notícias público

**Páginas Principais**:
- `/` - Home page (dinâmica via CMS)
- `/[categoria]/[slug]` - Artigo
- `/[categoria]` - Listagem por categoria
- `/tag/[slug]` - Listagem por tag
- `/autor/[slug]` - Artigos do autor
- `/busca` - Busca
- `/edicoes` - Edições PDF (Diário)

**Features**:
- SSR para SEO
- ISR com revalidação
- Otimização de imagens
- Schema.org markup
- RSS feed
- Sitemap dinâmico

## 📚 Bibliotecas Principais

### Admin

- **Next.js 14**: Framework React com App Router
- **NextAuth**: Autenticação
- **TipTap**: Editor de texto rico
- **React Query**: Cache e sincronização
- **React Hook Form**: Formulários
- **Zod**: Validação de schemas
- **React DnD**: Drag and drop
- **Tailwind CSS**: Estilização
- **Lucide React**: Ícones
- **Sonner**: Notificações toast

### Web

- **Next.js 14**: SSR/ISR
- **Sharp**: Otimização de imagens
- **date-fns**: Manipulação de datas
- **Tailwind CSS**: Estilização

## 🔧 Configuração da API

Configure a URL da API em `.env.local`:

```bash
# Admin
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-here

# Web
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🎨 Design System

Os frontends usam um design system baseado em:

- **Cores**: Definidas em `globals.css` com CSS variables
- **Componentes**: Padrão shadcn/ui (criar conforme necessário)
- **Tipografia**: Inter font
- **Espaçamento**: Tailwind spacing scale
- **Breakpoints**: Tailwind responsive

## 📖 Guia de Implementação

### 1. Implementar Autenticação

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch('http://localhost:4000/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json()
        if (res.ok && user) {
          return user
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.user = user.user
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user = token.user
      return session
    }
  },
  pages: {
    signIn: '/login',
  }
}
```

### 2. Criar Cliente API

```typescript
// src/lib/api.ts
import axios from 'axios'
import { getSession } from 'next-auth/react'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})

export default api
```

### 3. Implementar Páginas

Cada página deve:
- Usar React Query para fetch de dados
- Implementar loading states
- Tratar erros adequadamente
- Implementar otimistic updates
- Validar forms com Zod

## 🧪 Testes

Para testes futuros:

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e
```

## 📝 TODO

### Admin
- [ ] Implementar todas as páginas de CRUD
- [ ] Criar componentes UI reutilizáveis
- [ ] Implementar editor TipTap completo
- [ ] Criar home page builder com drag-and-drop
- [ ] Implementar upload de mídia com preview
- [ ] Adicionar dashboards e analytics
- [ ] Implementar sistema de notificações
- [ ] Criar página de configurações

### Web
- [ ] Implementar todas as páginas públicas
- [ ] Configurar ISR/SSR corretamente
- [ ] Otimizar imagens e performance
- [ ] Implementar busca
- [ ] Adicionar RSS feed
- [ ] Implementar comentários
- [ ] Criar sistema de newsletter
- [ ] Adicionar analytics (Google/Matomo)

## 🤝 Contribuindo

Para contribuir com os frontends:

1. Escolha uma página/feature da lista TODO
2. Crie uma branch
3. Implemente seguindo os padrões
4. Adicione testes
5. Faça PR

## 📞 Suporte

Para dúvidas sobre implementação dos frontends:

1. Consulte a documentação do Next.js 14
2. Veja exemplos em `ARCHITECTURE.md`
3. Consulte a API em `http://localhost:4000/api/docs`

---

**Status**: Estrutura base criada, pronta para implementação completa
**Próximo**: Implementar autenticação e dashboard
