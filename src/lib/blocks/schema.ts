import { z } from 'zod'
import { SEOSchema } from './base'
import { HeroBlockSchema } from './hero'
import { ServicesBlockSchema, ProjectsBlockSchema, NewsBlockSchema } from './collections'
import { RichTextBlockSchema, GalleryBlockSchema, ContactCTABlockSchema } from './content'

/**
 * Block Types Enum
 */
export const BlockType = {
  HERO: 'hero',
  SERVICES: 'services',
  PROJECTS: 'projects',
  NEWS: 'news',
  RICHTEXT: 'richtext',
  GALLERY: 'gallery',
  CONTACT: 'contact',
} as const

export type BlockTypeValue = typeof BlockType[keyof typeof BlockType]

/**
 * Discriminated Union of all Block Types
 * This is the core schema that validates any block
 */
export const BlockSchema = z.discriminatedUnion('type', [
  HeroBlockSchema,
  ServicesBlockSchema,
  ProjectsBlockSchema,
  NewsBlockSchema,
  RichTextBlockSchema,
  GalleryBlockSchema,
  ContactCTABlockSchema,
])

export type Block = z.infer<typeof BlockSchema>

/**
 * Page Body Schema
 * The complete structure for a page's content
 */
export const PageBodySchema = z.object({
  version: z.number().int().positive().default(1),
  seo: SEOSchema,
  blocks: z.array(BlockSchema).default([]),
})

export type PageBody = z.infer<typeof PageBodySchema>

/**
 * Helper type for block data by type
 */
export type BlockData<T extends BlockTypeValue> = Extract<Block, { type: T }>['data']

/**
 * Page Create/Update Input Schema
 */
export const PageInputSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1, 'Title is required').max(200),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional().default('DRAFT'),
  body: PageBodySchema,
  publishAt: z.string().datetime().optional().nullable(),
})

export type PageInput = z.infer<typeof PageInputSchema>
