import { NextRequest, NextResponse } from 'next/server'
import { withPermission, AuthenticatedRequest } from '@/lib/auth/middleware'
import { PERMISSIONS } from '@/lib/rbac/constants'
import { prisma } from '@/lib/db'
import { userHasPermission } from '@/lib/rbac/permissions'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// POST /api/admin/pages/[id]/publish - Publish a page
export async function POST(
  req: NextRequest,
  { params }: RouteParams
) {
  return withPermission(
    PERMISSIONS.PUBLISH_CONTENT,
    async (authenticatedReq: AuthenticatedRequest) => {
      try {
        const { id } = await params

        // Verify user has publish permission
        const canPublish = await userHasPermission(
          authenticatedReq.user!.userId,
          PERMISSIONS.PUBLISH_CONTENT
        )

        if (!canPublish) {
          return NextResponse.json(
            { error: 'Forbidden. You do not have permission to publish content.' },
            { status: 403 }
          )
        }

        const page = await prisma.page.update({
          where: { id },
          data: {
            status: 'PUBLISHED',
            publishAt: new Date(),
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

        return NextResponse.json({
          success: true,
          message: 'Page published successfully',
          page,
        })
      } catch (error) {
        console.error('Error publishing page:', error)
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        )
      }
    }
  )(req)
}
