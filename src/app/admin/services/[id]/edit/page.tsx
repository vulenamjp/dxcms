import { ServiceForm } from '@/components/admin/ServiceForm'

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
        <p className="text-gray-600 mt-1">Update service information</p>
      </div>

      <ServiceForm serviceId={id} isEdit />
    </div>
  )
}
