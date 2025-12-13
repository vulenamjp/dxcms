import { NextRequest, NextResponse } from 'next/server'
import { withPermission, AuthenticatedRequest } from '@/lib/auth/middleware'
import { PERMISSIONS } from '@/lib/rbac/constants'
import { prisma } from '@/lib/db'

// GET /api/admin/pages - List all pages (requires manage_content permission)
export const GET = withPermission(
  PERMISSIONS.MANAGE_CONTENT,
  async (req: AuthenticatedRequest) => {
    try {
      const pages = await prisma.page.findMany({
        select: {
          id: true,
          slug: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })

      return NextResponse.json({ pages })
    } catch (error) {
      console.error('Error fetching pages:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
)

// POST /api/admin/pages - Create a new page (requires manage_content permission)
export const POST = withPermission(
  PERMISSIONS.MANAGE_CONTENT,
  async (req: AuthenticatedRequest) => {
    try {
      const body = await req.json()
      const { slug, title, body: pageBody, status } = body

      // Validate input
      if (!slug || !title || !pageBody) {
        return NextResponse.json(
          { error: 'Slug, title, and body are required' },
          { status: 400 }
        )
      }

      // Check if slug already exists
      const existingPage = await prisma.page.findUnique({
        where: { slug },
      })

      if (existingPage) {
        return NextResponse.json(
          { error: 'A page with this slug already exists' },
          { status: 409 }
        )
      }

      // Create page
      const page = await prisma.page.create({
        data: {
          slug,
          title,
          body: pageBody,
          status: status || 'DRAFT',
          createdById: req.user!.userId,
          updatedById: req.user!.userId,
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

      return NextResponse.json({ page }, { status: 201 })
    } catch (error) {
      console.error('Error creating page:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
)
