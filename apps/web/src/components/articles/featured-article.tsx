import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface FeaturedArticleProps {
  article: {
    id: string
    title: string
    subtitle?: string
    excerpt?: string
    summary?: string
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

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {article.featuredImageUrl && (
          <Link href={`/noticia/${article.slug}`}>
            <div className="relative h-64 lg:h-full w-full">
              <Image
                src={article.featuredImageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>
        )}
        <div className="p-8 flex flex-col justify-center">
          {article.category && (
            <Link
              href={`/categoria/${article.category.slug}`}
              className="text-sm font-semibold text-blue-600 uppercase tracking-wide hover:underline"
            >
              {article.category.name}
            </Link>
          )}
          <Link href={`/noticia/${article.slug}`}>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 hover:text-blue-600">
              {article.title}
            </h2>
          </Link>
          {article.subtitle && (
            <p className="mt-2 text-xl text-gray-700">{article.subtitle}</p>
          )}
          {(article.summary || article.excerpt) && (
            <p className="mt-4 text-gray-600 line-clamp-3">
              {article.summary || article.excerpt}
            </p>
          )}
          <div className="mt-6 flex items-center text-sm text-gray-500 gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.publishedAt}>
                {format(new Date(article.publishedAt), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </time>
            </div>
            {article.author.name && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Por {article.author.name}</span>
              </div>
            )}
          </div>
          <Link
            href={`/noticia/${article.slug}`}
            className="mt-6 inline-flex items-center text-blue-600 font-semibold hover:text-blue-800"
          >
            Ler mais →
          </Link>
        </div>
      </div>
    </article>
  )
}
