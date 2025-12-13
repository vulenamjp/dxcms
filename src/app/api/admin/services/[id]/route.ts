import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ServiceUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

/**
 * GET /api/admin/services/[id]
 * Get a single service
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await params

      const service = await prisma.service.findUnique({
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

      if (!service) {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(service)
    } catch (error) {
      console.error('Error fetching service:', error)
      return NextResponse.json(
        { error: 'Failed to fetch service' },
        { status: 500 }
      )
    }
  })(req)
}

/**
 * PUT /api/admin/services/[id]
 * Update a service
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await params
      const body = await authReq.json()
      const validatedData = ServiceUpdateSchema.parse(body)

      const user = (authReq as any).user

      const service = await prisma.service.update({
        where: { id },
        data: {
          ...validatedData,
          updatedById: user.userId,
        },
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

      return NextResponse.json(service)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.issues },
          { status: 400 }
        )
      }

      console.error('Error updating service:', error)
      return NextResponse.json(
        { error: 'Failed to update service' },
        { status: 500 }
      )
    }
  })(req)
}

/**
 * DELETE /api/admin/services/[id]
 * Delete a service
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await params

      await prisma.service.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error deleting service:', error)
      return NextResponse.json(
        { error: 'Failed to delete service' },
        { status: 500 }
      )
    }
  })(req)
}
