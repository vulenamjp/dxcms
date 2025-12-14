"use client"

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { UserFormState } from '@/app/admin/users/actions'

export default function UserForm({
  action,
  initialData,
  roles = [],
}: {
  action: (state: UserFormState, payload: FormData) => Promise<UserFormState>
  initialData?: { name?: string; email?: string; role?: string }
  roles?: Array<{ id: string; name: string }>
}) {
  const [state, formAction] = useActionState(action as any, {})
  const { pending } = useFormStatus()

  return (
    <form action={formAction} className="space-y-4 p-4 border rounded bg-white">
      {state?.message && <p className="text-red-500">{state.message}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input name="name" defaultValue={initialData?.name} className="w-full border px-3 py-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" type="email" defaultValue={initialData?.email} className="w-full border px-3 py-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select name="role" defaultValue={initialData?.role} className="w-full border px-3 py-2 rounded">
          <option value="">-- Select role --</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input name="password" type="password" placeholder={initialData ? 'Leave blank to keep current password' : ''} className="w-full border px-3 py-2 rounded" />
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {pending ? 'Processing...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
