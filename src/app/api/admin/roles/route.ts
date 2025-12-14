import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Permission, Role } from '@/lib/types'

const RoleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  permissions: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
})

/**
 * GET /api/admin/roles
 * List all roles
 */
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    // Format response to match frontend expectations
    const formattedRoles = roles.map((role: Role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.rolePermissions.map((rp: Permission) => rp.name),
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString()
    }))

    return NextResponse.json({ roles: formattedRoles })
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    )
  }
})

/**
 * POST /api/admin/roles
 * Create a new role
 */
export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const validatedData = RoleSchema.parse(body)

    // Check if role name already exists
    const existingRole = await prisma.role.findUnique({
      where: { name: validatedData.name },
    })

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role name already exists' },
        { status: 400 }
      )
    }

    // Get permission IDs from permission names
    const permissions = await prisma.permission.findMany({
      where: {
        name: { in: validatedData.permissions },
      },
    })

    // Create role with permissions
    const role = await prisma.role.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        rolePermissions: {
          create: permissions.map((permission: Permission) => ({
            permissionId: permission.id,
          })),
        },
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    return NextResponse.json({
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.rolePermissions.map((rp: Permission) => rp.name),
        createdAt: role.createdAt.toISOString(),
        updatedAt: role.updatedAt.toISOString()
      }
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating role:', error)
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    )
  }
})
