'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ServiceFormProps {
  serviceId?: string
  isEdit?: boolean
}

interface ServiceFormData {
  title: string
  description: string
  icon: string
  order: number
  isActive: boolean
}

export function ServiceForm({ serviceId, isEdit = false }: ServiceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    icon: '',
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    if (isEdit && serviceId) {
      fetchService()
    }
  }, [serviceId, isEdit])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`)
      if (!response.ok) throw new Error('Failed to fetch service')
      
      const service = await response.json()
      setFormData({
        title: service.title,
        description: service.description || '',
        icon: service.icon || '',
        order: service.order,
        isActive: service.isActive,
      })
    } catch (err) {
      setError('Failed to load service')
      console.error(err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEdit
        ? `/api/admin/services/${serviceId}`
        : '/api/admin/services'
      
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save service')
      }

      router.push('/admin/services')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save service')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }))
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Web Development"
          />
        </div>

        {/* Icon */}
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
            Icon (Emoji)
          </label>
          <input
            type="text"
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 🚀 or 💻"
            maxLength={10}
          />
          <p className="text-sm text-gray-500 mt-1">
            Use an emoji or short text. Will display in service blocks.
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your service..."
          />
        </div>

        {/* Order */}
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
            Display Order
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min={0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Lower numbers appear first. Default is 0.
          </p>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleCheckbox}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Active (visible to public)
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}
        </button>
      </div>
    </form>
  )
}
