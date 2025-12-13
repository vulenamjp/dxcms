import { z } from 'zod'
import { BaseBlockSchema } from './base'

/**
 * Hero Block Schema
 * A large header section with title, subtitle, CTA, and background image
 */
export const HeroBlockDataSchema = z.object({
  title: z.string().min(1, 'Hero title is required').max(100),
  subtitle: z.string().max(200).optional(),
  ctaText: z.string().max(50).optional(),
  ctaLink: z.string().optional(),
  backgroundImage: z.string().url().optional().or(z.literal('')),
  backgroundVideo: z.string().url().optional().or(z.literal('')),
  alignment: z.enum(['left', 'center', 'right']).optional().default('center'),
  height: z.enum(['small', 'medium', 'large', 'full']).optional().default('medium'),
  overlay: z.boolean().optional().default(false),
  overlayOpacity: z.number().min(0).max(1).optional().default(0.5),
})

export const HeroBlockSchema = BaseBlockSchema.extend({
  type: z.literal('hero'),
  data: HeroBlockDataSchema,
})

export type HeroBlock = z.infer<typeof HeroBlockSchema>
