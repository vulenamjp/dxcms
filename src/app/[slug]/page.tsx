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
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 relative overflow-hidden font-sans">
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]"></div>
      </div>

      {/* Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight">
                CNEWS<span className="text-cyan-400">.</span>
              </span>
            </div>

            {/* Glass Menu */}
            <nav className="hidden md:block">
              <div className="flex items-center gap-1 rounded-full glass-panel px-2 py-1.5">
                {['Home', 'Services', 'Projects', 'News', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                    className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </nav>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <button className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] group">
                Get Started
                <svg 
                  className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 text-slate-300 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-20 min-h-screen flex flex-col">
        {/* Render blocks in order */}
        {body.blocks.map((block) => (
          <div key={block.id} className="w-full">
            <BlockRenderer block={block} collectionData={collectionData} />
          </div>
        ))}

        {/* Empty state if no blocks */}
        {body.blocks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Content Yet</h3>
            <p className="text-slate-400 max-w-md">
              This page is currently empty. Add some blocks in the admin panel to see them appear here with the new Aurora design.
            </p>
          </div>
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-xl mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">CNEWS<span className="text-cyan-400">.</span></span>
              <span className="text-sm text-slate-500 ml-4 border-l border-white/10 pl-4">
                © {new Date().getFullYear()} All rights reserved.
              </span>
            </div>
            <div className="flex gap-8">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <a key={item} href="#" className="text-sm text-slate-500 hover:text-cyan-400 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
