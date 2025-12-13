import type { ProjectsBlock } from '@/lib/blocks'
import Image from 'next/image'

interface ProjectsRendererProps {
  block: ProjectsBlock
  projects: any[]
}

export function ProjectsRenderer({ block, projects }: ProjectsRendererProps) {
  const { data } = block

  const columnClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6',
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {data.title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {data.title}
          </h2>
        )}

        {data.description && (
          <p className="text-lg text-gray-600 mb-12">
            {data.description}
          </p>
        )}

        {data.displayStyle === 'grid' && (
          <div className={`grid ${columnClasses[data.columns]} gap-8`}>
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {project.image && (
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  {data.showDescription && project.description && (
                    <p className="text-gray-600">{project.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.displayStyle === 'masonry' && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow mb-8 break-inside-avoid"
              >
                {project.image && (
                  <div className="relative h-64 bg-gray-200">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  {data.showDescription && project.description && (
                    <p className="text-gray-600">{project.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {projects.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No projects available.
          </p>
        )}
      </div>
    </section>
  )
}
