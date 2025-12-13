import { z } from 'zod'
import { BaseBlockSchema } from './base'

/**
 * Rich Text Block Schema
 * For formatted text content (HTML)
 */
export const RichTextBlockDataSchema = z.object({
  content: z.string().min(1, 'Rich text content is required'),
  format: z.enum(['html', 'markdown']).optional().default('html'),
})

export const RichTextBlockSchema = BaseBlockSchema.extend({
  type: z.literal('richtext'),
  data: RichTextBlockDataSchema,
})

export type RichTextBlock = z.infer<typeof RichTextBlockSchema>

/**
 * Gallery Block Schema
 * For displaying image galleries
 */
export const GalleryImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  thumbnail: z.string().url().optional(),
})

export const GalleryBlockDataSchema = z.object({
  title: z.string().optional(),
  images: z.array(GalleryImageSchema).min(1, 'At least one image is required'),
  displayStyle: z.enum(['grid', 'masonry', 'carousel', 'slideshow']).optional().default('grid'),
  columns: z.number().min(1).max(6).optional().default(3),
  showCaptions: z.boolean().optional().default(true),
  lightbox: z.boolean().optional().default(true),
})

export const GalleryBlockSchema = BaseBlockSchema.extend({
  type: z.literal('gallery'),
  data: GalleryBlockDataSchema,
})

export type GalleryBlock = z.infer<typeof GalleryBlockSchema>

/**
 * Contact CTA Block Schema
 * Call-to-action block for contact information
 */
export const ContactCTABlockDataSchema = z.object({
  title: z.string().min(1, 'Contact title is required'),
  description: z.string().optional(),
  ctaText: z.string().optional().default('Contact Us'),
  ctaLink: z.string().optional(),
  showEmail: z.boolean().optional().default(true),
  showPhone: z.boolean().optional().default(true),
  showAddress: z.boolean().optional().default(false),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export const ContactCTABlockSchema = BaseBlockSchema.extend({
  type: z.literal('contact'),
  data: ContactCTABlockDataSchema,
})

export type ContactCTABlock = z.infer<typeof ContactCTABlockSchema>
