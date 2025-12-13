import type { HeroBlock } from '@/lib/blocks'
import Link from 'next/link'

interface HeroRendererProps {
  block: HeroBlock
}

export function HeroRenderer({ block }: HeroRendererProps) {
  const { data } = block

  const heightClasses = {
    small: 'min-h-[300px]',
    medium: 'min-h-[500px]',
    large: 'min-h-[700px]',
    full: 'min-h-screen',
  }

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  return (
    <section
      className={`relative flex flex-col justify-center ${heightClasses[data.height]} ${alignmentClasses[data.alignment]} px-4 sm:px-6 lg:px-8`}
      style={{
        backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      {data.overlay && data.backgroundImage && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: data.overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className={`max-w-3xl ${data.alignment === 'center' ? 'mx-auto' : data.alignment === 'right' ? 'ml-auto' : ''}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            {data.title}
          </h1>
          
          {data.subtitle && (
            <p className="text-xl sm:text-2xl text-white/90 mb-8">
              {data.subtitle}
            </p>
          )}

          {data.ctaText && data.ctaLink && (
            <Link
              href={data.ctaLink}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              {data.ctaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
