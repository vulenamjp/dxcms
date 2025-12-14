import { RoleForm } from '@/components/admin/RoleForm'

interface EditRolePageProps {
  params: Promise<{ id: string }>
}

export default async function EditRolePage({ params }: EditRolePageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Role</h1>
        <p className="text-gray-600 mt-1">Update role information</p>
      </div>

      <RoleForm roleId={id} isEdit />
    </div>
  )
}
