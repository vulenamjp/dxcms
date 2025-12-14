import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/jwt'

import Link from 'next/link'

import AdminHeaderWrapper from '@/components/admin/AdminHeaderWrapper'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                CMS Admin
              </Link>
              <nav className="flex space-x-4">
                <Link
                  href="/admin/pages"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Pages
                </Link>
                <Link
                  href="/admin/services"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Services
                </Link>
                <Link
                  href="/admin/projects"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Projects
                </Link>
                <Link
                  href="/admin/news"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  News
                </Link>
                <Link
                  href="/admin/media"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Media
                </Link>
              </nav>
            </div>
            <AdminHeaderWrapper user={{
              name: (user as any).name,
              email: (user as any).email,
              avatarUrl: (user as any).avatarUrl || undefined,
            }} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
