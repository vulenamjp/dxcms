'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageStatus } from '@prisma/client'
import type { Block, PageBody } from '@/lib/blocks'
import { BlockListDnD } from './BlockListDnD'

export interface PageFormData {
  slug: string
  title: string
  status: PageStatus
  body: PageBody
}

interface PageFormProps {
  initialData?: PageFormData
  mode: 'create' | 'edit'
  pageId?: string
}

export function PageForm({ initialData, mode, pageId }: PageFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<PageFormData>(
    initialData || {
      slug: '',
      title: '',
      status: 'DRAFT' as PageStatus,
      body: {
        version: 1,
        seo: {
          title: '',
          description: '',
          ogType: 'website' as const,
        },
        blocks: [],
      },
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url =
        mode === 'create'
          ? '/api/admin/pages'
          : `/api/admin/pages/${pageId}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to save page')
      }

      const data = await response.json()
      router.push('/admin/pages')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateBlocks = (blocks: Block[]) => {
    setFormData({
      ...formData,
      body: {
        ...formData.body,
        blocks,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData({ ...formData, slug: e.target.value.toLowerCase() })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Lowercase letters, numbers, and hyphens only
          </p>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as PageStatus })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">SEO</h2>

        <div>
          <label
            htmlFor="seo-title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            SEO Title
          </label>
          <input
            type="text"
            id="seo-title"
            value={formData.body.seo.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                body: {
                  ...formData.body,
                  seo: { ...formData.body.seo, title: e.target.value },
                },
              })
            }
            maxLength={60}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.body.seo.title.length}/60 characters
          </p>
        </div>

        <div>
          <label
            htmlFor="seo-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            SEO Description
          </label>
          <textarea
            id="seo-description"
            value={formData.body.seo.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                body: {
                  ...formData.body,
                  seo: { ...formData.body.seo, description: e.target.value },
                },
              })
            }
            maxLength={160}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.body.seo.description.length}/160 characters
          </p>
        </div>
      </div>

      {/* Blocks */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Page Blocks
        </h2>
        <BlockListDnD blocks={formData.body.blocks} onChange={updateBlocks} />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Create Page'
              : 'Update Page'}
        </button>
      </div>
    </form>
  )
}
