// Export all block schemas
export * from './base'
export * from './hero'
export * from './collections'
export * from './content'
export * from './schema'

// Export types
export type {
  BaseBlock,
  SEO,
} from './base'

export type {
  HeroBlock,
} from './hero'

export type {
  ServicesBlock,
  ProjectsBlock,
  NewsBlock,
} from './collections'

export type {
  RichTextBlock,
  GalleryBlock,
  ContactCTABlock,
} from './content'

export type {
  Block,
  BlockTypeValue,
  PageBody,
  PageInput,
} from './schema'
