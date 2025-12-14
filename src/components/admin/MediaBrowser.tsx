'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Media } from '@/lib/types'

interface MediaBrowserProps {
  onSelect: (url: string) => void
  onClose: () => void
}

export function MediaBrowser({ onSelect, onClose }: MediaBrowserProps) {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  // Fetch media list
  const fetchMedia = async (pageNum: number = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/media?page=${pageNum}&limit=20`)
      if (!response.ok) throw new Error('Failed to fetch media')
      
      const data = await response.json()
      setMedia(data.media)
      setTotalPages(data.pagination.totalPages)
      setPage(pageNum)
    } catch (err) {
      setError('Failed to load media')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)
      setError('')

      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const newMedia = await response.json()
      
      // Refresh media list
      await fetchMedia(1)
      
      // Clear selection
      setSelectedFile(null)
      
      // Auto-select the newly uploaded file
      onSelect(newMedia.url)
    } catch (err: any) {
      setError(err.message || 'Failed to upload file')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError('')
    }
  }

  // Handle media deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete media')

      // Refresh list
      await fetchMedia(page)
    } catch (err) {
      setError('Failed to delete media')
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Upload Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload New Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-2"
              />
              {selectedFile && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading media...</div>
            </div>
          ) : media.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-2">No media files yet</p>
                <p className="text-sm text-gray-400">Upload your first image above</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer hover:ring-2 hover:ring-blue-500"
                  onClick={() => onSelect(item.url)}
                >
                  <Image
                    src={item.url}
                    alt={item.alt ?? item.originalName}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(item.id)
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="text-white text-xs">
                      <p className="font-semibold truncate">{item.originalName}</p>
                      <p className="text-white/80">
                        {(item.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex justify-center gap-2">
            <button
              onClick={() => fetchMedia(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => fetchMedia(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
