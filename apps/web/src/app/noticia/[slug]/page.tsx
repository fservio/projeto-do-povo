import { api } from '@/lib/api'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Clock, Share2, Facebook, Twitter } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArticleCard } from '@/components/articles/article-card'

async function getArticle(slug: string) {
  try {
    const response = await api.get(`/articles/slug/${slug}`)
    return response.data
  } catch (error) {
    return null
  }
}

async function getRelatedArticles(categoryId: string, currentId: string) {
  try {
    const response = await api.get(
      `/articles?categoryId=${categoryId}&status=PUBLISHED&limit=3`
    )
    return response.data.filter((a: any) => a.id !== currentId)
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) {
    return {
      title: 'Artigo não encontrado',
    }
  }

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || article.summary,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || article.summary,
      images: article.featuredImageUrl ? [article.featuredImageUrl] : [],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name || article.author.email],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || article.summary,
      images: article.featuredImageUrl ? [article.featuredImageUrl] : [],
    },
  }
}

export const revalidate = 60

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = article.categoryId
    ? await getRelatedArticles(article.categoryId, article.id)
    : []

  return (
    <div className="bg-white">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Category */}
        {article.category && (
          <Link
            href={`/categoria/${article.category.slug}`}
            className="text-sm font-semibold text-blue-600 uppercase tracking-wide hover:underline"
          >
            {article.category.name}
          </Link>
        )}

        {/* Title */}
        <h1 className="mt-4 text-4xl font-bold text-gray-900 leading-tight">
          {article.title}
        </h1>

        {/* Subtitle */}
        {article.subtitle && (
          <h2 className="mt-4 text-xl text-gray-700">{article.subtitle}</h2>
        )}

        {/* Meta information */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-600 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Por {article.author.name || article.author.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.publishedAt}>
              {format(
                new Date(article.publishedAt),
                "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                { locale: ptBR }
              )}
            </time>
          </div>
          {article.updatedAt && article.updatedAt !== article.publishedAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                Atualizado em{' '}
                {format(new Date(article.updatedAt), 'dd/MM/yyyy HH:mm', {
                  locale: ptBR,
                })}
              </span>
            </div>
          )}
        </div>

        {/* Share buttons */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Compartilhar:</span>
          <button className="p-2 rounded-full hover:bg-gray-100 text-blue-600">
            <Facebook className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-blue-400">
            <Twitter className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Featured Image */}
        {article.featuredImageUrl && (
          <div className="mt-8">
            <div className="relative h-96 w-full">
              <Image
                src={article.featuredImageUrl}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        )}

        {/* Summary */}
        {article.summary && (
          <div className="mt-8 p-4 bg-gray-50 border-l-4 border-blue-600 rounded">
            <p className="text-lg text-gray-700 font-medium">{article.summary}</p>
          </div>
        )}

        {/* Content */}
        <div
          className="mt-8 article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Tags:</span>
              {article.tags.map((tag: any) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Leia Também
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
