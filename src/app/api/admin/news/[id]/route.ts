import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const NewsUpdateSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only').optional(),
  title: z.string().min(1, 'Title is required').optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, 'Content is required').optional(),
  imageUrl: z.string().optional().nullable().refine(
    (val) => !val || val.startsWith('/') || z.string().url().safeParse(val).success,
    { message: 'Invalid image URL' }
  ),
  category: z.string().optional().nullable(),
  publishedAt: z.string().optional(),
})

/**
 * GET /api/admin/news/[id]
 * Get a single news article
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await params

      const news = await prisma.news.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          updatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      if (!news) {
        return NextResponse.json(
          { error: 'News article not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(news)
    } catch (error) {
      console.error('Error fetching news:', error)
      return NextResponse.json(
        { error: 'Failed to fetch news' },
        { status: 500 }
      )
    }
  })(req)
}

/**
 * PUT /api/admin/news/[id]
 * Update a news article
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await params
      const body = await authReq.json()
      const validatedData = NewsUpdateSchema.parse(body)

      const user = (authReq as any).user

      // If slug is being updated, check if it already exists
      if (validatedData.slug) {
        const existingNews = await prisma.news.findFirst({
          where: {
            slug: validatedData.slug,
            NOT: { id },
          },
        })

        if (existingNews) {
          return NextResponse.json(
            { error: 'A news article with this slug already exists' },
            { status: 400 }
          )
        }
      }

      // Convert empty strings to null for optional URL fields
      const data: any = {
        ...validatedData,
        imageUrl: validatedData.imageUrl === '' ? null : validatedData.imageUrl,
        updatedById: user.userId,
      }

      // Parse publishedAt if provided
      if (validatedData.publishedAt) {
        data.publishedAt = new Date(validatedData.publishedAt)
      }

      const news = await prisma.news.update({
        where: { id },
        data,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          updatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return NextResponse.json(news)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.issues },
          { status: 400 }
        )
      }

      console.error('Error updating news:', error)
      return NextResponse.json(
        { error: 'Failed to update news' },
        { status: 500 }
      )
    }
  })(req)
}

/**
 * DELETE /api/admin/news/[id]
 * Delete a news article
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await params

      await prisma.news.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error deleting news:', error)
      return NextResponse.json(
        { error: 'Failed to delete news' },
        { status: 500 }
      )
    }
  })(req)
}
