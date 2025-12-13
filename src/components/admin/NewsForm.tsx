'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MediaPicker } from './MediaPicker'
import { RichTextEditor } from './RichTextEditor'

interface NewsFormProps {
  newsId?: string
  isEdit?: boolean
}

export default function NewsForm({ newsId, isEdit = false }: NewsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    category: '',
    publishedAt: new Date().toISOString().slice(0, 16),
  })

  useEffect(() => {
    if (isEdit && newsId) {
      fetchNews()
    }
  }, [isEdit, newsId])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/news/${newsId}`)
      if (!response.ok) throw new Error('Failed to fetch news')

      const data = await response.json()
      setFormData({
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt || '',
        content: data.content,
        imageUrl: data.imageUrl || '',
        category: data.category || '',
        publishedAt: new Date(data.publishedAt).toISOString().slice(0, 16),
      })
    } catch (err) {
      setError('Failed to load news')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEdit
        ? `/api/admin/news/${newsId}`
        : '/api/admin/news'
      
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        console.error('Validation error details:', data)
        
        // Format validation errors
        if (data.details && Array.isArray(data.details)) {
          const errorMessages = data.details.map((d: any) => `${d.path.join('.')}: ${d.message}`).join(', ')
          throw new Error(errorMessages)
        }
        
        throw new Error(data.error || 'Failed to save news')
      }

      router.push('/admin/news')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save news')
      console.error('Full error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from title when creating new article
    if (name === 'title' && !isEdit) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }))
    }
  }

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading news...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit News Article' : 'Create News Article'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEdit ? 'Update article details' : 'Add a new news article'}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white font-mono"
          />
          <p className="mt-1 text-sm text-gray-500">
            Lowercase letters, numbers, and hyphens only (e.g., my-news-article)
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            placeholder="A short summary of the article..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(content: string) => setFormData((prev) => ({ ...prev, content }))}
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          <MediaPicker
            value={formData.imageUrl}
            onChange={(url: string) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Technology, Business, Sports"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>

        {/* Published Date */}
        <div>
          <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-1">
            Publish Date & Time
          </label>
          <input
            type="datetime-local"
            id="publishedAt"
            name="publishedAt"
            value={formData.publishedAt}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Article' : 'Publish Article'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/news')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
