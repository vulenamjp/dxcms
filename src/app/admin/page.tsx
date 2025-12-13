import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/pages"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pages</h2>
          <p className="text-gray-600">Manage block-based pages</p>
        </Link>

        <Link
          href="/admin/services"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Services</h2>
          <p className="text-gray-600">Manage services catalog</p>
        </Link>

        <Link
          href="/admin/projects"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Projects</h2>
          <p className="text-gray-600">Manage project portfolio</p>
        </Link>

        <Link
          href="/admin/news"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">News</h2>
          <p className="text-gray-600">Manage news articles</p>
        </Link>

        <Link
          href="/admin/media"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Media</h2>
          <p className="text-gray-600">Manage media library</p>
        </Link>
      </div>
    </div>
  )
}
