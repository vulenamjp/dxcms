import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import UserForm from '@/components/admin/UserForm'
import { updateUser } from '@/app/admin/users/actions'

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params
  const id = resolvedParams.id

  const user = await prisma.user.findUnique({
    where: { id },
    include: { userRoles: { include: { role: true } } },
  })

  if (!user) return notFound()

  const currentRoleId = user.userRoles?.[0]?.role?.id || ''

  const roles = await prisma.role.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })

  const updateUserWithId = updateUser.bind(null, user.id)

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      <UserForm
        action={updateUserWithId}
        initialData={{ name: user.name ?? undefined, email: user.email, role: currentRoleId }}
        roles={roles}
      />
    </div>
  )
}
