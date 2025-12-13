import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from './jwt'
import { userHasPermission, userHasAnyPermission } from '../rbac/permissions'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    email: string
  }
}

/**
 * Middleware to check if user is authenticated
 */
export async function requireAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized. Please login.' },
      { status: 401 }
    )
  }

  // Add user to request
  const authenticatedRequest = request as AuthenticatedRequest
  authenticatedRequest.user = user

  return handler(authenticatedRequest)
}

/**
 * Middleware to check if user has a specific permission
 */
export async function requirePermission(
  request: NextRequest,
  permission: string,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized. Please login.' },
      { status: 401 }
    )
  }

  const hasPermission = await userHasPermission(user.userId, permission)

  if (!hasPermission) {
    return NextResponse.json(
      { error: `Forbidden. Required permission: ${permission}` },
      { status: 403 }
    )
  }

  // Add user to request
  const authenticatedRequest = request as AuthenticatedRequest
  authenticatedRequest.user = user

  return handler(authenticatedRequest)
}

/**
 * Middleware to check if user has any of the specified permissions
 */
export async function requireAnyPermission(
  request: NextRequest,
  permissions: string[],
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized. Please login.' },
      { status: 401 }
    )
  }

  const hasPermission = await userHasAnyPermission(user.userId, permissions)

  if (!hasPermission) {
    return NextResponse.json(
      {
        error: `Forbidden. Required one of: ${permissions.join(', ')}`,
      },
      { status: 403 }
    )
  }

  // Add user to request
  const authenticatedRequest = request as AuthenticatedRequest
  authenticatedRequest.user = user

  return handler(authenticatedRequest)
}

/**
 * Helper to create protected API route
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    return requireAuth(request, handler)
  }
}

/**
 * Helper to create permission-protected API route
 */
export function withPermission(
  permission: string,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    return requirePermission(request, permission, handler)
  }
}

/**
 * Helper to create API route protected by any of the permissions
 */
export function withAnyPermission(
  permissions: string[],
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    return requireAnyPermission(request, permissions, handler)
  }
}
