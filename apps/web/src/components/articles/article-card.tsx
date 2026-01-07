import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ArticleCardProps {
  article: {
    id: string
    title: string
    subtitle?: string
    excerpt?: string
    featuredImageUrl?: string
    slug: string
    publishedAt: string
    author: {
      name?: string
      email: string
    }
    category?: {
      name: string
      slug: string
    }
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {article.featuredImageUrl && (
        <Link href={`/noticia/${article.slug}`}>
          <div className="relative h-48 w-full">
            <Image
              src={article.featuredImageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      )}
      <div className="p-4">
        {article.category && (
          <Link
            href={`/categoria/${article.category.slug}`}
            className="text-xs font-semibold text-blue-600 uppercase tracking-wide hover:underline"
          >
            {article.category.name}
          </Link>
        )}
        <Link href={`/noticia/${article.slug}`}>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center text-xs text-gray-500 gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={article.publishedAt}>
              {format(new Date(article.publishedAt), 'dd/MM/yyyy', {
                locale: ptBR,
              })}
            </time>
          </div>
          {article.author.name && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{article.author.name}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
