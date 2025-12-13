# Block Schema & Validation

## Overview

Complete Zod-based validation system for block-based page content with strict type safety.

## Block Types

The CMS supports 7 block types:

### 1. Hero Block (`hero`)
Large header section with title, subtitle, CTA, and background.

**Fields:**
- `title` (required, max 100 chars)
- `subtitle` (optional, max 200 chars)
- `ctaText` (optional, max 50 chars)
- `ctaLink` (optional URL)
- `backgroundImage` (optional URL)
- `backgroundVideo` (optional URL)
- `alignment`: `left` | `center` | `right` (default: `center`)
- `height`: `small` | `medium` | `large` | `full` (default: `medium`)
- `overlay` (boolean, default: false)
- `overlayOpacity` (0-1, default: 0.5)

### 2. Services Block (`services`)
Displays services from database.

**Fields:**
- `title` (optional)
- `description` (optional)
- `limit` (1-50, default: 6)
- `displayStyle`: `grid` | `list` | `carousel` (default: `grid`)
- `columns` (1-6, default: 3)
- `showIcon` (boolean, default: true)
- `showDescription` (boolean, default: true)
- `category` (optional filter)

### 3. Projects Block (`projects`)
Displays projects from database.

**Fields:**
- `title` (optional)
- `description` (optional)
- `limit` (1-50, default: 6)
- `displayStyle`: `grid` | `masonry` | `carousel` (default: `grid`)
- `columns` (1-6, default: 3)
- `showDescription` (boolean, default: true)
- `category` (optional filter)

### 4. News Block (`news`)
Displays news articles from database.

**Fields:**
- `title` (optional)
- `description` (optional)
- `limit` (1-50, default: 6)
- `displayStyle`: `grid` | `list` | `featured` (default: `grid`)
- `columns` (1-6, default: 3)
- `showExcerpt` (boolean, default: true)
- `showImage` (boolean, default: true)
- `showDate` (boolean, default: true)
- `category` (optional filter)

### 5. Rich Text Block (`richtext`)
Formatted text content.

**Fields:**
- `content` (required HTML/Markdown)
- `format`: `html` | `markdown` (default: `html`)

### 6. Gallery Block (`gallery`)
Image gallery with multiple display styles.

**Fields:**
- `title` (optional)
- `images` (array, min 1 image required)
  - `id` (required)
  - `url` (required URL)
  - `alt` (optional)
  - `caption` (optional)
  - `thumbnail` (optional URL)
- `displayStyle`: `grid` | `masonry` | `carousel` | `slideshow` (default: `grid`)
- `columns` (1-6, default: 3)
- `showCaptions` (boolean, default: true)
- `lightbox` (boolean, default: true)

### 7. Contact CTA Block (`contact`)
Call-to-action for contact information.

**Fields:**
- `title` (required)
- `description` (optional)
- `ctaText` (optional, default: "Contact Us")
- `ctaLink` (optional URL)
- `showEmail` (boolean, default: true)
- `showPhone` (boolean, default: true)
- `showAddress` (boolean, default: false)
- `email` (optional, must be valid email)
- `phone` (optional)
- `address` (optional)

## Base Block Structure

All blocks extend the base schema:

```typescript
{
  id: string,              // Unique block identifier
  type: string,            // Block type
  data: {...},            // Block-specific data
  settings?: {            // Optional styling
    className?: string,
    backgroundColor?: string,
    textColor?: string,
    padding?: string,
    margin?: string,
  }
}
```

## Page Body Structure

```typescript
{
  version: number,        // Schema version (default: 1)
  seo: {
    title: string,        // Max 60 chars
    description: string,  // Max 160 chars
    keywords?: string[],
    ogImage?: string,     // URL
    ogType?: 'website' | 'article' | 'blog',
  },
  blocks: Block[]        // Array of blocks
}
```

## Validation

### Using Validation in Code

```typescript
import { PageInputSchema } from '@/lib/blocks'
import { validate } from '@/lib/validation'

const result = validate(PageInputSchema, data)

if (!result.success) {
  console.error(result.errors)
  // Handle validation errors
} else {
  const validData = result.data
  // Use validated data
}
```

### Validation Response Format

Success:
```json
{
  "success": true,
  "data": {...}
}
```

