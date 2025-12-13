'use client'

import { useState } from 'react'
import type { Block } from '@/lib/blocks'
import { BlockEditor } from './BlockEditor'
import { nanoid } from 'nanoid'

interface BlockListProps {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
}

const BLOCK_TYPES = [
  { type: 'hero', label: 'Hero', icon: '🎯' },
  { type: 'services', label: 'Services', icon: '⚙️' },
  { type: 'projects', label: 'Projects', icon: '📁' },
  { type: 'news', label: 'News', icon: '📰' },
  { type: 'richtext', label: 'Rich Text', icon: '📝' },
  { type: 'gallery', label: 'Gallery', icon: '🖼️' },
  { type: 'contact', label: 'Contact', icon: '📧' },
] as const

export function BlockList({ blocks, onChange }: BlockListProps) {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const [showBlockMenu, setShowBlockMenu] = useState(false)

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: nanoid(),
      type,
      data: getDefaultBlockData(type),
    } as Block

    onChange([...blocks, newBlock])
    setShowBlockMenu(false)
    setEditingBlockId(newBlock.id)
  }

  const updateBlock = (blockId: string, updatedBlock: Block) => {
    onChange(blocks.map((b) => (b.id === blockId ? updatedBlock : b)))
    setEditingBlockId(null)
  }

  const removeBlock = (blockId: string) => {
    if (confirm('Are you sure you want to remove this block?')) {
      onChange(blocks.filter((b) => b.id !== blockId))
    }
  }

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((b) => b.id === blockId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const newBlocks = [...blocks]
    const [removed] = newBlocks.splice(index, 1)
    newBlocks.splice(newIndex, 0, removed)
    onChange(newBlocks)
  }

  return (
    <div className="space-y-4">
      {blocks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No blocks added yet. Click "Add Block" to get started.
        </div>
      )}

      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">
                {BLOCK_TYPES.find((t) => t.type === block.type)?.icon || '📦'}
              </span>
              <span className="font-medium text-gray-900">
                {BLOCK_TYPES.find((t) => t.type === block.type)?.label ||
                  block.type}
              </span>
              <span className="text-xs text-gray-500">#{block.id}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => moveBlock(block.id, 'up')}
                disabled={index === 0}
                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveBlock(block.id, 'down')}
                disabled={index === blocks.length - 1}
                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingBlockId(
                    editingBlockId === block.id ? null : block.id
                  )
                }
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
              >
                {editingBlockId === block.id ? 'Done' : 'Edit'}
              </button>
              <button
                type="button"
                onClick={() => removeBlock(block.id)}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>

          {editingBlockId === block.id && (
            <div className="mt-4 bg-white p-4 rounded border border-gray-200">
              <BlockEditor
                block={block}
                onChange={(updatedBlock: Block) => updateBlock(block.id, updatedBlock)}
              />
            </div>
          )}
        </div>
      ))}

      {/* Add Block Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowBlockMenu(!showBlockMenu)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          + Add Block
        </button>

        {showBlockMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowBlockMenu(false)}
            />
            <div className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-2">
              <div className="grid grid-cols-2 gap-2">
                {BLOCK_TYPES.map((blockType) => (
                  <button
                    key={blockType.type}
                    type="button"
                    onClick={() => addBlock(blockType.type)}
                    className="flex items-center space-x-2 p-3 rounded hover:bg-gray-100 text-left"
                  >
                    <span className="text-2xl">{blockType.icon}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {blockType.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function getDefaultBlockData(type: string): any {
  switch (type) {
    case 'hero':
      return {
        title: 'Hero Title',
        alignment: 'center',
        height: 'medium',
      }
    case 'services':
      return {
        limit: 6,
        displayStyle: 'grid',
        columns: 3,
        showIcon: true,
        showDescription: true,
      }
    case 'projects':
      return {
        limit: 6,
        displayStyle: 'grid',
        columns: 3,
        showDescription: true,
      }
    case 'news':
      return {
        limit: 6,
        displayStyle: 'grid',
        columns: 3,
        showExcerpt: true,
        showImage: true,
        showDate: true,
      }
    case 'richtext':
      return {
        content: '<p>Enter your content here...</p>',
        format: 'html',
      }
    case 'gallery':
      return {
        images: [],
        displayStyle: 'grid',
        columns: 3,
        showCaptions: true,
        lightbox: true,
      }
    case 'contact':
      return {
        title: 'Get in Touch',
        ctaText: 'Contact Us',
        showEmail: true,
        showPhone: true,
        showAddress: false,
      }
    default:
      return {}
  }
}
