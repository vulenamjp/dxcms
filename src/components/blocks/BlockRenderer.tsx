'use client'

import type { Block } from '@/lib/blocks'
import { HeroRenderer } from './HeroRenderer'
import { ServicesRenderer } from './ServicesRenderer'
import { ProjectsRenderer } from './ProjectsRenderer'
import { NewsRenderer } from './NewsRenderer'
import { RichTextRenderer } from './RichTextRenderer'
import { GalleryRenderer } from './GalleryRenderer'
import { ContactRenderer } from './ContactRenderer'

interface BlockRendererProps {
  block: Block
  collectionData?: {
    services?: any[]
    projects?: any[]
    news?: any[]
  }
}

/**
 * Block Renderer - Registry Pattern
 * Maps block types to their respective renderer components
 * Handles unknown blocks gracefully
 */
export function BlockRenderer({ block, collectionData = {} }: BlockRendererProps) {
  try {
    switch (block.type) {
      case 'hero':
        return <HeroRenderer block={block} />

      case 'services':
        return <ServicesRenderer block={block} services={collectionData.services || []} />

      case 'projects':
        return <ProjectsRenderer block={block} projects={collectionData.projects || []} />

      case 'news':
        return <NewsRenderer block={block} articles={collectionData.news || []} />

      case 'richtext':
        return <RichTextRenderer block={block} />

      case 'gallery':
        return <GalleryRenderer block={block} />

      case 'contact':
        return <ContactRenderer block={block} />

      default:
        // Handle unknown block types gracefully
        console.warn(`Unknown block type: ${(block as any).type}`)
        return (
          <div className="py-8 px-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-yellow-800">
              Unknown block type: <code className="font-mono">{(block as any).type}</code>
            </p>
          </div>
        )
    }
  } catch (error) {
    // Handle rendering errors gracefully
    console.error('Error rendering block:', error)
    return (
      <div className="py-8 px-4 bg-red-50 border-l-4 border-red-400">
        <p className="text-red-800">
          Error rendering block. Please contact support.
        </p>
      </div>
    )
  }
}
