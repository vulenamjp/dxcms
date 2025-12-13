'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MediaPicker } from './MediaPicker'

interface ProjectFormProps {
  projectId?: string
  isEdit?: boolean
}

export default function ProjectForm({ projectId, isEdit = false }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    url: '',
    category: '',
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    if (isEdit && projectId) {
      fetchProject()
    }
  }, [isEdit, projectId])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/projects/${projectId}`)
      if (!response.ok) throw new Error('Failed to fetch project')

      const data = await response.json()
      setFormData({
        title: data.title,
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        url: data.url || '',
        category: data.category || '',
        order: data.order,
        isActive: data.isActive,
      })
    } catch (err) {
      setError('Failed to load project')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEdit
        ? `/api/admin/projects/${projectId}`
        : '/api/admin/projects'
      
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
        
        throw new Error(data.error || 'Failed to save project')
      }

      router.push('/admin/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project')
      console.error('Full error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading project...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Project' : 'Create Project'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEdit ? 'Update project details' : 'Add a new project to your portfolio'}
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

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Image
          </label>
          <MediaPicker
            value={formData.imageUrl}
            onChange={(url: string) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
          />
        </div>

        {/* Project URL */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Project URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
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
            placeholder="e.g., Web Development, Mobile App, Design"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>

        {/* Order */}
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
            Display Order
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
          <p className="mt-1 text-sm text-gray-500">
            Lower numbers appear first
          </p>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Active (visible to public)
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
