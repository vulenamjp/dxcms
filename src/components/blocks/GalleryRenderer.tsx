import type { GalleryBlock } from '@/lib/blocks'
import Image from 'next/image'
import { useState } from 'react'

interface GalleryRendererProps {
  block: GalleryBlock
}

export function GalleryRenderer({ block }: GalleryRendererProps) {
  const { data } = block
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const columnClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6',
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {data.title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            {data.title}
          </h2>
        )}

        {data.displayStyle === 'grid' && (
          <div className={`grid ${columnClasses[data.columns]} gap-4`}>
            {data.images.map((image, index) => (
              <div
                key={image.id}
                className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => data.lightbox && setSelectedImage(index)}
              >
                <Image
                  src={image.url}
                  alt={image.alt || ''}
                  fill
                  className="object-cover"
                />
                {data.showCaptions && image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-sm">
                    {image.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {data.displayStyle === 'masonry' && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {data.images.map((image, index) => (
              <div
                key={image.id}
                className="relative mb-4 break-inside-avoid bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => data.lightbox && setSelectedImage(index)}
              >
                <img
                  src={image.url}
                  alt={image.alt || ''}
                  className="w-full h-auto"
                />
                {data.showCaptions && image.caption && (
                  <div className="bg-black/60 text-white p-3 text-sm">
                    {image.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {data.lightbox && selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <div className="relative max-w-7xl max-h-full">
              <Image
                src={data.images[selectedImage].url}
                alt={data.images[selectedImage].alt || ''}
                width={1200}
                height={800}
                className="max-h-[90vh] w-auto object-contain"
              />
              {data.showCaptions && data.images[selectedImage].caption && (
                <p className="text-white text-center mt-4">
                  {data.images[selectedImage].caption}
                </p>
              )}
            </div>
          </div>
        )}

        {data.images.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No images in gallery.
          </p>
        )}
      </div>
    </section>
  )
}
