import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

/**
 * DELETE /api/admin/media/[id]
 * Delete a media file
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await params

      // Get media from database
      const media = await prisma.media.findUnique({
        where: { id },
      })

      if (!media) {
        return NextResponse.json(
          { error: 'Media not found' },
          { status: 404 }
        )
      }

      // Delete file from filesystem
      const filePath = join(process.cwd(), 'public', media.url)
      if (existsSync(filePath)) {
        await unlink(filePath)
      }

      // Delete from database
      await prisma.media.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error deleting media:', error)
      return NextResponse.json(
        { error: 'Failed to delete media' },
        { status: 500 }
      )
    }
  })(req)
}

/**
 * PUT /api/admin/media/[id]
 * Update media metadata
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await params
      const body = await authReq.json()

      const media = await prisma.media.update({
        where: { id },
        data: {
          alt: body.alt,
        },
      })

      return NextResponse.json(media)
    } catch (error) {
      console.error('Error updating media:', error)
      return NextResponse.json(
        { error: 'Failed to update media' },
        { status: 500 }
      )
    }
  })(req)
}
