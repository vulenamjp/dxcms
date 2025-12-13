import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

/**
 * Home Page - Redirect to first published page with slug "home"
 * Or show a default landing page
 */
export default async function HomePage() {
  // Try to find a page with slug "home"
  const homePage = await prisma.page.findFirst({
    where: {
      slug: 'home',
      status: 'PUBLISHED',
    },
  })

  if (homePage) {
    // Redirect to the home page
    redirect('/home')
  }

  // Fallback: Show a simple landing page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">Welcome to CNews</h1>
        <p className="text-2xl mb-8">Advanced Block-Based CMS</p>
        <a
          href="/admin"
          className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Go to Admin
        </a>
      </div>
    </div>
  )
}
