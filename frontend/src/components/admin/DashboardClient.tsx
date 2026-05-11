'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  FileText,
  Layers3,
  Mail,
  RefreshCw,
  SearchCheck,
  Tags,
} from 'lucide-react'
import { AdminButton, AdminPageHeader, GlassCard, StatusTag } from '@/components/admin/AdminPrimitives'
import { useToast } from '@/components/admin/providers/ToastProvider'
import { apiRequest } from '@/lib/admin/api'
import { useRealtimeUpdates } from '@/lib/admin/realtime'
import type { Blog, BlogListResponse } from '@/types/blog'
import type { Category, Product } from '@/types/product'

type Contact = {
  _id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  createdAt?: string
}

type SeoSettings = {
  pages?: unknown[]
  redirects?: unknown[]
  analysis?: { score?: number }[]
}

type DashboardData = {
  products: Product[]
  categories: Category[]
  blogs: Blog[]
  blogTotal: number
  contacts: Contact[]
  seo: SeoSettings | null
}

const emptyData: DashboardData = {
  products: [],
  categories: [],
  blogs: [],
  blogTotal: 0,
  contacts: [],
  seo: null,
}

function formatDate(value?: string) {
  if (!value) return 'Just now'

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function DashboardClient() {
  const { showToast } = useToast()
  const [data, setData] = useState<DashboardData>(emptyData)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [activity, setActivity] = useState<string[]>([])

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)

    try {
      const [products, categories, blogsResponse, contacts, seo] = await Promise.all([
        apiRequest<Product[]>('/products', { auth: false }).catch(() => []),
        apiRequest<Category[]>('/categories', { auth: false }).catch(() => []),
        apiRequest<BlogListResponse>('/blogs?limit=100', { auth: false }).catch(() => ({
          data: [],
          total: 0,
          page: 1,
          limit: 100,
          totalPages: 1,
        })),
        apiRequest<Contact[]>('/contacts').catch(() => []),
        apiRequest<SeoSettings>('/seo').catch(() => null),
      ])

      setData({
        products,
        categories,
        blogs: blogsResponse.data,
        blogTotal: blogsResponse.total,
        contacts,
        seo,
      })
      setLastUpdated(new Date().toISOString())
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to load dashboard data', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadDashboard])

  const realtimeStatus = useRealtimeUpdates({
    resources: ['products', 'categories', 'blogs', 'contacts', 'seo'],
    onEvent: (event) => {
      if (event.action === 'heartbeat') return
      setActivity((current) => [event.message, ...current].slice(0, 6))
      void loadDashboard()
    },
    onError: () => showToast('Realtime dashboard sync disconnected. Data can still be refreshed manually.', 'error'),
  })

  const metrics = useMemo(() => {
    const activeProducts = data.products.filter((product) => product.status === 'active').length
    const draftProducts = data.products.filter((product) => product.status === 'draft').length
    const publishedBlogs = data.blogs.filter((blog) => blog.status === 'published').length
    const draftBlogs = data.blogs.filter((blog) => blog.status === 'draft').length
    const seoScores = data.seo?.analysis?.map((item) => item.score || 0).filter((score) => score > 0) || []
    const seoScore = seoScores.length
      ? Math.round(seoScores.reduce((total, score) => total + score, 0) / seoScores.length)
      : 0

    return {
      activeProducts,
      draftProducts,
      publishedBlogs,
      draftBlogs,
      seoScore,
    }
  }, [data])

  const stats = [
    {
      label: 'Products',
      value: data.products.length,
      detail: `${metrics.activeProducts} active, ${metrics.draftProducts} draft`,
      icon: Layers3,
      tone: 'green' as const,
    },
    {
      label: 'Categories',
      value: data.categories.length,
      detail: `${data.categories.filter((category) => category.status === 'active').length} active categories`,
      icon: Tags,
      tone: 'indigo' as const,
    },
    {
      label: 'Blog Posts',
      value: data.blogTotal,
      detail: `${metrics.publishedBlogs} published, ${metrics.draftBlogs} draft`,
      icon: FileText,
      tone: 'amber' as const,
    },
    {
      label: 'Messages',
      value: data.contacts.length,
      detail: data.contacts[0] ? `Latest: ${data.contacts[0].name}` : 'No inquiries yet',
      icon: Mail,
      tone: 'rose' as const,
    },
  ]

  const pipeline = [
    { label: 'Product Drafts', value: metrics.draftProducts, total: Math.max(data.products.length, 1) },
    { label: 'Blog Drafts', value: metrics.draftBlogs, total: Math.max(data.blogTotal, 1) },
    { label: 'SEO Pages', value: data.seo?.pages?.length || 0, total: Math.max(data.seo?.pages?.length || 1, 1) },
  ]

  const latestActivity = [
    ...activity,
    ...data.contacts.slice(0, 3).map((contact) => `New inquiry from ${contact.name}: ${contact.subject || contact.message.slice(0, 42)}`),
    ...data.products.slice(0, 2).map((product) => `Product listed: ${product.name}`),
    ...data.blogs.slice(0, 2).map((blog) => `Blog ${blog.status}: ${blog.title}`),
  ].slice(0, 6)

  return (
    <section>
      <AdminPageHeader
        eyebrow="Command Center"
        title="Dashboard"
        description="Live data from products, categories, blogs, contacts, and SEO settings."
        action={
          <AdminButton onClick={() => void loadDashboard()} disabled={isLoading}>
            <span className="inline-flex items-center gap-2">
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh Data
            </span>
          </AdminButton>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        <StatusTag tone={realtimeStatus === 'connected' ? 'green' : realtimeStatus === 'connecting' ? 'amber' : 'rose'}>
          Realtime {realtimeStatus}
        </StatusTag>
        <span>{lastUpdated ? `Last updated ${formatDate(lastUpdated)}` : 'Loading dashboard data...'}</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, detail, icon: Icon, tone }) => (
          <GlassCard key={label} className="p-5">
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-300">
                <Icon size={20} />
              </span>
              <StatusTag tone={tone}>Real Data</StatusTag>
            </div>
            <p className="mt-7 text-sm font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              {isLoading ? '...' : value}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{detail}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-600">Performance</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Publishing Pipeline</h2>
            </div>
            <ArrowUpRight className="text-brand-600" />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pipeline.map((stage) => {
              const width = Math.min(100, Math.round((stage.value / stage.total) * 100))

              return (
                <div key={stage.label} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
                  <p className="text-sm font-black text-slate-500">{stage.label}</p>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-brand-600 shadow-[0_0_18px_rgba(79,70,229,0.35)]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <p className="mt-4 text-2xl font-black text-slate-950">{isLoading ? '...' : stage.value}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-5 rounded-3xl border border-slate-100 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">SEO Score</p>
                <p className="mt-2 text-3xl font-black text-slate-950">
                  {metrics.seoScore ? `${metrics.seoScore}/100` : 'Not analyzed'}
                </p>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <SearchCheck size={21} />
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Activity size={20} />
            </span>
            <h2 className="text-2xl font-black text-slate-950">Live Activity</h2>
          </div>
          <div className="mt-6 space-y-4">
            {latestActivity.length ? (
              latestActivity.map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold text-slate-600">
                  {item}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold text-slate-500">
                No recent activity yet.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
