import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getProductPath } from '@/lib/productUrls'
import type { Product } from '@/types/product'

export default function ProductCard({ product }: { product: Product }) {
  const category = typeof product.category === 'string' ? null : product.category

  return (
    <Link
      href={getProductPath(product.slug)}
      className="group block overflow-hidden rounded-sm border border-brand-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-100/70"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[#F0F8FF]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        {category ? (
          <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{category.name}</p>
        ) : null}
        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-[#111111]">{product.name}</h3>
          <ArrowUpRight size={19} className="mt-1 shrink-0 text-brand-600" />
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">{product.description}</p>
      </div>
    </Link>
  )
}
