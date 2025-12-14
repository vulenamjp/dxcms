This is folder structure of manage user feature
src/
├── app/
    ├── admin/
    │   ├── users/
    │   │   ├── actions.ts          // Store Server Actions (Create/Update)
    │   │   ├── new/
    │   │   │   └── page.tsx        // Create new user page
    │   │   └── [id]/
    │   │   │    └── edit/
    │   │   │       └── page.tsx    // Update user page
    components/
    └── UserForm.tsx               // Common user add/edit form (Client Component)

Step 1: Implement app/admin/users/action.ts
```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Define state return to form
export type UserFormState = {
  message?: string
  errors?: {
    name?: string[]
    email?: string[]
  }
}

// ACTION 1: Create user
export async function createUser(prevState: UserFormState, formData: FormData) {
  // Get user information from form data
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  // Todo: Validate user information using Zod
  //

  // create user using prisma
  try {
    await prisma.user.create({
      data: { name, email },
    })
  } catch (error) {
    return { message: 'Database Error: Cannot tạo user' }
  }

  // Delete cache and redirect
  revalidatePath('/users')
  redirect('/users')
}

// ACTION 2: Update
// userId is input parameter an was bind() at component
export async function updateUser(userId: number, prevState: FormState, formData: FormData) {
  // Get user information from form data
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  // Todo: Validate user information using Zod
  //

  // Update user using prisma
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    })
  } catch (error) {
    return { message: 'Database Error: Cannot update user' }
  }

  revalidatePath('/admin/users')
  redirect('/admin/users')
}
```

Step 2: implement components/UserForm.tsx
```typescript
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { UserFormState } from '@/app/admin/users/actions'


function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
    >
      {pending ? 'Processing...' : label}
    </button>
  )
}

export default function UserForm({ 
  action, 
  initialData 
}: { 
  action: (state: FormState, payload: FormData) => Promise<FormState>, 
  initialData?: { name: string, email: string } 
}) {
  const [state, formAction] = useActionState(action, {})

  return (
    <form action={formAction} className="space-y-4 p-4 border rounded">
      {state.message && <p className="text-red-500">{state.message}</p>}
      
      <div>
        <label>Name</label>
        <input 
          name="name" 
          defaultValue={initialData?.name} 
          className="border p-2 w-full" 
          required 
        />
      </div>

      <div>
        <label>Email</label>
        <input 
          name="email" 
          defaultValue={initialData?.email} 
          className="border p-2 w-full" 
          required 
        />
      </div>

      <SubmitButton label={initialData ? 'Update' : 'Create'} />
    </form>
  )
}
```


Step 3: implement @/app/admin/users/new/page.tsx

```typescript
import UserForm from '@/components/UserForm'
import { createUser } from '@/app/admin/users/actions'

export default function NewUserPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Tạo User Mới</h1>
      {/* Truyền action create vào form */}
      <UserForm action={createUser} />
    </div>
  )
}
```

Step 4: implement @/app/admin/users/[id]/edit/page.tsx
```typescript
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import UserForm from '@/components/UserForm'
import { updateUser } from '@/app/admin/users/actions'

export default async function EditUserPage({ params }: { params: { id: string } }) {
  // 1. Get ID from URL
  const resolvedParams = await params; // Next.js 15
  const id = parseInt(resolvedParams.id)

  // 2. Fetch data
  const user = await prisma.user.findUnique({
    where: { id },
  })

  // 3. return 404 if not found
  if (!user) {
    notFound()
  }

  // 4. Bind ID to Server Action
  const updateUserWithId = updateUser.bind(null, user.id)

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Chỉnh sửa User #{id}</h1>
      <UserForm 
        action={updateUserWithId} 
        initialData={user} 
      />
    </div>
  )
}
```