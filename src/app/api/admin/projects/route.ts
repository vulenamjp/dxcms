import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional().refine(
    (val) => !val || val.startsWith('/') || z.string().url().safeParse(val).success,
    { message: 'Invalid image URL' }
  ),
  url: z.string().optional().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    { message: 'Invalid URL' }
  ),
  category: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

/**
 * GET /api/admin/projects
 * List all projects
 */
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
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

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
})

/**
 * POST /api/admin/projects
 * Create a new project
 */
export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const validatedData = ProjectSchema.parse(body)

    const user = (req as any).user

    // Convert empty strings to null for optional URL fields
    const data = {
      ...validatedData,
      imageUrl: validatedData.imageUrl || null,
      url: validatedData.url || null,
      category: validatedData.category || null,
      description: validatedData.description || null,
      createdById: user.userId,
      updatedById: user.userId,
    }

    const project = await prisma.project.create({
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

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
})
