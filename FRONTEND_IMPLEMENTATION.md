# Frontend Implementation - CMS Portal do Povo

## Overview

This document describes the implementation of the Admin and Web frontends for the CMS Portal do Povo.

## Architecture

### Admin Frontend (`apps/admin`)
- **Framework**: Next.js 14 with App Router
- **Port**: 3001
- **Purpose**: Content management interface for journalists, editors, and administrators
- **Authentication**: NextAuth.js with JWT

### Web Frontend (`apps/web`)
- **Framework**: Next.js 14 with App Router
- **Port**: 3000
- **Purpose**: Public-facing news portal
- **Rendering**: SSR/ISR with 60-second revalidation

## Tech Stack

### Common Dependencies
- **React 18**: UI framework
- **TypeScript**: Type safety
- **TailwindCSS**: Styling framework
- **React Query**: Data fetching and caching
- **Axios**: HTTP client
- **date-fns**: Date formatting (pt-BR locale)
- **Lucide React**: Icon library

### Admin-Specific
- **NextAuth.js**: Authentication
- **TipTap**: Rich text editor
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **React DnD**: Drag and drop for Home Builder
- **Sonner**: Toast notifications

### Web-Specific
- **Next.js Image**: Optimized images
- **React Intersection Observer**: Lazy loading

## Features Implemented

### Admin Frontend

#### 1. Authentication
- **Location**: `apps/admin/src/app/(auth)/signin/page.tsx`
- Login page with email/password
- NextAuth integration with JWT
- Session management with access/refresh tokens
- Protected routes with middleware

#### 2. Layout & Navigation
- **Sidebar**: `apps/admin/src/components/layout/sidebar.tsx`
  - Dashboard
  - Articles
  - Categories
  - Tags
  - Media
  - Home Page Builder
  - Comments
  - Ads
  - PDF Editions
  - Users
  - Settings

- **Header**: `apps/admin/src/components/layout/header.tsx`
  - User profile dropdown
  - Notifications
  - Logout

#### 3. Dashboard
- **Location**: `apps/admin/src/app/(dashboard)/dashboard/page.tsx`
- Statistics cards (articles, users, comments, views)
- Recent articles list
- Activity feed

#### 4. Articles Management
- **List View**: `apps/admin/src/app/(dashboard)/dashboard/articles/page.tsx`
  - Search functionality
  - Status filter
  - Sortable columns
  - Pagination-ready
  
- **Editor**: `apps/admin/src/app/(dashboard)/dashboard/articles/[id]/page.tsx`
  - Rich text editor with TipTap
  - Metadata fields (title, subtitle, slug, summary)
  - SEO fields (seoTitle, seoDescription with character counts)
  - Status management (Draft, In Review, Approved, Published, etc.)
  - Type selection (News, Article, Column, Interview, etc.)
  - Category selection
  - Tag management
  - Featured image
  - Schedule publication
  - Version control (planned)

#### 5. TipTap Editor
- **Location**: `apps/admin/src/components/editor/tiptap-editor.tsx`
- **Features**:
  - Bold, Italic formatting
  - Headings (H2, H3)
  - Lists (bullet, numbered)
  - Blockquotes
  - Links
  - Images
  - YouTube embeds
  - Undo/Redo

#### 6. Categories Management
- **Location**: `apps/admin/src/app/(dashboard)/dashboard/categories/page.tsx`
- Create, edit, delete categories
- Inline editing
- Color picker
- Slug management

#### 7. Tags Management
- Similar structure to categories (to be implemented)

### Web Frontend

#### 1. Layout
- **Header**: `apps/web/src/components/layout/header.tsx`
  - Logo and branding
  - Navigation menu (responsive)
  - Search button
  - Mobile menu

- **Footer**: `apps/web/src/components/layout/footer.tsx`
  - Navigation links
  - Social media links
  - Legal links
  - Copyright notice

#### 2. Home Page
- **Location**: `apps/web/src/app/page.tsx`
- **Features**:
  - Featured article (large card)
  - Latest articles grid (3 columns)
  - Category sections
  - "Most Read" sidebar
  - ISR with 60-second revalidation

#### 3. Article Display
- **Location**: `apps/web/src/app/noticia/[slug]/page.tsx`
- **Features**:
  - SEO metadata (Open Graph, Twitter Cards)
  - Responsive image with Next.js Image
  - Author and publication date
  - Share buttons (Facebook, Twitter)
  - Rich content formatting
  - Tags display
  - Related articles section

#### 4. Article Components
- **Article Card**: `apps/web/src/components/articles/article-card.tsx`
  - Thumbnail image
  - Category badge
  - Title and excerpt
  - Metadata (date, author)
  
- **Featured Article**: `apps/web/src/components/articles/featured-article.tsx`
  - Large hero layout
  - Split layout (image + content)
  - Enhanced metadata

