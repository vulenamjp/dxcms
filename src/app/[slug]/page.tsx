import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import type { Metadata } from 'next'
import type { PageBody, ServicesBlock, ProjectsBlock, NewsBlock } from '@/lib/blocks'

interface PageProps {
  params: Promise<{ slug: string }>
}

/**
 * Generate SEO metadata for the page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  const page = await prisma.page.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
    },
  })

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  const body = page.body as PageBody
  const seo = body.seo || {}

  return {
    title: seo.title || page.title,
    description: seo.description,
    keywords: seo.keywords?.join(', '),
    openGraph: {
      title: seo.title || page.title,
      description: seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
      type: seo.ogType === 'blog' ? 'article' : seo.ogType === 'article' ? 'article' : 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title || page.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  }
}

/**
 * Fetch collection data for blocks that need it
 */
async function fetchCollectionData(blocks: PageBody['blocks']) {
  const collectionData: {
    services?: any[]
    projects?: any[]
    news?: any[]
  } = {}

  // Check which collections are needed
  const needsServices = blocks.some((block) => block.type === 'services')
  const needsProjects = blocks.some((block) => block.type === 'projects')
  const needsNews = blocks.some((block) => block.type === 'news')

  // Fetch in parallel
  const [services, projects, news] = await Promise.all([
    needsServices
      ? prisma.service.findMany({
          orderBy: { order: 'asc' },
          where: { isActive: true },
          take:
            (blocks.find((b) => b.type === 'services') as ServicesBlock | undefined)?.data
              .limit || 100,
        })
      : null,

    needsProjects
      ? prisma.project.findMany({
          orderBy: { order: 'asc' },
          where: {
            isActive: true,
            ...((() => {
              const projectsBlock = blocks.find((b) => b.type === 'projects') as
                | ProjectsBlock
                | undefined
              return projectsBlock?.data.category
                ? { category: projectsBlock.data.category }
                : {}
            })()),
          },
          take:
            (blocks.find((b) => b.type === 'projects') as ProjectsBlock | undefined)?.data
              .limit || 100,
        })
      : null,

    needsNews
      ? prisma.news.findMany({
          orderBy: { publishedAt: 'desc' },
          where: {
            ...((() => {
              const newsBlock = blocks.find((b) => b.type === 'news') as NewsBlock | undefined
              return newsBlock?.data.category ? { category: newsBlock.data.category } : {}
            })()),
          },
          take:
            (blocks.find((b) => b.type === 'news') as NewsBlock | undefined)?.data.limit || 100,
        })
      : null,
  ])

  if (services) collectionData.services = services
  if (projects) collectionData.projects = projects
  if (news) collectionData.news = news

  return collectionData
}

/**
 * Public Page Route - Render page by slug
 */
export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params

  // Fetch published page by slug
  const page = await prisma.page.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      createdBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  // Return 404 if page not found
  if (!page) {
    notFound()
  }

  const body = page.body as PageBody

  // Fetch collection data if needed
  const collectionData = await fetchCollectionData(body.blocks)

  return (
    <main className="min-h-screen">
      {/* Render blocks in order */}
      {body.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} collectionData={collectionData} />
      ))}

      {/* Empty state if no blocks */}
      {body.blocks.length === 0 && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500 text-xl">This page has no content yet.</p>
        </div>
      )}
    </main>
  )
}
