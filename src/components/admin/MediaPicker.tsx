'use client'

import { useState } from 'react'
import { MediaBrowser } from './MediaBrowser'

interface MediaPickerProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  showPreview?: boolean
}

export function MediaPicker({
  value = '',
  onChange,
  label = 'Image',
  showPreview = true,
}: MediaPickerProps) {
  const [inputType, setInputType] = useState<'url' | 'upload' | 'browse'>('browse')
  const [previewUrl, setPreviewUrl] = useState(value)
  const [isUploading, setIsUploading] = useState(false)
  const [showBrowser, setShowBrowser] = useState(false)

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url)
    onChange(url)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const media = await response.json()
      handleUrlChange(media.url)
    } catch (error) {
      console.error('Upload failed:', error)
      alert(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleBrowseSelect = (url: string) => {
    handleUrlChange(url)
    setShowBrowser(false)
  }

  const clearImage = () => {
    setPreviewUrl('')
    onChange('')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowBrowser(true)}
            className={`px-3 py-1 text-xs rounded ${
              inputType === 'browse'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Browse Library
          </button>
          <button
            type="button"
            onClick={() => setInputType('url')}
            className={`px-3 py-1 text-xs rounded ${
              inputType === 'url'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setInputType('upload')}
            className={`px-3 py-1 text-xs rounded ${
              inputType === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Quick Upload
          </button>
        </div>
      </div>

      {inputType === 'url' ? (
        <input
          type="url"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : inputType === 'upload' ? (
        <div>
          <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors bg-white">
            <div className="text-center">
              {isUploading ? (
                <div className="text-sm text-gray-600">Uploading...</div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-8 w-8 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
          {value && inputType === 'upload' && (
            <p className="mt-2 text-xs text-gray-500 truncate">{value}</p>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md">
          <p className="text-sm text-gray-600 mb-3">
            Click "Browse Library" to select an image
          </p>
          <button
            type="button"
            onClick={() => setShowBrowser(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Open Media Library
          </button>
        </div>
      )}

      {showPreview && previewUrl && (
        <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EError%3C/text%3E%3C/svg%3E'
            }}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Media Browser Modal */}
      {showBrowser && (
        <MediaBrowser
          onSelect={handleBrowseSelect}
          onClose={() => setShowBrowser(false)}
        />
      )}
    </div>
  )
}
