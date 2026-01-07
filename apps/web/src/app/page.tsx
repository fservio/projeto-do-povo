import { api } from '@/lib/api'
import { ArticleCard } from '@/components/articles/article-card'
import { FeaturedArticle } from '@/components/articles/featured-article'

async function getHomeData() {
  try {
    const [articlesRes, homeRes] = await Promise.all([
      api.get('/articles?status=PUBLISHED&limit=12'),
      api.get('/home/active'),
    ])
    return {
      articles: articlesRes.data || [],
      homePage: homeRes.data || null,
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
    return { articles: [], homePage: null }
  }
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const { articles, homePage } = await getHomeData()

  // Get featured article (first one)
  const featuredArticle = articles[0]
  const otherArticles = articles.slice(1)

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <FeaturedArticle article={featuredArticle} />
          </div>
        )}

        {/* Latest Articles Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Últimas Notícias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article: any) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* More sections can be added here based on home page builder */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              Política
            </h2>
            <div className="space-y-4">
              {/* Placeholder for category articles */}
              <p className="text-gray-600">
                Artigos de política serão exibidos aqui...
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              Mais Lidas
            </h2>
            <div className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-3">
                <li className="text-sm text-gray-600">
                  Carregando artigos mais lidos...
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
