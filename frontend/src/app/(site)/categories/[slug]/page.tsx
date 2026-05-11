import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, LayoutGrid } from 'lucide-react'
import ProductListing from '@/components/products/ProductListing'
import { getCategories, getCategoryBySlug, getProducts } from '@/lib/productApi'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Category Not Found' }
  return {
    title: `${category.metaTitle || category.name} | Radicon Lab`,
    description: category.metaDescription || category.description,
  }
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category: category._id }),
  ])

  return (
    <div className="bg-white">
      {/* 1. Slim Red Top Accent */}
      <div className="h-1 w-full bg-brand-600" />

      {/* 2. Compact Header Section */}
      <header className="bg-white pt-8 pb-6 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Reduced Margin Breadcrumbs */}
          <nav className="mb-6 flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest">
            <Link 
              href="/categories" 
              className="text-gray-400 transition-colors hover:text-brand-600"
            >
              Categories
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-brand-600">{category.name}</span>
          </nav>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
            {/* Header Content - Reduced padding & spacing */}
            <div className="lg:col-span-8 border-l-4 border-brand-600 pl-5">
              <div className="flex items-center gap-2 mb-2">
                <LayoutGrid size={14} className="text-brand-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Therapeutic Range
                </span>
              </div>
              
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-[#111111] sm:text-5xl">
                {category.name}
              </h1>
              
              <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-gray-500">
                {category.description}
              </p>
            </div>

            {/* Quick Stats - More Compact */}
            <div className="lg:col-span-4 lg:mt-2">
              <div className="bg-[#F0F8FF] p-4 border-t-2 border-brand-600">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 leading-none">Inventory Status</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#111111] leading-none">{products.length}</span>
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Tightened Listing Section */}
      <main className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductListing 
            categories={categories} 
            products={products} 
            lockedCategoryId={category._id} 
          />
        </div>
      </main>

      {/* 4. Reduced Footer Margin */}
      <footer className="mt-10 h-1.5 w-full bg-brand-600" />
    </div>
  )
}
