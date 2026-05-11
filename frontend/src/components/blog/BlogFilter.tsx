'use client'

type BlogFilterProps = {
  categories: string[]
  activeCategory: string
  onChange: (category: string) => void
}

export default function BlogFilter({ categories, activeCategory, onChange }: BlogFilterProps) {
  return (
    <div>
      <div className="hidden flex-wrap gap-3 sm:flex">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`rounded-sm px-5 py-3 text-sm font-bold uppercase tracking-wide transition-all ${
              activeCategory === category
                ? 'bg-brand-600 text-white shadow-md shadow-brand-100'
                : 'border border-brand-100 bg-white text-gray-600 shadow-sm hover:border-brand-600 hover:text-brand-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <select
        value={activeCategory}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-sm border border-brand-100 bg-white px-4 text-sm font-bold text-gray-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100 sm:hidden"
        aria-label="Filter blogs by category"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  )
}
