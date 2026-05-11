import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import { getCategoryPath } from '@/lib/categoryUrls'
import { getCategories } from '@/lib/productApi'

export const metadata: Metadata = {
  title: 'Product Categories | Radicon Lab',
  description: 'Browse Radicon Lab product categories and pharmaceutical product ranges.',
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen font-sans">
      {/* 1. Top Image Banner Section */}
      <section className="relative h-[340px] w-full overflow-hidden bg-brand-600 sm:h-[400px]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://www.shutterstock.com/image-photo/long-banner-medical-utensils-advertising-260nw-1907184505.jpg" // Yahan apni banner image ka path lagayein
            alt="Radicon Lab Banner"
            className="h-full w-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-600/80 to-transparent" />
        </div>

        {/* Content on Image */}
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto max-w-7xl px-4 w-full sm:px-6 lg:px-8">
            <div className="max-w-2xl border-l-4 border-white pl-4 sm:border-l-8 sm:pl-8">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/90 sm:text-sm sm:tracking-[0.3em]">
                Radicon Lab Pharmaceutical
              </span>
              <h1 className="mt-4 text-4xl font-black uppercase italic tracking-tighter text-white sm:text-6xl lg:text-7xl">
                OUR MEDICINE <br />
                <span className="text-white">RANGE</span>
              </h1>
              <p className="mt-5 text-base font-medium leading-relaxed text-white/80 sm:mt-6 sm:text-lg">
                Explore our high-quality pharmaceutical formulations across multiple therapeutic categories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Grid Section */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 border-b-2 border-brand-600 pb-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-black uppercase tracking-tight text-[#111111]">
              Product <span className="text-brand-600">Categories</span>
            </h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Total {categories.length} Units
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={getCategoryPath(category.slug)}
                className="group relative flex flex-col border border-line bg-white p-6 transition-all hover:border-brand-600 hover:shadow-2xl hover:shadow-brand-600/10"
              >
                {/* Image Box */}
                <div className="mb-6 aspect-square w-full overflow-hidden bg-gray-50 border border-gray-50">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-200">
                      <Search size={48} strokeWidth={1} />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-black uppercase tracking-tight text-[#111111] transition-colors group-hover:text-brand-600">
                      {category.name}
                    </h3>
                    <div className="rounded-full bg-gray-50 p-2 transition-colors group-hover:bg-brand-600">
                      <ArrowUpRight size={20} className="text-brand-600 group-hover:text-white" />
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {category.description}
                  </p>
                </div>
                
                {/* Bottom Red Accent Line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {!categories.length && (
            <div className="py-32 text-center">
              <h2 className="text-2xl font-bold uppercase text-gray-300">
                No Categories Found
              </h2>
            </div>
          )}
        </div>
      </section>

      {/* Footer Accent */}
      <div className="h-4 w-full bg-brand-600" />
    </div>
  )
}
