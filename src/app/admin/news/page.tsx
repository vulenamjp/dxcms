'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface News {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  imageUrl: string | null
  category: string | null
  publishedAt: string
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/news')
      if (!response.ok) throw new Error('Failed to fetch news')
      
      const data = await response.json()
      setNews(data.news)
    } catch (err) {
      setError('Failed to load news')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete news')

      await fetchNews()
    } catch (err) {
      alert('Failed to delete news')
      console.error(err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading news...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News</h1>
          <p className="text-gray-600 mt-1">Manage your news articles</p>
        </div>
        <Link
          href="/admin/news/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add News Article
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* News Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {news.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No news articles found. Create your first article to get started.
                </td>
              </tr>
            ) : (
              news.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {article.imageUrl ? (
                      <div className="relative w-20 h-16 rounded overflow-hidden">
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {article.title}
                    </div>
                    {article.excerpt && (
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {article.excerpt}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {article.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {article.category ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {article.category}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(article.publishedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.createdBy.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/news/${article.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
