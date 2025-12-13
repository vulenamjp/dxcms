import type { ContactCTABlock } from '@/lib/blocks'
import Link from 'next/link'

interface ContactRendererProps {
  block: ContactCTABlock
}

export function ContactRenderer({ block }: ContactRendererProps) {
  const { data } = block

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{data.title}</h2>

        {data.description && (
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {data.description}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {data.showEmail && data.email && (
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={`mailto:${data.email}`} className="hover:text-blue-200">
                {data.email}
              </a>
            </div>
          )}

          {data.showPhone && data.phone && (
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${data.phone}`} className="hover:text-blue-200">
                {data.phone}
              </a>
            </div>
          )}

          {data.showAddress && data.address && (
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{data.address}</span>
            </div>
          )}
        </div>

        {data.ctaText && data.ctaLink && (
          <Link
            href={data.ctaLink}
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {data.ctaText}
          </Link>
        )}
      </div>
    </section>
  )
}
