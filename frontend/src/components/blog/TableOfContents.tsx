import type { TocItem } from './RichContent'

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (!items.length) return null

  return (
    <aside className="sticky top-28 rounded-sm border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Contents</p>
      <nav className="mt-4 space-y-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-sm leading-6 text-gray-600 transition-colors hover:text-brand-600 ${
              item.level === 3 ? 'pl-4' : 'font-semibold'
            }`}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </aside>
  )
}
