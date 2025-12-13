import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ProjectUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable().refine(
    (val) => !val || val.startsWith('/') || z.string().url().safeParse(val).success,
    { message: 'Invalid image URL' }
  ),
  url: z.string().optional().nullable().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    { message: 'Invalid URL' }
  ),
  category: z.string().optional().nullable(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

/**
 * GET /api/admin/projects/[id]
 * Get a single project
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await params

      const project = await prisma.project.findUnique({
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

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(project)
    } catch (error) {
      console.error('Error fetching project:', error)
      return NextResponse.json(
        { error: 'Failed to fetch project' },
        { status: 500 }
      )
    }
  })(req)
}

/**
 * PUT /api/admin/projects/[id]
 * Update a project
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await params
      const body = await authReq.json()
      const validatedData = ProjectUpdateSchema.parse(body)

      const user = (authReq as any).user

      // Convert empty strings to null for optional URL fields
      const data = {
        ...validatedData,
        imageUrl: validatedData.imageUrl === '' ? null : validatedData.imageUrl,
        url: validatedData.url === '' ? null : validatedData.url,
        updatedById: user.userId,
      }

      const project = await prisma.project.update({
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

      return NextResponse.json(project)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.issues },
          { status: 400 }
        )
      }

      console.error('Error updating project:', error)
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      )
    }
  })(req)
}

/**
 * DELETE /api/admin/projects/[id]
 * Delete a project
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await params

      await prisma.project.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error deleting project:', error)
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      )
    }
  })(req)
}
