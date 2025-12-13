import type { ServicesBlock } from '@/lib/blocks'

interface ServicesRendererProps {
  block: ServicesBlock
  services: any[]
}

export function ServicesRenderer({ block, services }: ServicesRendererProps) {
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
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
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {data.showIcon && service.icon && (
                  <div className="text-4xl mb-4">{service.icon}</div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                {data.showDescription && service.description && (
                  <p className="text-gray-600">{service.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {data.displayStyle === 'list' && (
          <div className="space-y-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4"
              >
                {data.showIcon && service.icon && (
                  <div className="text-3xl flex-shrink-0">{service.icon}</div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  {data.showDescription && service.description && (
                    <p className="text-gray-600">{service.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.displayStyle === 'carousel' && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-6 rounded-lg shadow-sm min-w-[300px] flex-shrink-0"
                >
                  {data.showIcon && service.icon && (
                    <div className="text-4xl mb-4">{service.icon}</div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  {data.showDescription && service.description && (
                    <p className="text-gray-600">{service.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {services.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No services available.
          </p>
        )}
      </div>
    </section>
  )
}
