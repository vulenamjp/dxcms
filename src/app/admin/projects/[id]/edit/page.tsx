import ProjectForm from '@/components/admin/ProjectForm'

interface EditProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  
  return <ProjectForm projectId={id} isEdit />
}
