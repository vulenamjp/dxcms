'use client'

import { useState } from 'react'
import { nanoid } from 'nanoid'

interface GalleryImage {
  id: string
  url: string
  alt?: string
  caption?: string
  thumbnail?: string
}

interface GalleryImageManagerProps {
  images: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
}

export function GalleryImageManager({
  images,
  onChange,
}: GalleryImageManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (!url) return

    const newImage: GalleryImage = {
      id: nanoid(),
      url,
      alt: '',
      caption: '',
    }

    onChange([...images, newImage])
    setEditingId(newImage.id)
  }

  const updateImage = (id: string, updates: Partial<GalleryImage>) => {
    onChange(
      images.map((img) => (img.id === id ? { ...img, ...updates } : img))
    )
  }

  const removeImage = (id: string) => {
    if (confirm('Remove this image?')) {
      onChange(images.filter((img) => img.id !== id))
    }
  }

  const moveImage = (id: string, direction: 'up' | 'down') => {
    const index = images.findIndex((img) => img.id === id)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return

    const newImages = [...images]
    const [removed] = newImages.splice(index, 1)
    newImages.splice(newIndex, 0, removed)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Gallery Images ({images.length})
        </label>
        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          + Add Image
        </button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded">
          No images added yet. Click "Add Image" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="border border-gray-200 rounded-lg p-3 bg-white"
            >
              <div className="relative group">
                <img
                  src={image.url}
                  alt={image.alt || 'Gallery image'}
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EError%3C/text%3E%3C/svg%3E'
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => moveImage(image.id, 'up')}
                    disabled={index === 0}
                    className="p-1 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-30"
                    title="Move up"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(image.id, 'down')}
                    disabled={index === images.length - 1}
                    className="p-1 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-30"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="p-1 bg-red-500 text-white rounded shadow hover:bg-red-600"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-2 space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditingId(editingId === image.id ? null : image.id)
                  }
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {editingId === image.id ? 'Done' : 'Edit Details'}
                </button>

                {editingId === image.id && (
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <input
                      type="text"
                      value={image.url}
                      onChange={(e) =>
                        updateImage(image.id, { url: e.target.value })
                      }
                      placeholder="Image URL"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900 bg-white"
                    />
                    <input
                      type="text"
                      value={image.alt || ''}
                      onChange={(e) =>
                        updateImage(image.id, { alt: e.target.value })
                      }
                      placeholder="Alt text"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900 bg-white"
                    />
                    <input
                      type="text"
                      value={image.caption || ''}
                      onChange={(e) =>
                        updateImage(image.id, { caption: e.target.value })
                      }
                      placeholder="Caption"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900 bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
