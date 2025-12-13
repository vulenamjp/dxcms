import NewsForm from '@/components/admin/NewsForm'

interface EditNewsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params
  
  return <NewsForm newsId={id} isEdit />
}