Error:
```json
{
  "success": false,
  "errors": [
    {
      "path": "body.blocks.0.data.title",
      "message": "Hero title is required",
      "code": "too_small"
    }
  ]
}
```

## Example Page Data

### Simple Home Page

```json
{
  "slug": "home",
  "title": "Home Page",
  "status": "DRAFT",
  "body": {
    "version": 1,
    "seo": {
      "title": "Welcome to Our Site",
      "description": "Discover amazing services and products"
    },
    "blocks": [
      {
        "id": "hero-1",
        "type": "hero",
        "data": {
          "title": "Welcome to Our Company",
          "subtitle": "We deliver excellence",
          "ctaText": "Learn More",
          "ctaLink": "/about",
          "alignment": "center",
          "height": "large"
        }
      },
      {
        "id": "services-1",
        "type": "services",
        "data": {
          "title": "Our Services",
          "limit": 6,
          "displayStyle": "grid",
          "columns": 3
        }
      }
    ]
  }
}
```

### With Rich Text and Gallery

```json
{
  "slug": "about",
  "title": "About Us",
  "status": "PUBLISHED",
  "body": {
    "version": 1,
    "seo": {
      "title": "About Our Company",
      "description": "Learn about our history and values"
    },
    "blocks": [
      {
        "id": "richtext-1",
        "type": "richtext",
        "data": {
          "content": "<h2>Our Story</h2><p>Founded in 2020...</p>",
          "format": "html"
        }
      },
      {
        "id": "gallery-1",
        "type": "gallery",
        "data": {
          "title": "Our Team",
          "images": [
            {
              "id": "img-1",
              "url": "https://example.com/team1.jpg",
              "alt": "Team photo",
              "caption": "Our amazing team"
            }
          ],
          "displayStyle": "grid",
          "columns": 4
        }
      }
    ]
  }
}
```

## API Integration

The validation is automatically applied in:

### POST /api/admin/pages
Creates a new page with full validation.

### PATCH /api/admin/pages/[id]
Updates a page with partial validation.

Both endpoints return validation errors in a consistent format:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "path": "slug",
      "message": "Slug must be lowercase alphanumeric with hyphens"
    }
  ]
}
```

## Type Safety

All schemas provide TypeScript types:

```typescript
import type { 
  PageBody, 
  Block, 
  HeroBlock,
  ServicesBlock,
  // ... other block types
} from '@/lib/blocks'

// Type-safe block creation
const heroBlock: HeroBlock = {
  id: 'hero-1',
  type: 'hero',
  data: {
    title: 'Welcome',
    alignment: 'center',
    height: 'medium',
  }
}
```

## Validation Rules

### Slug Validation
- Required
- Max 100 characters
- Lowercase alphanumeric with hyphens only
- Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`

### SEO Validation
- Title: Required, max 60 characters
- Description: Required, max 160 characters
- Keywords: Optional array
- OG Image: Optional valid URL
- OG Type: website | article | blog

### Block ID Validation
- Must be unique within a page
- No empty strings
- Recommended format: `{type}-{number}` (e.g., `hero-1`)

## Error Handling

Validation errors are caught and returned as:
- HTTP 400 Bad Request
- JSON response with error details
- Path indicates exact field location
- Message describes the problem

## Testing Validation

```bash
# Valid request
curl -X POST http://localhost:3000/api/admin/pages \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "slug": "test-page",
    "title": "Test Page",
    "body": {
      "version": 1,
      "seo": {
        "title": "Test",
        "description": "Test page description"
      },
      "blocks": []
    }
  }'

# Invalid slug (uppercase)
curl -X POST http://localhost:3000/api/admin/pages \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "slug": "Test-Page",
    "title": "Test",
    "body": {...}
  }'

# Returns validation error
```

## Best Practices

1. **Always validate on server**: Client-side validation is convenience, server-side is security
2. **Use discriminated unions**: Type-safe block handling
3. **Provide defaults**: Sensible defaults for optional fields
4. **Clear error messages**: Help users fix validation issues
5. **Version your schema**: Use `version` field for future migrations
6. **Test edge cases**: Empty arrays, null values, max lengths

## Future Enhancements

- Custom block types via plugins
- Block templates/presets
- Block versioning per block
- A/B testing variants
- Block permissions (who can add which blocks)
