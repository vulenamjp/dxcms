import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const NewsSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().optional().refine(
    (val) => !val || val.startsWith('/') || z.string().url().safeParse(val).success,
    { message: 'Invalid image URL' }
  ),
  category: z.string().optional(),
  publishedAt: z.string().optional(),
})

/**
 * GET /api/admin/news
 * List all news articles
 */
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { publishedAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ news })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
})

/**
 * POST /api/admin/news
 * Create a new news article
 */
export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const validatedData = NewsSchema.parse(body)

    const user = (req as any).user

    // Check if slug already exists
    const existingNews = await prisma.news.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingNews) {
      return NextResponse.json(
        { error: 'A news article with this slug already exists' },
        { status: 400 }
      )
    }

    // Convert empty strings to null for optional fields
    const data = {
      slug: validatedData.slug,
      title: validatedData.title,
      content: validatedData.content,
      excerpt: validatedData.excerpt || null,
      imageUrl: validatedData.imageUrl || null,
      category: validatedData.category || null,
      publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : new Date(),
      createdById: user.userId,
      updatedById: user.userId,
    }

    const news = await prisma.news.create({
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    )
  }
})
