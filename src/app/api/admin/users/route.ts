import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/password'
import { z } from 'zod'
import { Role } from '@/lib/types'

const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().optional(),
  isActive: z.boolean().default(true),
})

/**
 * GET /api/admin/users
 * List all users
 */
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    })

    // Format response to match frontend expectations
    interface FormattedUser {
      id: string
      name: string
      email: string
      userRoles: Role[]
      isActive: boolean
      createdAt: string
      updatedAt: string
    }

    const formattedUsers: FormattedUser[] = users.map((user: { id: any; name: any; email: any; userRoles: { role: Role }[]; createdAt: { toISOString: () => any }; updatedAt: { toISOString: () => any } }): FormattedUser => ({
      id: user.id,
      name: user.name || '',
      email: user.email,
      userRoles: user.userRoles.map(ur => ur.role),
      isActive: true,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }))

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
})

/**
 * POST /api/admin/users
 * Create a new user
 */
export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const validatedData = UserSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name || '',
        email: user.email,
        role: validatedData.role || 'user',
        isActive: validatedData.isActive,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
})
