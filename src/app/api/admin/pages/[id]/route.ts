import { NextRequest, NextResponse } from 'next/server'
import { withPermission, AuthenticatedRequest } from '@/lib/auth/middleware'
import { PERMISSIONS } from '@/lib/rbac/constants'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/admin/pages/[id] - Get a specific page
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  return withPermission(
    PERMISSIONS.MANAGE_CONTENT,
    async (authenticatedReq: AuthenticatedRequest) => {
      try {
        const { id } = await params

        const page = await prisma.page.findUnique({
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

        if (!page) {
          return NextResponse.json(
            { error: 'Page not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({ page })
      } catch (error) {
        console.error('Error fetching page:', error)
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        )
      }
    }
  )(req)
}

// PATCH /api/admin/pages/[id] - Update a page
export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
  return withPermission(
    PERMISSIONS.MANAGE_CONTENT,
    async (authenticatedReq: AuthenticatedRequest) => {
      try {
        const { id } = await params
        const body = await req.json()
        const { title, slug, body: pageBody, status } = body

        const page = await prisma.page.update({
          where: { id },
          data: {
            ...(title && { title }),
            ...(slug && { slug }),
            ...(pageBody && { body: pageBody }),
            ...(status && { status }),
            updatedById: authenticatedReq.user!.userId,
          },
          include: {
            updatedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        })

        return NextResponse.json({ page })
      } catch (error) {
        console.error('Error updating page:', error)
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        )
      }
    }
  )(req)
}

// DELETE /api/admin/pages/[id] - Delete a page
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  return withPermission(
    PERMISSIONS.MANAGE_CONTENT,
    async (authenticatedReq: AuthenticatedRequest) => {
      try {
        const { id } = await params

        await prisma.page.delete({
          where: { id },
        })

        return NextResponse.json({
          success: true,
          message: 'Page deleted successfully',
        })
      } catch (error) {
        console.error('Error deleting page:', error)
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        )
      }
    }
  )(req)
}
