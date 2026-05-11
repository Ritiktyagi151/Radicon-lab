'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Blog pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-gray-200 bg-white text-gray-700 transition-all hover:border-brand-600 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      {pages.map((item) => (
        <button
          key={item}
          onClick={() => onPageChange(item)}
          className={`h-11 min-w-11 rounded-sm px-4 text-sm font-bold transition-all ${
            item === page
              ? 'bg-brand-600 text-white shadow-md shadow-brand-100'
              : 'border border-gray-200 bg-white text-gray-700 hover:border-brand-600 hover:text-brand-600'
          }`}
        >
          {item}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-gray-200 bg-white text-gray-700 transition-all hover:border-brand-600 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}
