import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Permission, Role } from '@/lib/types'

const UpdateRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

/**
 * GET /api/admin/roles/[id]
 * Get a single role
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await context.params

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    return NextResponse.json({
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.rolePermissions.map((rp: any) => rp.permission.name),
        isActive: true,
        createdAt: role.createdAt.toISOString(),
        updatedAt: role.updatedAt.toISOString(),
        createdBy: { id: '1', name: 'System', email: 'system@example.com' },
      }
    })
  } catch (error) {
    console.error('Error fetching role:', error)
    return NextResponse.json(
      { error: 'Failed to fetch role' },
      { status: 500 }
    )
    }
  })(req)
}

/**
 * PUT /api/admin/roles/[id]
 * Update a role
 */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await context.params
    const body = await authReq.json()
    const validatedData = UpdateRoleSchema.parse(body)

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
    })

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    // Check if name is being changed and if it already exists
    if (validatedData.name && validatedData.name !== existingRole.name) {
      const nameExists = await prisma.role.findUnique({
        where: { name: validatedData.name },
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Role name already exists' },
          { status: 400 }
        )
      }
    }

    // Update role data
    const updateData: any = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description

    // Update permissions if provided
    if (validatedData.permissions !== undefined) {
      // Get permission IDs from permission names
      const permissions = await prisma.permission.findMany({
        where: {
          name: { in: validatedData.permissions },
        },
      })

      // Delete existing role permissions and create new ones
      await prisma.rolePermission.deleteMany({ where: { roleId: id } })

      updateData.rolePermissions = {
        create: permissions.map((permission: Permission) => ({ permissionId: permission.id })),
      }
    }

    const role = await prisma.role.update({
      where: { id },
      data: updateData,
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    const roleResult: Role = {
      id: role.id,
      name: role.name,
      description: role.description,
      rolePermissions: role.rolePermissions.map((rp: any) => rp.permission.name),
      isActive: validatedData.isActive ?? true,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
      createdBy: { id: '1', name: 'System', email: 'system@example.com' },
    }

    return NextResponse.json({ role: roleResult })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating role:', error)
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  }
  })(req)
}

/**
 * DELETE /api/admin/roles/[id]
 * Delete a role
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withAuth(async (authReq: NextRequest) => {
    try {
      const { id } = await context.params

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
    })

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    // Delete role (cascade will delete related rolePermissions and userRoles)
    await prisma.role.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting role:', error)
    return NextResponse.json(
      { error: 'Failed to delete role' },
      { status: 500 }
    )
  }
  })(req)
}
