import { create } from 'domain'
import { prisma } from '../db'
import { Permission, Role, User } from '../types'

/**
 * Get user with roles and permissions
 */
export async function getUserWithPermissions(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      userRoles: {
        select: {
          role: {
            select: {
              id: true,
              name: true,
              rolePermissions: {
                select: {
                  permission: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true
    },
  })

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    userRoles: user.userRoles.map((ur: Role) => ({
      id: ur.id,
      name: ur.name,
      rolePermissions: ur.rolePermissions.map((rp: Permission) => rp),
    })),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}

/**
 * Get all permissions for a user (flattened)
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await getUserWithPermissions(userId)
  if (!user) return []

  const permissions = new Set<string>()
  user.userRoles.forEach((role) => {
    role.rolePermissions.forEach((permission) => {
      permissions.add(permission.name)
    })
  })

  return Array.from(permissions)
}

/**
 * Check if user has a specific permission
 */
export async function userHasPermission(
  userId: string,
  permissionName: string
): Promise<boolean> {
  const permissions = await getUserPermissions(userId)
  return permissions.includes(permissionName)
}

/**
 * Check if user has any of the specified permissions
 */
export async function userHasAnyPermission(
  userId: string,
  permissionNames: string[]
): Promise<boolean> {
  const permissions = await getUserPermissions(userId)
  return permissionNames.some((perm) => permissions.includes(perm))
}

/**
 * Check if user has all of the specified permissions
 */
export async function userHasAllPermissions(
  userId: string,
  permissionNames: string[]
): Promise<boolean> {
  const permissions = await getUserPermissions(userId)
  return permissionNames.every((perm) => permissions.includes(perm))
}
