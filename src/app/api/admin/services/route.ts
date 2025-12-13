import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ServiceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

/**
 * GET /api/admin/services
 * List all services
 */
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const services = await prisma.service.findMany({
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

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
})

/**
 * POST /api/admin/services
 * Create a new service
 */
export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const validatedData = ServiceSchema.parse(body)

    const user = (req as any).user

    const service = await prisma.service.create({
      data: {
        ...validatedData,
        createdById: user.userId,
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
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
})
