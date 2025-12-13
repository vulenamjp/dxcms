import { ServiceForm } from '@/components/admin/ServiceForm'

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Service</h1>
        <p className="text-gray-600 mt-1">Add a new service to your catalog</p>
      </div>

      <ServiceForm />
    </div>
  )
}
