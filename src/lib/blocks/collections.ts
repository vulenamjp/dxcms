import { z } from 'zod'
import { BaseBlockSchema } from './base'

/**
 * Services Block Schema
 * Displays a list of services from the database
 */
export const ServicesBlockDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  limit: z.number().min(1).max(50).optional().default(6),
  displayStyle: z.enum(['grid', 'list', 'carousel']).optional().default('grid'),
  columns: z.number().min(1).max(6).optional().default(3),
  showIcon: z.boolean().optional().default(true),
  showDescription: z.boolean().optional().default(true),
  category: z.string().optional(), // Filter by category if needed
})

export const ServicesBlockSchema = BaseBlockSchema.extend({
  type: z.literal('services'),
  data: ServicesBlockDataSchema,
})

export type ServicesBlock = z.infer<typeof ServicesBlockSchema>

/**
 * Projects Block Schema
 * Displays a list of projects from the database
 */
export const ProjectsBlockDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  limit: z.number().min(1).max(50).optional().default(6),
  displayStyle: z.enum(['grid', 'masonry', 'carousel']).optional().default('grid'),
  columns: z.number().min(1).max(6).optional().default(3),
  showDescription: z.boolean().optional().default(true),
  category: z.string().optional(), // Filter by category
})

export const ProjectsBlockSchema = BaseBlockSchema.extend({
  type: z.literal('projects'),
  data: ProjectsBlockDataSchema,
})

export type ProjectsBlock = z.infer<typeof ProjectsBlockSchema>

/**
 * News Block Schema
 * Displays a list of news articles from the database
 */
export const NewsBlockDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  limit: z.number().min(1).max(50).optional().default(6),
  displayStyle: z.enum(['grid', 'list', 'featured']).optional().default('grid'),
  columns: z.number().min(1).max(6).optional().default(3),
  showExcerpt: z.boolean().optional().default(true),
  showImage: z.boolean().optional().default(true),
  showDate: z.boolean().optional().default(true),
  category: z.string().optional(), // Filter by category
})

export const NewsBlockSchema = BaseBlockSchema.extend({
  type: z.literal('news'),
  data: NewsBlockDataSchema,
})

export type NewsBlock = z.infer<typeof NewsBlockSchema>