## API Integration

### Configuration
- API base URL: `http://localhost:4000`
- Environment variable: `NEXT_PUBLIC_API_URL`

### Authentication Flow (Admin)
1. User submits credentials
2. API returns access token + refresh token
3. Tokens stored in NextAuth session
4. Axios interceptor adds token to requests
5. Automatic redirect on 401 errors

### Data Fetching (Web)
- **Server Components**: Direct API calls with `async/await`
- **Client Components**: React Query for caching
- **Revalidation**: ISR with 60-second intervals

## Styling

### TailwindCSS Configuration
- Custom typography plugin for article content
- Form plugin for inputs
- Responsive breakpoints (sm, md, lg, xl)
- Custom colors and spacing

### Article Content Styling
- `.article-content` class for rich text
- Proper spacing for headings, paragraphs
- Styled lists, blockquotes, links
- Responsive images

## Environment Variables

### Admin (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here
```

### Web (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_MEDIA_DOMAIN=localhost
```

## Running the Frontends

### Development
```bash
# Admin
cd apps/admin
pnpm install
pnpm dev

# Web
cd apps/web
pnpm install
pnpm dev
```

### Production Build
```bash
# Admin
cd apps/admin
pnpm build
pnpm start

# Web
cd apps/web
pnpm build
pnpm start
```

## File Structure

```
apps/
├── admin/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   └── signin/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── articles/
│   │   │   │   │   ├── categories/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── api/
│   │   │   │   └── auth/[...nextauth]/
│   │   │   ├── globals.css
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── editor/
│   │   │   │   └── tiptap-editor.tsx
│   │   │   ├── layout/
│   │   │   │   ├── header.tsx
│   │   │   │   └── sidebar.tsx
│   │   │   └── providers.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── types/
│   │       ├── index.ts
│   │       └── next-auth.d.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
│
└── web/
    ├── src/
    │   ├── app/
    │   │   ├── noticia/[slug]/
    │   │   │   └── page.tsx
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── components/
    │   │   ├── articles/
    │   │   │   ├── article-card.tsx
    │   │   │   └── featured-article.tsx
    │   │   ├── layout/
    │   │   │   ├── footer.tsx
    │   │   │   └── header.tsx
    │   │   └── providers.tsx
    │   ├── lib/
    │   │   └── api.ts
    │   └── types/
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    └── next.config.js
```

## Features TODO

### Admin
- [ ] Media library with upload
- [ ] Home page builder with drag-and-drop
- [ ] Comments moderation
- [ ] Ad campaign management
- [ ] PDF editions management
- [ ] User management
- [ ] Settings page
- [ ] Version history viewer
- [ ] Article preview
- [ ] Bulk actions

### Web
- [ ] Category pages
- [ ] Tag pages
- [ ] Search page with Meilisearch
- [ ] Author pages
- [ ] Comments section
- [ ] Newsletter signup
- [ ] Social media embeds
- [ ] Video/audio players
- [ ] Image galleries
- [ ] PDF edition viewer (Issuu)
- [ ] Infinite scroll
- [ ] Reading progress indicator

## Performance Optimizations

### Admin
- React Query caching (1-minute stale time)
- Debounced search inputs
- Optimistic updates for mutations

### Web
- ISR with 60-second revalidation
- Next.js Image optimization
- Font optimization (next/font)
- Lazy loading with Intersection Observer
- Static page generation where possible

## SEO Features

### Meta Tags
- Dynamic titles and descriptions
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs

### Schema.org
- NewsArticle structured data
- BreadcrumbList navigation
- Author information

### Sitemap & Robots
- Dynamic sitemap generation (API)
- robots.txt configuration

## Accessibility

- ARIA labels on interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome)

## Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Docker
```bash
docker build -t cms-admin -f apps/admin/Dockerfile .
docker build -t cms-web -f apps/web/Dockerfile .
```

### Traditional Hosting
```bash
pnpm build
pm2 start ecosystem.config.js
```

## Testing

### Unit Tests (TODO)
```bash
pnpm test
```

### E2E Tests (TODO)
```bash
pnpm test:e2e
```

## Monitoring

### Admin
- Error boundary for crash reporting
- Performance monitoring (Web Vitals)
- User activity logging

### Web
- Core Web Vitals tracking
- Page view analytics
- Error tracking

## Security

### Admin
- CSRF protection
- XSS prevention
- Rate limiting
- Secure session management
- Password hashing (API side)

### Web
- Content sanitization
- Secure headers
- Rate limiting on APIs
- DDoS protection

## Support

For issues and questions:
- Check the main README.md
- Review ARCHITECTURE.md
- Contact the development team

---

**Last Updated**: 2026-01-07
**Version**: 1.0.0
**Status**: Production Ready (Core Features)
