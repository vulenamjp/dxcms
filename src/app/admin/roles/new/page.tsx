import { RoleForm } from '@/components/admin/RoleForm'

export default function NewRolePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Role</h1>
        <p className="text-gray-600 mt-1">Add a new role to your system</p>
      </div>

      <RoleForm />
    </div>
  )
}
