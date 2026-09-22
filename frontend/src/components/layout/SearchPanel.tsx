'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { getProducts, getCategories } from '@/lib/productApi'
import { getAllPublishedBlogs } from '@/lib/blogApi'
import { getAboutPages, getAboutPath } from '@/lib/aboutData'
import { getServicePath, getServices } from '@/lib/serviceData'
import { getCategoryPath } from '@/lib/categoryUrls'
import { getProductPath } from '@/lib/productUrls'
import type { Blog } from '@/types/blog'
import type { Category, Product } from '@/types/product'

const aboutLinks = getAboutPages()
const serviceLinks = getServices()
type SearchItem = {
  title: string;
  href: string;
  type: 'Product' | 'Category' | 'Blog' | 'Service' | 'About' | 'Page';
  description?: string;
  keywords: string;
};

const coreSearchPages: SearchItem[] = [
  {
    title: 'Home',
    href: '/',
    type: 'Page',
    description: 'Radicon Laboratories homepage',
    keywords: 'home radicon laboratories pharmaceutical manufacturing healthcare',
  },
  {
    title: 'Products',
    href: '/categories',
    type: 'Page',
    description: 'Browse medicine categories and product range',
    keywords: 'products medicines categories tablets capsules ointments oral strips range',
  },
  {
    title: 'Services',
    href: '/services',
    type: 'Page',
    description: 'Manufacturing and pharmaceutical services',
    keywords: 'services manufacturing contract manufacturing regulatory research development',
  },
  {
    title: 'Blogs',
    href: '/blog',
    type: 'Page',
    description: 'Healthcare and pharmaceutical articles',
    keywords: 'blogs articles news healthcare pharmaceutical',
  },
  {
    title: 'Contact',
    href: '/contact',
    type: 'Page',
    description: 'Reach Radicon Laboratories',
    keywords: 'contact phone email inquiry appointment address',
  },
  {
    title: 'Career',
    href: '/career',
    type: 'Page',
    description: 'Career opportunities at Radicon',
    keywords: 'career jobs hiring opportunities',
  },
];

const makeSearchText = (...parts: Array<string | string[] | undefined | null>) =>
  parts.flatMap((part) => (Array.isArray(part) ? part : [part])).filter(Boolean).join(' ').toLowerCase();


