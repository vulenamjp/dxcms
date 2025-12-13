import { prisma } from '../db'

export interface UserWithRoles {
  id: string
  email: string
  name: string | null
  roles: {
    id: string
    name: string
    permissions: {
      id: string
      name: string
    }[]
  }[]
}

/**
 * Get user with roles and permissions
 */
export async function getUserWithPermissions(userId: string): Promise<UserWithRoles | null> {
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
    },
  })

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roles: user.userRoles.map((ur) => ({
      id: ur.role.id,
      name: ur.role.name,
      permissions: ur.role.rolePermissions.map((rp) => rp.permission),
    })),
  }
}

/**
 * Get all permissions for a user (flattened)
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await getUserWithPermissions(userId)
  if (!user) return []

  const permissions = new Set<string>()
  user.roles.forEach((role) => {
    role.permissions.forEach((permission) => {
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
