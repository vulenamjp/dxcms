import { prisma } from '@/lib/prisma'
import UserForm from '@/components/admin/UserForm'
import { createUser } from '@/app/admin/users/actions'

export default async function NewUserPage() {
  const roles = await prisma.role.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add New User</h1>
      {/* Pass server action createUser into client form */}
      <UserForm action={createUser} roles={roles} />
    </div>
  )
}
