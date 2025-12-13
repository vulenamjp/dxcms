import { prisma } from '@/lib/prisma'
import { PageForm } from '@/components/admin/PageForm'
import { notFound } from 'next/navigation'
import type { PageBody } from '@/lib/blocks'
import { PageStatus } from '@prisma/client'

interface EditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPagePage({ params }: EditPageProps) {
  const { id } = await params
  
  const page = await prisma.page.findUnique({
    where: { id },
  })

  if (!page) {
    notFound()
  }

  const initialData = {
    slug: page.slug,
    title: page.title,
    status: page.status as PageStatus,
    body: page.body as PageBody,
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Page</h1>
      <PageForm mode="edit" pageId={page.id} initialData={initialData} />
    </div>
  )
}
