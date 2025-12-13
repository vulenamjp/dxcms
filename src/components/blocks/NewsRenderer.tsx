import type { NewsBlock } from '@/lib/blocks'
import Image from 'next/image'
import Link from 'next/link'

interface NewsRendererProps {
  block: NewsBlock
  articles: any[]
}

export function NewsRenderer({ block, articles }: NewsRendererProps) {
  const { data } = block

  const columnClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6',
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {data.title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {data.title}
          </h2>
        )}

        {data.description && (
          <p className="text-lg text-gray-600 mb-12">
            {data.description}
          </p>
        )}

        {data.displayStyle === 'grid' && (
          <div className={`grid ${columnClasses[data.columns]} gap-8`}>
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {data.showImage && article.image && (
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  {data.showDate && article.publishedAt && (
                    <time className="text-sm text-gray-500 mb-2 block">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </time>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link href={`/news/${article.slug}`} className="hover:text-blue-600">
                      {article.title}
                    </Link>
                  </h3>
                  {data.showExcerpt && article.excerpt && (
                    <p className="text-gray-600">{article.excerpt}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {data.displayStyle === 'list' && (
          <div className="space-y-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden flex gap-6"
              >
                {data.showImage && article.image && (
                  <div className="relative w-48 flex-shrink-0 bg-gray-200">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex-1">
                  {data.showDate && article.publishedAt && (
                    <time className="text-sm text-gray-500 mb-2 block">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </time>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link href={`/news/${article.slug}`} className="hover:text-blue-600">
                      {article.title}
                    </Link>
                  </h3>
                  {data.showExcerpt && article.excerpt && (
                    <p className="text-gray-600">{article.excerpt}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {articles.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No news articles available.
          </p>
        )}
      </div>
    </section>
  )
}
