export interface User {
  id: string
  email: string
  name: string | null
  roles: Role[]
}

export interface Role {
  id: string
  name: string
  permissions: Permission[]
}

export interface Permission {
  id: string
  resource: string
  action: string
}

export interface Site {
  id: string
  name: string
  domain: string
  slug: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  siteId: string
  color?: string
  icon?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  siteId: string
  articlesCount: number
  createdAt: string
  updatedAt: string
}

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  CORRECTION = 'CORRECTION',
}

export enum ArticleType {
  NEWS = 'NEWS',
  ARTICLE = 'ARTICLE',
  COLUMN = 'COLUMN',
  INTERVIEW = 'INTERVIEW',
  SPECIAL = 'SPECIAL',
  LIVEBLOG = 'LIVEBLOG',
  INSTITUTIONAL = 'INSTITUTIONAL',
  SERVICE = 'SERVICE',
}

export interface Article {
  id: string
  title: string
  slug: string
  subtitle?: string
  summary?: string
  content: string
  excerpt?: string
  featuredImageUrl?: string
  status: ArticleStatus
  type: ArticleType
  siteId: string
  categoryId?: string
  authorId: string
  publishedAt?: string
  scheduledAt?: string
  lockedUntil?: string
  lockedById?: string
  version: number
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
  author: User
  category?: Category
  tags: Tag[]
  site: Site
}

export interface ArticleVersion {
  id: string
  articleId: string
  version: number
  title: string
  content: string
  changedBy: User
  createdAt: string
}

export interface MediaAsset {
  id: string
  filename: string
  originalName: string
  mimeType: string
  fileSize: number
  url: string
  thumbnailUrl?: string
  width?: number
  height?: number
  alt?: string
  caption?: string
  credit?: string
  folder?: string
  tags: string[]
  siteId: string
  uploadedById: string
  createdAt: string
  updatedAt: string
}

export interface HomeLayout {
  id: string
  siteId: string
  layoutType: 'A' | 'B' | 'C' | 'D'
  isActive: boolean
  scheduledAt?: string
  createdAt: string
  updatedAt: string
}

export interface HomeSection {
  id: string
  homePageId: string
  title?: string
  displayOrder: number
  blocks: HomeBlock[]
}

export enum BlockType {
  MAIN_HIGHLIGHT = 'MAIN_HIGHLIGHT',
  EDITORIAL_LIST = 'EDITORIAL_LIST',
  CAROUSEL = 'CAROUSEL',
  VIDEO_EMBED = 'VIDEO_EMBED',
  PODCAST = 'PODCAST',
  GALLERY = 'GALLERY',
  MOST_READ = 'MOST_READ',
  NEWSLETTER_CTA = 'NEWSLETTER_CTA',
  AGENDA = 'AGENDA',
  POLL = 'POLL',
  AD_SLOT = 'AD_SLOT',
  PDF_EDITION = 'PDF_EDITION',
}

export interface HomeBlock {
  id: string
  sectionId: string
  blockType: BlockType
  title?: string
  displayOrder: number
  config: Record<string, any>
}

export interface PdfEdition {
  id: string
  siteId: string
  publicationDate: string
  title: string
  description?: string
  issuuEmbedUrl?: string
  issuuPublicationId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  articleId: string
  content: string
  authorName: string
  authorEmail: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM'
  createdAt: string
  updatedAt: string
}

export interface AdSlot {
  id: string
  name: string
  slotId: string
  position: string
  dimensions: string
  siteId: string
  isActive: boolean
}

export interface AdCampaign {
  id: string
  name: string
  adSlotId: string
  imageUrl?: string
  linkUrl?: string
  startDate: string
  endDate: string
  impressions: number
  clicks: number
  isActive: boolean
}
