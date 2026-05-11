'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ChevronRight, MessageCircle, ShieldCheck } from 'lucide-react'
import InquiryModal from '@/components/InquiryModal'
import { getCategoryPath } from '@/lib/categoryUrls'
import type { Product } from '@/types/product'
import ProductCard from './ProductCard'

type ProductDetailClientProps = {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const category = typeof product.category === 'string' ? null : product.category
  const images = [product.image, ...product.gallery].filter(Boolean)
  const mainImage = images[0] || '/radicon-logo.png'
  const summary = product.shortDescription || product.description

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="h-1.5 w-full bg-[#DF1F26]" />

      <section className="border-b border-[#DF1F26]/15 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-widest">
            <Link href="/categories" className="text-black transition hover:text-[#DF1F26]">
              Categories
            </Link>
            {category ? (
              <>
                <ChevronRight size={14} className="text-[#DF1F26]" />
                <Link href={getCategoryPath(category.slug)} className="text-black transition hover:text-[#DF1F26]">
                  {category.name}
                </Link>
              </>
            ) : null}
            <ChevronRight size={14} className="text-[#DF1F26]" />
            <span className="text-[#DF1F26]">{product.name}</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid items-start gap-8 lg:grid-cols-[0.94fr_1.06fr]">
          <div>
            <div className="aspect-[4/3] overflow-hidden border border-[#DF1F26]/20 bg-white">
              <img
                src={mainImage}
                alt={product.name}
                className="h-full w-full object-contain p-3 sm:p-6"
              />
            </div>

            {images.length > 1 ? (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {images.slice(0, 5).map((image) => (
                  <div key={image} className="aspect-square border border-[#DF1F26]/25 bg-white p-2">
                    <img src={image} alt={product.name} className="h-full w-full object-contain" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="pt-1">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#DF1F26]">
              <ShieldCheck size={17} />
              Radicon Lab Quality
            </div>

            <h1 className="mt-3 break-words text-3xl font-black uppercase leading-tight tracking-normal text-black sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>

            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-black/70">
              {summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="border border-[#DF1F26] bg-[#DF1F26] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                GMP Focused
              </span>
              {product.sku ? (
                <span className="border border-[#DF1F26] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#DF1F26]">
                  SKU {product.sku}
                </span>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 bg-[#DF1F26] px-7 py-3.5 text-sm font-black uppercase italic tracking-widest text-white transition hover:bg-[#111111] sm:w-auto"
            >
              <MessageCircle size={19} />
              Enquire Now
            </button>

            <div className="mt-6 border-l-4 border-[#DF1F26] bg-[#F0F8FF] p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-700">
                <AlertTriangle size={17} />
                Precautions & Suggestions
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-gray-700">
                Use only under professional guidance. Store in a cool, dry place, away from direct
                sunlight and out of reach of children. Follow dosage and handling instructions
                provided by a qualified healthcare professional.
              </p>
            </div>
          </div>
        </section>

        {product.fullContent ? (
          <section className="mt-10 border border-[#DF1F26]/20 bg-white p-5">
            <div
              className="blog-rich-content"
              dangerouslySetInnerHTML={{ __html: product.fullContent }}
            />
          </section>
        ) : null}

        {relatedProducts.length ? (
          <section className="mt-10">
            <div className="mb-5 flex items-end justify-between border-b-2 border-[#DF1F26] pb-3">
              <h2 className="text-2xl font-black uppercase tracking-normal text-black">
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
      />
    </div>
  )
}
