'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Block } from '@/lib/blocks'
import { BlockEditor } from './BlockEditor'
import { nanoid } from 'nanoid'

interface BlockListDnDProps {
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

export function BlockListDnD({ blocks, onChange }: BlockListDnDProps) {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const [showBlockMenu, setShowBlockMenu] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)

      onChange(arrayMove(blocks, oldIndex, newIndex))
    }
  }

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
  }

  const removeBlock = (blockId: string) => {
    if (confirm('Are you sure you want to remove this block?')) {
      onChange(blocks.filter((b) => b.id !== blockId))
      if (editingBlockId === blockId) {
        setEditingBlockId(null)
      }
    }
  }

  return (
    <div className="space-y-4">
      {blocks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No blocks added yet. Click "Add Block" to get started.
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableBlockItem
              key={block.id}
              block={block}
              isEditing={editingBlockId === block.id}
              onEdit={() =>
                setEditingBlockId(
                  editingBlockId === block.id ? null : block.id
                )
              }
              onUpdate={updateBlock}
              onRemove={removeBlock}
            />
          ))}
        </SortableContext>
      </DndContext>

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

function SortableBlockItem({
  block,
  isEditing,
  onEdit,
  onUpdate,
  onRemove,
}: {
  block: Block
  isEditing: boolean
  onEdit: () => void
  onUpdate: (blockId: string, block: Block) => void
  onRemove: (blockId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-gray-200 rounded-lg p-4 bg-white"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
            {...attributes}
            {...listeners}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
            </svg>
          </button>
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
            onClick={onEdit}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={() => onRemove(block.id)}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-4 bg-gray-50 p-4 rounded border border-gray-200">
          <BlockEditor
            block={block}
            onChange={(updatedBlock) => onUpdate(block.id, updatedBlock)}
          />
        </div>
      )}
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
