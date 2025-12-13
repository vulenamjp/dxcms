import type { RichTextBlock } from '@/lib/blocks'

interface RichTextRendererProps {
  block: RichTextBlock
}

export function RichTextRenderer({ block }: RichTextRendererProps) {
  const { data } = block

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div
          className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    </section>
  )
}
