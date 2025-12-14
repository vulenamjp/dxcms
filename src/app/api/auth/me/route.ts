import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/jwt'
import { getUserWithPermissions } from '@/lib/rbac/permissions'
import { Permission } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user with roles and permissions
    const user = await getUserWithPermissions(currentUser.userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.name,
        name: user.name,
        userRoles: user.userRoles.map((role) => ({
          id: role.id,
          name: role.name,
          rolePermissions: role.rolePermissions.map((rp: Permission) => rp.name),
        })),
      },
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
