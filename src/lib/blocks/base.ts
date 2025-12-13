import { z } from 'zod'

/**
 * Base schema for all blocks
 * All blocks must have these fields
 */
export const BaseBlockSchema = z.object({
  id: z.string().min(1, 'Block ID is required'),
  type: z.string().min(1, 'Block type is required'),
  settings: z
    .object({
      className: z.string().optional(),
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
      padding: z.string().optional(),
      margin: z.string().optional(),
    })
    .optional()
    .default({}),
})

export type BaseBlock = z.infer<typeof BaseBlockSchema>

/**
 * SEO metadata schema
 */
export const SEOSchema = z.object({
  title: z.string().min(1, 'SEO title is required').max(60, 'SEO title must be 60 characters or less'),
  description: z.string().min(1, 'SEO description is required').max(160, 'SEO description must be 160 characters or less'),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().url().optional().or(z.literal('')),
  ogType: z.enum(['website', 'article', 'blog']).optional().default('website'),
})

export type SEO = z.infer<typeof SEOSchema>
