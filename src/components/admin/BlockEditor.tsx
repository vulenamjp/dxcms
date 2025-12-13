'use client'

import type { Block } from '@/lib/blocks'

interface BlockEditorProps {
  block: Block
  onChange: (block: Block) => void
}

export function BlockEditor({ block, onChange }: BlockEditorProps) {
  const updateData = (key: string, value: any) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [key]: value,
      },
    } as Block)
  }

  switch (block.type) {
    case 'hero':
      return <HeroEditor block={block} updateData={updateData} />
    case 'services':
      return <ServicesEditor block={block} updateData={updateData} />
    case 'projects':
      return <ProjectsEditor block={block} updateData={updateData} />
    case 'news':
      return <NewsEditor block={block} updateData={updateData} />
    case 'richtext':
      return <RichTextEditor block={block} updateData={updateData} />
    case 'gallery':
      return <GalleryEditor block={block} updateData={updateData} />
    case 'contact':
      return <ContactEditor block={block} updateData={updateData} />
    default:
      return <div className="text-gray-500">Unknown block type</div>
  }
}

// Hero Editor
function HeroEditor({
  block,
  updateData,
}: {
  block: any
  updateData: (key: string, value: any) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={block.data.title || ''}
          onChange={(e) => updateData('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subtitle
        </label>
        <input
          type="text"
          value={block.data.subtitle || ''}
          onChange={(e) => updateData('subtitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          maxLength={200}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CTA Text
          </label>
          <input
            type="text"
            value={block.data.ctaText || ''}
            onChange={(e) => updateData('ctaText', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CTA Link
          </label>
          <input
            type="text"
            value={block.data.ctaLink || ''}
            onChange={(e) => updateData('ctaLink', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alignment
          </label>
          <select
            value={block.data.alignment || 'center'}
            onChange={(e) => updateData('alignment', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height
          </label>
          <select
            value={block.data.height || 'medium'}
            onChange={(e) => updateData('height', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="full">Full Screen</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Background Image URL
        </label>
        <input
          type="url"
          value={block.data.backgroundImage || ''}
          onChange={(e) => updateData('backgroundImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        />
      </div>
    </div>
  )
}

// Services Editor
function ServicesEditor({
  block,
  updateData,
}: {
  block: any
  updateData: (key: string, value: any) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title (optional)
        </label>
        <input
          type="text"
          value={block.data.title || ''}
          onChange={(e) => updateData('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Limit
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={block.data.limit || 6}
            onChange={(e) => updateData('limit', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Style
          </label>
          <select
            value={block.data.displayStyle || 'grid'}
            onChange={(e) => updateData('displayStyle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Columns
          </label>
          <input
            type="number"
            min={1}
            max={6}
            value={block.data.columns || 3}
            onChange={(e) => updateData('columns', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={block.data.showIcon !== false}
            onChange={(e) => updateData('showIcon', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Show Icons</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={block.data.showDescription !== false}
            onChange={(e) => updateData('showDescription', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Show Descriptions</span>
        </label>
      </div>
    </div>
  )
}

// Projects Editor
function ProjectsEditor({
  block,
  updateData,
}: {
  block: any
  updateData: (key: string, value: any) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title (optional)
        </label>
        <input
          type="text"
          value={block.data.title || ''}
          onChange={(e) => updateData('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Limit
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={block.data.limit || 6}
            onChange={(e) => updateData('limit', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Style
          </label>
          <select
            value={block.data.displayStyle || 'grid'}
            onChange={(e) => updateData('displayStyle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          >
            <option value="grid">Grid</option>
            <option value="masonry">Masonry</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Columns
          </label>
          <input
            type="number"
            min={1}
            max={6}
            value={block.data.columns || 3}
            onChange={(e) => updateData('columns', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
      </div>
    </div>
  )
}

// News Editor
function NewsEditor({
  block,
  updateData,
}: {
  block: any
  updateData: (key: string, value: any) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title (optional)
        </label>
        <input
          type="text"
          value={block.data.title || ''}
          onChange={(e) => updateData('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Limit
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={block.data.limit || 6}
            onChange={(e) => updateData('limit', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Style
          </label>
          <select
            value={block.data.displayStyle || 'grid'}
            onChange={(e) => updateData('displayStyle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
            <option value="featured">Featured</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Columns
          </label>
          <input
            type="number"
            min={1}
            max={6}
            value={block.data.columns || 3}
            onChange={(e) => updateData('columns', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={block.data.showExcerpt !== false}
            onChange={(e) => updateData('showExcerpt', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Show Excerpt</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={block.data.showImage !== false}
            onChange={(e) => updateData('showImage', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Show Image</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={block.data.showDate !== false}
            onChange={(e) => updateData('showDate', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Show Date</span>
        </label>
      </div>
    </div>
  )
}

// RichText Editor
function RichTextEditor({
  block,
  updateData,
}: {
  block: any
  updateData: (key: string, value: any) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Format
        </label>
        <select
          value={block.data.format || 'html'}
          onChange={(e) => updateData('format', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        >
          <option value="html">HTML</option>
          <option value="markdown">Markdown</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          value={block.data.content || ''}
          onChange={(e) => updateData('content', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm text-gray-900 bg-white"
          rows={10}
        />
      </div>
    </div>
  )
}

// Gallery Editor
function GalleryEditor({
  block,
  updateData,
}: {
  block: any
  updateData: (key: string, value: any) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title (optional)
        </label>
        <input
          type="text"
          value={block.data.title || ''}
          onChange={(e) => updateData('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Style
          </label>
          <select
            value={block.data.displayStyle || 'grid'}
            onChange={(e) => updateData('displayStyle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          >
            <option value="grid">Grid</option>
            <option value="masonry">Masonry</option>
            <option value="carousel">Carousel</option>
            <option value="slideshow">Slideshow</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Columns
          </label>
          <input
            type="number"
            min={1}
            max={6}
            value={block.data.columns || 3}
            onChange={(e) => updateData('columns', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={block.data.showCaptions !== false}
            onChange={(e) => updateData('showCaptions', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Show Captions</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={block.data.lightbox !== false}
            onChange={(e) => updateData('lightbox', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Enable Lightbox</span>
        </label>
      </div>

      <div className="p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-sm text-gray-600">
          Gallery image management will be implemented with Media Library in
          EPIC 7
        </p>
      </div>
    </div>
  )
}

// Contact Editor
function ContactEditor({
  block,
  updateData,
}: {
  block: any
  updateData: (key: string, value: any) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={block.data.title || ''}
          onChange={(e) => updateData('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          value={block.data.description || ''}
          onChange={(e) => updateData('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CTA Text
          </label>
          <input
            type="text"
            value={block.data.ctaText || 'Contact Us'}
            onChange={(e) => updateData('ctaText', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CTA Link
          </label>
          <input
            type="text"
            value={block.data.ctaLink || ''}
            onChange={(e) => updateData('ctaLink', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={block.data.showEmail !== false}
            onChange={(e) => updateData('showEmail', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Show Email</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={block.data.showPhone !== false}
            onChange={(e) => updateData('showPhone', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Show Phone</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={block.data.showAddress === true}
            onChange={(e) => updateData('showAddress', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Show Address</span>
        </label>
      </div>

      {block.data.showEmail && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={block.data.email || ''}
            onChange={(e) => updateData('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
      )}

      {block.data.showPhone && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={block.data.phone || ''}
            onChange={(e) => updateData('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
          />
        </div>
      )}

      {block.data.showAddress && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            value={block.data.address || ''}
            onChange={(e) => updateData('address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            rows={3}
          />
        </div>
      )}
    </div>
  )
}
