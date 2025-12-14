"use server"

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { hashPassword } from '@/lib/auth/password'

export type UserFormState = {
  message?: string
  errors?: {
    name?: string[]
    email?: string[]
  }
}

// ACTION 1: Create user
export async function createUser(prevState: UserFormState, formData: FormData) {
  const name = (formData.get('name') as string) || null
  const email = (formData.get('email') as string) || null
  const password = (formData.get('password') as string) || null
  const role = (formData.get('role') as string) || null // expect role id

  if (!email || !password) {
    return { message: 'Email and password are required' }
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: name ?? undefined,
        email,
        passwordHash: await hashPassword(password),
      },
    })

    if (role) {
      // attach role (single role select)
      try {
        await prisma.userRole.create({ data: { userId: user.id, roleId: role } })
      } catch (err) {
        // ignore role attach error but continue
        console.error('Failed to attach role', err)
      }
    }
  } catch (error) {
    console.error(error)
    return { message: 'Database Error: Cannot create user' }
  }

  revalidatePath('/admin/users')
  redirect('/admin/users')
}

// ACTION 2: Update user
export async function updateUser(userId: string, prevState: UserFormState, formData: FormData) {
  const name = (formData.get('name') as string) || null
  const email = (formData.get('email') as string) || null
  const password = (formData.get('password') as string) || null
  const role = (formData.get('role') as string) || null

  try {
    const data: any = {}
    if (name !== null) data.name = name
    if (email !== null) data.email = email
    if (password) data.passwordHash = await hashPassword(password)

    await prisma.user.update({ where: { id: userId }, data })

    // update role: remove existing links and add the selected one
    if (role) {
      await prisma.userRole.deleteMany({ where: { userId } })
      try {
        await prisma.userRole.create({ data: { userId, roleId: role } })
      } catch (err) {
        console.error('Failed to set role', err)
      }
    }
  } catch (error) {
    console.error(error)
    return { message: 'Database Error: Cannot update user' }
  }

  revalidatePath('/admin/users')
  redirect('/admin/users')
}
