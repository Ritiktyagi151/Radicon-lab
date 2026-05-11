'use client'

import { Search } from 'lucide-react'

type BlogSearchProps = {
  value: string
  onChange: (value: string) => void
}

export default function BlogSearch({ value, onChange }: BlogSearchProps) {
  return (
    <label className="relative block w-full">
      <span className="sr-only">Search blogs</span>
      <Search
        size={20}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-600"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search articles..."
        className="h-14 w-full rounded-sm border border-brand-100 bg-white pl-12 pr-4 text-sm font-medium text-gray-800 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
      />
    </label>
  )
}
