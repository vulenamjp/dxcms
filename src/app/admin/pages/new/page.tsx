import { PageForm } from '@/components/admin/PageForm'

export default function NewPagePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Page</h1>
      <PageForm mode="create" />
    </div>
  )
}