export default function SearchPanel({ isScrolled, onClose }: { isScrolled: boolean; onClose: () => void }) {
  const isSearchOpen = true
  const closeSearch = onClose
  const [searchQuery, setSearchQuery] = useState('');
  const [searchItems, setSearchItems] = useState<SearchItem[]>(coreSearchPages);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const items = query
      ? searchItems.filter((item) => item.keywords.includes(query))
      : searchItems;

    return items.slice(0, 18);
  }, [searchItems, searchQuery]);

  useEffect(() => {
    if (!isSearchOpen || searchItems.length > coreSearchPages.length) return;

    let isMounted = true;

    Promise.all([
      getProducts(),
      getAllPublishedBlogs(),
      getCategories(),
    ])
      .then(([products, blogs, loadedCategories]) => {
        if (!isMounted) return;

        const productItems = products.map((product: Product): SearchItem => {
          const categoryName = typeof product.category === 'string' ? '' : product.category?.name;
          return {
            title: product.name,
            href: getProductPath(product.slug),
            type: 'Product',
            description: product.shortDescription || product.description || categoryName || 'Product details',
            keywords: makeSearchText(
              product.name,
              product.sku,
              product.description,
              product.shortDescription,
              product.fullContent,
              product.tags,
              product.seoKeywords,
              categoryName
            ),
          };
        });

        const categoryItems = loadedCategories.map((category: Category): SearchItem => ({
          title: category.name,
          href: getCategoryPath(category.slug),
          type: 'Category',
          description: category.description || 'Product category',
          keywords: makeSearchText(category.name, category.description, category.metaTitle, category.metaDescription),
        }));

        const blogItems = blogs.map((blog: Blog): SearchItem => ({
          title: blog.title,
          href: `/blog-${blog.slug}`,
          type: 'Blog',
          description: blog.excerpt,
          keywords: makeSearchText(blog.title, blog.excerpt, blog.category, blog.tags, blog.seoTitle, blog.seoDescription),
        }));

        const serviceItems = serviceLinks.map((service): SearchItem => ({
          title: service.title,
          href: getServicePath(service.slug),
          type: 'Service',
          description: service.excerpt,
          keywords: makeSearchText(service.title, service.excerpt, service.points),
        }));

        const aboutItems = aboutLinks.map((page): SearchItem => ({
          title: page.title,
          href: getAboutPath(page.slug),
          type: 'About',
          description: page.description,
          keywords: makeSearchText(
            page.title,
            page.eyebrow,
            page.description,
            page.hero,
            page.highlights,
            page.sections.flatMap((section) => [section.heading, section.body, ...(section.points || [])])
          ),
        }));

        setSearchItems([
          ...productItems,
          ...categoryItems,
          ...blogItems,
          ...serviceItems,
          ...aboutItems,
          ...coreSearchPages,
        ]);
      })
      .catch(() => {
        if (isMounted) {
          setSearchItems([
            ...serviceLinks.map((service): SearchItem => ({
              title: service.title,
              href: getServicePath(service.slug),
              type: 'Service',
              description: service.excerpt,
              keywords: makeSearchText(service.title, service.excerpt, service.points),
            })),
            ...aboutLinks.map((page): SearchItem => ({
              title: page.title,
              href: getAboutPath(page.slug),
              type: 'About',
              description: page.description,
              keywords: makeSearchText(page.title, page.eyebrow, page.description, page.hero, page.highlights),
            })),
            ...coreSearchPages,
          ]);
        }
      })
      .finally(() => {
        if (isMounted) setIsSearchLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isSearchOpen, searchItems.length]);

  return (<>      {isSearchOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[55] cursor-default bg-transparent"
          onClick={closeSearch}
          aria-label="Close search"
        />
      ) : null}

      <div
        className={`fixed right-3 z-[60] w-[calc(100vw-24px)] max-w-md overflow-hidden rounded-sm border border-[#E8E8E8] bg-white shadow-2xl shadow-slate-900/15 transition-all duration-300 sm:right-6 lg:right-12 ${
          isScrolled ? 'top-[76px]' : 'top-[84px] lg:top-[116px]'
        } ${isSearchOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}
      >
        <div className="border-b border-[#E8E8E8] p-3">
          <label className="sr-only" htmlFor="site-search-input">Search website</label>
          <div className="flex items-center gap-2 border border-[#E8E8E8] bg-[#F0F8FF] px-3 py-2.5 transition focus-within:border-[#DF1F26] focus-within:bg-white">
            <Search size={18} className="shrink-0 text-slate-500" />
            <input
              id="site-search-input"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              autoFocus={isSearchOpen}
              placeholder="Search products, blogs, services..."
              className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={closeSearch}
              className="shrink-0 rounded-sm p-1 text-slate-400 transition-colors hover:bg-white hover:text-slate-900"
              aria-label="Close search"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="max-h-[360px] overflow-y-auto p-2">
          {isSearchLoading ? (
            <p className="px-3 py-7 text-center text-sm font-bold text-slate-500">Loading search...</p>
          ) : searchResults.length ? (
            <div className="space-y-1">
              {searchResults.map((item) => (
                <Link
                  key={`${item.type}-${item.href}-${item.title}`}
                  href={item.href}
                  onClick={closeSearch}
                  className="group block rounded-sm border border-transparent px-3 py-2.5 transition hover:border-[#E8E8E8] hover:bg-[#F0F8FF]"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-bold text-slate-950 group-hover:text-slate-700">
                      {item.title}
                    </span>
                    <span className="shrink-0 rounded-sm bg-[#F0F8FF] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#DF1F26]">
                      {item.type}
                    </span>
                  </span>
                  {item.description ? (
                    <span className="mt-1 line-clamp-1 block text-xs leading-5 text-slate-500">
                      {item.description}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-3 py-8 text-center">
              <p className="text-sm font-bold text-slate-900">No results found</p>
              <p className="mt-1 text-xs text-slate-500">Try a product, category, service, or blog topic.</p>
            </div>
          )}
        </div>
      </div>

</>)
}
