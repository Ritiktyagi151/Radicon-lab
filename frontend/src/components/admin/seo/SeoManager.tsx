'use client'

import {
  BarChart3,
  Code2,
  FileCode2,
  Globe2,
  Link2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Share2,
  Trash2,
} from 'lucide-react'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useToast } from '@/components/admin/providers/ToastProvider'
import { apiRequest } from '@/lib/admin/api'
import { useRealtimeUpdates } from '@/lib/admin/realtime'

type SeoPage = {
  id: string
  pageName: string
  pageType: string
  url: string
  customSlug: string
  canonicalUrl: string
  canonicalMode: 'self' | 'custom'
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  openGraph: { title?: string; description?: string; image?: string }
  twitter: { title?: string; description?: string; image?: string }
  robotsIndex: 'index' | 'noindex'
  robotsFollow: 'follow' | 'nofollow'
  includeInSitemap: boolean
  schemaType: string
  schemaJson: string
}

type Redirect = {
  id: string
  oldUrl: string
  newUrl: string
  type: 301 | 302
}

type SeoAnalysis = {
  pageId: string
  score: number
  status: 'green' | 'yellow' | 'red'
  canonicalStatus: 'set' | 'not set'
  canonicalIssue: boolean
}

type SeoSettings = {
  pages: SeoPage[]
  redirects: Redirect[]
  robotsTxt: string
  global: {
    metaTitleFormat: string
    defaultMetaDescription: string
    canonicalBehavior: 'self' | 'manual'
    googleAnalyticsId: string
    googleSearchConsoleCode: string
    faviconUrl: string
    siteUrl: string
  }
  sitemapXml: string
  sitemapGeneratedAt?: string
  analysis: SeoAnalysis[]
}

type BlogSearchItem = {
  _id?: string
  title: string
  slug: string
  excerpt: string
  seoTitle?: string
  seoDescription?: string
}

type ProductSearchItem = {
  _id?: string
  name: string
  slug: string
  description: string
}

type SeoSearchResult =
  | { kind: 'page'; label: string; path: string; metaTitle: string; page: SeoPage }
  | { kind: 'blog'; label: string; path: string; metaTitle: string; blog: BlogSearchItem }
  | { kind: 'product'; label: string; path: string; metaTitle: string; product: ProductSearchItem }

const emptyPage: SeoPage = {
  id: '',
  pageName: '',
  pageType: 'WebPage',
  url: '/',
  customSlug: '',
  canonicalUrl: '',
  canonicalMode: 'self',
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  openGraph: {},
  twitter: {},
  robotsIndex: 'index',
  robotsFollow: 'follow',
  includeInSitemap: true,
  schemaType: 'WebPage',
  schemaJson: '{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Page"\n}',
}

const navItems = [
  { id: 'urls', label: 'URLs', icon: Link2 },
  { id: 'onpage', label: 'On-Page SEO', icon: Globe2 },
  { id: 'sitemap', label: 'Sitemap', icon: Share2 },
  { id: 'robots', label: 'Robots.txt', icon: FileCode2 },
  { id: 'schema', label: 'Schema', icon: Code2 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
] as const

const schemaTemplates: Record<string, string> = {
  Article: '{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Article title",\n  "author": "Radicon Lab"\n}',
  Product: '{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "Product name",\n  "brand": "Radicon Lab"\n}',
  FAQ: '{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": []\n}',
  Breadcrumb: '{\n  "@context": "https://schema.org",\n  "@type": "BreadcrumbList",\n  "itemListElement": []\n}',
  WebPage: '{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Page"\n}',
}

export default function SeoManager() {
  const { showToast } = useToast()
  const [activeSection, setActiveSection] = useState<(typeof navItems)[number]['id']>('urls')
  const [settings, setSettings] = useState<SeoSettings | null>(null)
  const [selectedPage, setSelectedPage] = useState<SeoPage>(emptyPage)
  const [search, setSearch] = useState('')
  const [globalSeoSearch, setGlobalSeoSearch] = useState('')
  const [blogs, setBlogs] = useState<BlogSearchItem[]>([])
  const [products, setProducts] = useState<ProductSearchItem[]>([])
  const [filter, setFilter] = useState('all')
  const [robotsPreview, setRobotsPreview] = useState(false)

  const loadSeo = async () => {
    try {
      const [data, blogResponse, productResponse] = await Promise.all([
        apiRequest<SeoSettings>('/seo'),
        apiRequest<{ data: BlogSearchItem[] }>('/blogs?limit=100', { auth: false }).catch(() => ({ data: [] })),
        apiRequest<ProductSearchItem[]>('/products', { auth: false }).catch(() => []),
      ])
      setSettings(data)
      setSelectedPage(data.pages[0] || emptyPage)
      setBlogs(blogResponse.data)
      setProducts(productResponse)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to load SEO settings', 'error')
    }
  }

  useEffect(() => {
    void loadSeo()
  }, [])

  useRealtimeUpdates({
    resources: ['seo'],
    onEvent: (event) => {
      if (event.resource !== 'seo' || event.action === 'heartbeat') return
      showToast(event.message)
      void loadSeo()
    },
    onError: () => showToast('Realtime SEO sync disconnected. Retrying automatically.', 'error'),
  })

  const analysisByPage = useMemo(() => {
    const map = new Map<string, SeoAnalysis>()
    settings?.analysis?.forEach((item) => map.set(item.pageId, item))
    return map
  }, [settings])

  const filteredPages = useMemo(() => {
    const query = search.toLowerCase()
    return (settings?.pages || []).filter((page) => {
      const analysis = analysisByPage.get(page.id)
      const matchesSearch = `${page.pageName} ${page.url} ${page.customSlug} ${page.metaTitle}`.toLowerCase().includes(query)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'canonical' && analysis?.canonicalStatus === 'set') ||
        (filter === 'missing-canonical' && analysis?.canonicalStatus !== 'set') ||
        page.pageType === filter
      return matchesSearch && matchesFilter
    })
  }, [analysisByPage, filter, search, settings?.pages])

  const instantSearchResults = useMemo(() => {
    const query = globalSeoSearch.trim().toLowerCase()
    if (!query) return []

    const pageResults: SeoSearchResult[] = (settings?.pages || [])
      .filter((page) => searchableText([page.pageName, page.url, page.customSlug, page.metaTitle, page.pageType]).includes(query))
      .map((page) => ({
        kind: 'page',
        label: page.pageName,
        path: page.customSlug || page.url,
        metaTitle: page.metaTitle || page.pageType,
        page,
      }))

    const blogResults: SeoSearchResult[] = blogs
      .filter((blog) => searchableText([blog.title, blog.slug, blog.seoTitle, blog.excerpt]).includes(query))
      .map((blog) => ({
        kind: 'blog',
        label: blog.title,
        path: `/blogs/${blog.slug}`,
        metaTitle: blog.seoTitle || 'Blog post',
        blog,
      }))

    const productResults: SeoSearchResult[] = products
      .filter((product) => searchableText([product.name, product.slug, product.description]).includes(query))
      .map((product) => ({
        kind: 'product',
        label: product.name,
        path: `/services/${product.slug}`,
        metaTitle: 'Product / Service',
        product,
      }))

    return [...pageResults, ...blogResults, ...productResults].slice(0, 10)
  }, [blogs, globalSeoSearch, products, settings?.pages])

  const openSearchResult = (result: SeoSearchResult) => {
    if (result.kind === 'page') {
      setSelectedPage(result.page)
      setSearch(`${result.page.pageName} ${result.page.customSlug || result.page.url}`)
    }

    if (result.kind === 'blog') {
      setSelectedPage(createSeoPageFromBlog(result.blog))
      setSearch(`${result.blog.title} ${result.blog.slug}`)
    }

    if (result.kind === 'product') {
      setSelectedPage(createSeoPageFromProduct(result.product))
      setSearch(`${result.product.name} ${result.product.slug}`)
    }

    setGlobalSeoSearch('')
    setActiveSection('onpage')
  }

  const savePage = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    try {
      await apiRequest('/seo/pages', { method: 'POST', body: JSON.stringify(selectedPage) })
      showToast('SEO page saved successfully')
      await loadSeo()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to save SEO page', 'error')
    }
  }

  const deletePage = async (page: SeoPage) => {
    if (!window.confirm(`Delete SEO record for ${page.pageName}?`)) return
    try {
      await apiRequest(`/seo/pages/${page.id}`, { method: 'DELETE' })
      showToast('SEO URL deleted successfully')
      await loadSeo()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to delete URL', 'error')
    }
  }

  const saveRedirects = async () => {
    if (!settings) return
    try {
      await apiRequest('/seo/redirects', {
        method: 'PUT',
        body: JSON.stringify({ redirects: settings.redirects }),
      })
      showToast('Redirect rules saved successfully')
      await loadSeo()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to save redirects', 'error')
    }
  }

  const saveRobots = async () => {
    if (!settings) return
    try {
      await apiRequest('/seo/robots', {
        method: 'PUT',
        body: JSON.stringify({ robotsTxt: settings.robotsTxt }),
      })
      showToast('Robots.txt saved successfully')
      await loadSeo()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to save robots.txt', 'error')
    }
  }

  const saveGlobal = async () => {
    if (!settings) return
    try {
      await apiRequest('/seo/global', {
        method: 'PUT',
        body: JSON.stringify(settings.global),
      })
      showToast('Global SEO settings saved successfully')
      await loadSeo()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to save global settings', 'error')
    }
  }

  const regenerateSitemap = async () => {
    try {
      await apiRequest('/seo/sitemap/regenerate', { method: 'POST' })
      showToast('Sitemap regenerated successfully')
      await loadSeo()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to regenerate sitemap', 'error')
    }
  }

  if (!settings) {
    return (
      <div className="rounded-[32px] border border-slate-800 bg-slate-950 p-8 text-white">
        Loading SEO manager...
      </div>
    )
  }

  const selectedAnalysis = analysisByPage.get(selectedPage.id)

  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950 text-white shadow-2xl shadow-slate-400/30">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(225,29,72,0.34),transparent_30%),#020617] p-6">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-300">SEO Control Center</p>
        <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Search Visibility Manager
            </h1>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-400">
              Manage URLs, metadata, canonicals, schema, redirects, robots.txt, sitemap rules, and analytics codes from one protected workspace.
            </p>
          </div>
          <div className="w-full max-w-xl">
            <div className="relative">
              <label className="flex h-13 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-4 text-sm text-slate-300 shadow-[inset_0_0_24px_rgba(255,255,255,0.04)]">
                <Search size={17} className="text-brand-200" />
                <input
                  value={globalSeoSearch}
                  onChange={(event) => setGlobalSeoSearch(event.target.value)}
                  placeholder="Search pages, posts, products, URLs, slugs, or SEO titles..."
                  className="h-full w-full bg-transparent font-bold text-white outline-none placeholder:text-slate-500"
                />
              </label>
              {instantSearchResults.length ? (
                <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/30">
                  {instantSearchResults.map((result) => {
                    const analysis = result.kind === 'page' ? analysisByPage.get(result.page.id) : undefined

                    return (
                      <button
                        key={`${result.kind}-${result.path}`}
                        onClick={() => openSearchResult(result)}
                        className="flex w-full items-center justify-between gap-4 border-b border-white/5 px-4 py-3 text-left transition hover:bg-brand-500/10 last:border-b-0"
                      >
                        <span>
                          <span className="block text-sm font-black text-white">{result.label}</span>
                          <span className="mt-1 block text-xs font-bold text-slate-500">
                            {result.kind.toUpperCase()} - {result.path} - {result.metaTitle}
                          </span>
                        </span>
                        {result.kind === 'page' ? (
                          <Indicator status={analysis?.status || 'red'} label={`${analysis?.score || 0}/100`} />
                        ) : (
                          <Indicator status="yellow" label="Create SEO" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : globalSeoSearch ? (
                <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-400 shadow-2xl shadow-black/30">
                  No SEO pages matched that search.
                </div>
              ) : null}
            </div>
            <button
              onClick={() => {
                setSelectedPage({ ...emptyPage, id: crypto.randomUUID() })
                setActiveSection('onpage')
              }}
              className="mt-3 w-fit rounded-2xl border border-brand-400/40 bg-brand-500 px-5 py-3 text-sm font-black text-white shadow-[0_0_28px_rgba(244,63,94,0.35)] transition hover:-translate-y-0.5"
            >
              <span className="inline-flex items-center gap-2">
                <Plus size={17} />
                Add URL
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-white/10 bg-white/[0.03] p-4 lg:border-b-0 lg:border-r">
          <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex min-w-fit items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-black transition lg:w-full ${
                  activeSection === id
                    ? 'border-brand-400/40 bg-brand-500/15 text-brand-200 shadow-[inset_0_0_18px_rgba(244,63,94,0.15)]'
                    : 'border-white/5 bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 p-4 sm:p-6">
          {activeSection === 'urls' ? (
            <UrlManager
              pages={filteredPages}
              analysisByPage={analysisByPage}
              search={search}
              filter={filter}
              onSearch={setSearch}
              onFilter={setFilter}
              onEdit={(page) => {
                setSelectedPage(page)
                setActiveSection('onpage')
              }}
              onDelete={deletePage}
            />
          ) : null}

          {activeSection === 'onpage' ? (
            <PageEditor page={selectedPage} analysis={selectedAnalysis} onChange={setSelectedPage} onSave={savePage} />
          ) : null}

          {activeSection === 'schema' ? (
            <SchemaEditor page={selectedPage} onChange={setSelectedPage} onSave={() => savePage()} />
          ) : null}

          {activeSection === 'sitemap' ? (
            <SitemapManager
              settings={settings}
              onChange={setSettings}
              onSavePage={savePage}
              onRegenerate={regenerateSitemap}
            />
          ) : null}

          {activeSection === 'robots' ? (
            <RobotsEditor
              robotsTxt={settings.robotsTxt}
              preview={robotsPreview}
              onPreview={setRobotsPreview}
              onChange={(robotsTxt) => setSettings({ ...settings, robotsTxt })}
              onSave={saveRobots}
            />
          ) : null}

          {activeSection === 'settings' ? (
            <GlobalSettings settings={settings} onChange={setSettings} onSave={saveGlobal} />
          ) : null}

          {activeSection === 'analytics' ? (
            <AnalyticsView pages={settings.pages} analysisByPage={analysisByPage} redirects={settings.redirects} onChange={setSettings} settings={settings} onSaveRedirects={saveRedirects} />
          ) : null}
        </div>
      </div>
    </section>
  )
}

function UrlManager({
  pages,
  analysisByPage,
  search,
  filter,
  onSearch,
  onFilter,
  onEdit,
  onDelete,
}: {
  pages: SeoPage[]
  analysisByPage: Map<string, SeoAnalysis>
  search: string
  filter: string
  onSearch: (value: string) => void
  onFilter: (value: string) => void
  onEdit: (page: SeoPage) => void
  onDelete: (page: SeoPage) => void
}) {
  return (
    <div>
      <SectionTitle title="URL Manager" description="Search pages, set custom slugs, monitor canonical state, and open the full SEO editor." />
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-400">
          <Search size={16} className="text-brand-300" />
          <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search URLs..." className="w-full bg-transparent font-semibold outline-none" />
        </label>
        <select value={filter} onChange={(event) => onFilter(event.target.value)} className="h-12 rounded-2xl border border-white/10 bg-slate-900 px-4 text-sm font-bold text-white outline-none">
          <option value="all">All URLs</option>
          <option value="canonical">Canonical Set</option>
          <option value="missing-canonical">Canonical Missing</option>
          <option value="Article">Article</option>
          <option value="Product">Product</option>
          <option value="WebPage">WebPage</option>
        </select>
      </div>
      <DarkTable>
        <thead>
          <tr><Th>Page</Th><Th>URL</Th><Th>Custom Slug</Th><Th>Canonical</Th><Th>Score</Th><Th>Actions</Th></tr>
        </thead>
        <tbody>
          {pages.map((page) => {
            const analysis = analysisByPage.get(page.id)
            return (
              <tr key={page.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                <Td><p className="font-black text-white">{page.pageName}</p><p className="text-xs font-bold text-slate-500">{page.pageType}</p></Td>
                <Td>{page.url}</Td>
                <Td>{page.customSlug || 'Default'}</Td>
                <Td><Indicator status={analysis?.canonicalStatus === 'set' ? 'green' : 'red'} label={analysis?.canonicalStatus || 'not set'} /></Td>
                <Td><Indicator status={analysis?.status || 'red'} label={`${analysis?.score || 0}/100`} /></Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(page)} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-brand-200 hover:bg-brand-500/10">Edit</button>
                    <button onClick={() => onDelete(page)} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-brand-200 hover:bg-brand-500/10"><Trash2 size={14} /></button>
                  </div>
                </Td>
              </tr>
            )
          })}
        </tbody>
      </DarkTable>
    </div>
  )
}

function PageEditor({ page, analysis, onChange, onSave }: { page: SeoPage; analysis?: SeoAnalysis; onChange: (page: SeoPage) => void; onSave: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={onSave}>
      <SectionTitle title="On-Page SEO" description="Control metadata, canonicals, robots directives, and social sharing fields for one URL." />
      <div className="mb-5 flex flex-wrap gap-3">
        <Indicator status={analysis?.status || 'red'} label={`SEO Score ${analysis?.score || 0}/100`} />
        <Indicator status={analysis?.canonicalStatus === 'set' ? 'green' : 'red'} label={`Canonical ${analysis?.canonicalStatus || 'not set'}`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Input label="Page Name" value={page.pageName} onChange={(value) => onChange({ ...page, pageName: value })} />
        <Input label="Page URL" value={page.url} onChange={(value) => onChange({ ...page, url: value })} />
        <Input label="Custom Slug" value={page.customSlug} onChange={(value) => onChange({ ...page, customSlug: value })} />
        <Input label="Focus Keyword" value={page.focusKeyword} onChange={(value) => onChange({ ...page, focusKeyword: value })} />
        <CountedInput label="Meta Title" max={60} value={page.metaTitle} onChange={(value) => onChange({ ...page, metaTitle: value })} />
        <CountedTextarea label="Meta Description" max={160} value={page.metaDescription} onChange={(value) => onChange({ ...page, metaDescription: value })} />
        <label className="block">
          <span className="text-sm font-black text-slate-300">Canonical Behavior</span>
          <select value={page.canonicalMode} onChange={(event) => onChange({ ...page, canonicalMode: event.target.value as SeoPage['canonicalMode'] })} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 text-sm font-bold text-white outline-none">
            <option value="self">Self-reference</option>
            <option value="custom">Point to another URL</option>
          </select>
        </label>
        <Input label="Canonical URL" value={page.canonicalUrl} onChange={(value) => onChange({ ...page, canonicalUrl: value })} placeholder="Used when canonical mode is custom" />
        <Input label="Open Graph Title" value={page.openGraph?.title || ''} onChange={(value) => onChange({ ...page, openGraph: { ...page.openGraph, title: value } })} />
        <Input label="Open Graph Image" value={page.openGraph?.image || ''} onChange={(value) => onChange({ ...page, openGraph: { ...page.openGraph, image: value } })} />
        <Textarea label="Open Graph Description" value={page.openGraph?.description || ''} onChange={(value) => onChange({ ...page, openGraph: { ...page.openGraph, description: value } })} />
        <Input label="Twitter Title" value={page.twitter?.title || ''} onChange={(value) => onChange({ ...page, twitter: { ...page.twitter, title: value } })} />
        <Input label="Twitter Image" value={page.twitter?.image || ''} onChange={(value) => onChange({ ...page, twitter: { ...page.twitter, image: value } })} />
        <Textarea label="Twitter Description" value={page.twitter?.description || ''} onChange={(value) => onChange({ ...page, twitter: { ...page.twitter, description: value } })} />
        <label className="block">
          <span className="text-sm font-black text-slate-300">Robots Index</span>
          <select value={page.robotsIndex} onChange={(event) => onChange({ ...page, robotsIndex: event.target.value as SeoPage['robotsIndex'] })} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 text-sm font-bold text-white outline-none">
            <option value="index">index</option>
            <option value="noindex">noindex</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-black text-slate-300">Robots Follow</span>
          <select value={page.robotsFollow} onChange={(event) => onChange({ ...page, robotsFollow: event.target.value as SeoPage['robotsFollow'] })} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 text-sm font-bold text-white outline-none">
            <option value="follow">follow</option>
            <option value="nofollow">nofollow</option>
          </select>
        </label>
      </div>
      <SaveButton />
    </form>
  )
}

function SchemaEditor({ page, onChange, onSave }: { page: SeoPage; onChange: (page: SeoPage) => void; onSave: () => void }) {
  return (
    <div>
      <SectionTitle title="Schema / Structured Data" description="Add JSON-LD markup and use suggested templates based on the page type." />
      <div className="mb-4 grid gap-3 md:grid-cols-[280px_1fr]">
        <select value={page.schemaType} onChange={(event) => onChange({ ...page, schemaType: event.target.value, schemaJson: schemaTemplates[event.target.value] || page.schemaJson })} className="h-12 rounded-2xl border border-white/10 bg-slate-900 px-4 text-sm font-bold text-white outline-none">
          {Object.keys(schemaTemplates).map((type) => <option key={type} value={type}>{type} Template</option>)}
        </select>
        <p className="rounded-2xl border border-brand-400/20 bg-brand-500/10 px-4 py-3 text-sm font-bold text-brand-200">Suggested: {page.pageType === 'Product' ? 'Product' : page.pageType === 'Article' ? 'Article' : page.schemaType}</p>
      </div>
      <textarea value={page.schemaJson} onChange={(event) => onChange({ ...page, schemaJson: event.target.value })} rows={16} className="w-full rounded-3xl border border-white/10 bg-[#111111]/30 p-4 font-mono text-sm leading-6 text-slate-200 outline-none focus:border-brand-400" />
      <button onClick={onSave} className="mt-5 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-black text-white">Save Schema</button>
    </div>
  )
}

function SitemapManager({ settings, onChange, onSavePage, onRegenerate }: { settings: SeoSettings; onChange: (settings: SeoSettings) => void; onSavePage: () => void; onRegenerate: () => void }) {
  return (
    <div>
      <SectionTitle title="Sitemap Manager" description="Include/exclude pages and regenerate XML. Only self-canonical pages are included." />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button onClick={onRegenerate} className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-black text-white"><span className="inline-flex items-center gap-2"><RefreshCw size={16} />Regenerate Sitemap</span></button>
        <p className="text-sm font-bold text-slate-400">Last generated: {settings.sitemapGeneratedAt ? new Date(settings.sitemapGeneratedAt).toLocaleString() : 'Never'}</p>
      </div>
      <div className="grid gap-3">
        {settings.pages.map((page) => (
          <label key={page.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <span><span className="block font-black text-white">{page.pageName}</span><span className="text-sm font-bold text-slate-500">{page.url}</span></span>
            <input type="checkbox" checked={page.includeInSitemap} onChange={(event) => {
              const pages = settings.pages.map((item) => item.id === page.id ? { ...item, includeInSitemap: event.target.checked } : item)
              onChange({ ...settings, pages })
            }} className="h-5 w-5" />
          </label>
        ))}
      </div>
      <button onClick={onSavePage} className="mt-5 rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-brand-200">Save Selected Page Rule</button>
      <pre className="mt-5 max-h-80 overflow-auto rounded-3xl border border-white/10 bg-[#111111]/30 p-4 text-xs leading-6 text-slate-300">{settings.sitemapXml || 'Sitemap has not been generated yet.'}</pre>
    </div>
  )
}

function RobotsEditor({ robotsTxt, preview, onPreview, onChange, onSave }: { robotsTxt: string; preview: boolean; onPreview: (value: boolean) => void; onChange: (value: string) => void; onSave: () => void }) {
  return (
    <div>
      <SectionTitle title="Robots.txt Editor" description="Edit, preview, and save crawler directives directly from the admin panel." />
      <div className="mb-4 flex gap-3">
        <button onClick={() => onPreview(false)} className={`rounded-2xl px-4 py-2 text-sm font-black ${!preview ? 'bg-brand-500 text-white' : 'border border-white/10 text-slate-300'}`}>Edit</button>
        <button onClick={() => onPreview(true)} className={`rounded-2xl px-4 py-2 text-sm font-black ${preview ? 'bg-brand-500 text-white' : 'border border-white/10 text-slate-300'}`}>Preview</button>
      </div>
      {preview ? <pre className="rounded-3xl border border-white/10 bg-[#111111]/30 p-5 text-sm leading-7 text-slate-200">{robotsTxt}</pre> : <textarea value={robotsTxt} onChange={(event) => onChange(event.target.value)} rows={14} className="w-full rounded-3xl border border-white/10 bg-[#111111]/30 p-5 font-mono text-sm leading-7 text-slate-200 outline-none focus:border-brand-400" />}
      <button onClick={onSave} className="mt-5 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-black text-white">Save Robots.txt</button>
    </div>
  )
}

function GlobalSettings({ settings, onChange, onSave }: { settings: SeoSettings; onChange: (settings: SeoSettings) => void; onSave: () => void }) {
  const global = settings.global
  return (
    <div>
      <SectionTitle title="Global SEO Settings" description="Configure default metadata patterns, analytics IDs, canonical behavior, verification, and favicon." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Input label="Default Meta Title Format" value={global.metaTitleFormat} onChange={(value) => onChange({ ...settings, global: { ...global, metaTitleFormat: value } })} />
        <Input label="Default Canonical Site URL" value={global.siteUrl} onChange={(value) => onChange({ ...settings, global: { ...global, siteUrl: value } })} />
        <Textarea label="Default Meta Description" value={global.defaultMetaDescription} onChange={(value) => onChange({ ...settings, global: { ...global, defaultMetaDescription: value } })} />
        <label className="block"><span className="text-sm font-black text-slate-300">Default Canonical Behavior</span><select value={global.canonicalBehavior} onChange={(event) => onChange({ ...settings, global: { ...global, canonicalBehavior: event.target.value as SeoSettings['global']['canonicalBehavior'] } })} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 text-sm font-bold text-white outline-none"><option value="self">Auto self-canonical</option><option value="manual">Manual</option></select></label>
        <Input label="Google Analytics ID" value={global.googleAnalyticsId} onChange={(value) => onChange({ ...settings, global: { ...global, googleAnalyticsId: value } })} />
        <Input label="Search Console Verification Code" value={global.googleSearchConsoleCode} onChange={(value) => onChange({ ...settings, global: { ...global, googleSearchConsoleCode: value } })} />
        <Input label="Favicon URL" value={global.faviconUrl} onChange={(value) => onChange({ ...settings, global: { ...global, faviconUrl: value } })} />
      </div>
      <button onClick={onSave} className="mt-5 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-black text-white"><span className="inline-flex items-center gap-2"><Save size={16} />Save Settings</span></button>
    </div>
  )
}

function AnalyticsView({ pages, analysisByPage, redirects, settings, onChange, onSaveRedirects }: { pages: SeoPage[]; analysisByPage: Map<string, SeoAnalysis>; redirects: Redirect[]; settings: SeoSettings; onChange: (settings: SeoSettings) => void; onSaveRedirects: () => void }) {
  return (
    <div>
      <SectionTitle title="SEO Analysis & Redirect Manager" description="Review scoring indicators and manage 301/302 redirects." />
      <div className="grid gap-4 md:grid-cols-3">
        {pages.map((page) => {
          const analysis = analysisByPage.get(page.id)
          return <div key={page.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"><Indicator status={analysis?.status || 'red'} label={`${analysis?.score || 0}/100`} /><h3 className="mt-4 font-black text-white">{page.pageName}</h3><p className="mt-2 text-sm font-bold text-slate-500">{analysis?.canonicalIssue ? 'Canonical needs attention' : 'Canonical OK'}</p></div>
        })}
      </div>
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between gap-4"><h3 className="text-xl font-black text-white">Redirect Manager</h3><button onClick={() => onChange({ ...settings, redirects: [...redirects, { id: crypto.randomUUID(), oldUrl: '', newUrl: '', type: 301 }] })} className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-black text-brand-200"><Plus size={16} /></button></div>
        <div className="mt-5 space-y-3">
          {redirects.map((redirect, index) => <div key={redirect.id} className="grid gap-3 md:grid-cols-[1fr_1fr_120px_auto]"><Input label="Old URL" value={redirect.oldUrl} onChange={(value) => { const next = [...redirects]; next[index] = { ...redirect, oldUrl: value }; onChange({ ...settings, redirects: next }) }} /><Input label="New URL" value={redirect.newUrl} onChange={(value) => { const next = [...redirects]; next[index] = { ...redirect, newUrl: value }; onChange({ ...settings, redirects: next }) }} /><label><span className="text-sm font-black text-slate-300">Type</span><select value={redirect.type} onChange={(event) => { const next = [...redirects]; next[index] = { ...redirect, type: Number(event.target.value) as Redirect['type'] }; onChange({ ...settings, redirects: next }) }} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 text-sm font-bold text-white"><option value={301}>301</option><option value={302}>302</option></select></label><button onClick={() => onChange({ ...settings, redirects: redirects.filter((_, redirectIndex) => redirectIndex !== index) })} className="self-end rounded-2xl border border-white/10 p-3 text-brand-200"><Trash2 size={17} /></button></div>)}
        </div>
        <button onClick={onSaveRedirects} className="mt-5 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-black text-white">Save Redirects</button>
      </div>
    </div>
  )
}

function searchableText(values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ').toLowerCase()
}

function createSeoPageFromBlog(blog: BlogSearchItem): SeoPage {
  return {
    ...emptyPage,
    id: crypto.randomUUID(),
    pageName: blog.title,
    pageType: 'Article',
    url: `/blogs/${blog.slug}`,
    customSlug: '',
    metaTitle: blog.seoTitle || blog.title,
    metaDescription: blog.seoDescription || blog.excerpt,
    focusKeyword: blog.title.toLowerCase(),
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
    },
    twitter: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
    },
    schemaType: 'Article',
    schemaJson: schemaTemplates.Article,
  }
}

function createSeoPageFromProduct(product: ProductSearchItem): SeoPage {
  return {
    ...emptyPage,
    id: crypto.randomUUID(),
    pageName: product.name,
    pageType: 'Product',
    url: `/services/${product.slug}`,
    customSlug: '',
    metaTitle: product.name,
    metaDescription: product.description,
    focusKeyword: product.name.toLowerCase(),
    openGraph: {
      title: product.name,
      description: product.description,
    },
    twitter: {
      title: product.name,
      description: product.description,
    },
    schemaType: 'Product',
    schemaJson: schemaTemplates.Product,
  }
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return <div className="mb-6"><h2 className="text-2xl font-black tracking-tight text-white">{title}</h2><p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-400">{description}</p></div>
}

function Indicator({ status, label }: { status: 'green' | 'yellow' | 'red'; label: string }) {
  const classes = { green: 'bg-brand-50 text-brand-600 ring-brand-200', yellow: 'bg-[#F0F8FF] text-brand-600 ring-brand-200', red: 'bg-brand-400/10 text-brand-300 ring-brand-400/20' }
  return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ring-1 ${classes[status]}`}><span className="h-2 w-2 rounded-full bg-current" />{label}</span>
}

function DarkTable({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"><div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left">{children}</table></div></div>
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-500">{children}</th>
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 text-sm font-bold text-slate-300">{children}</td>
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="block"><span className="text-sm font-black text-slate-300">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-600 focus:border-brand-400" /></label>
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="text-sm font-black text-slate-300">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-bold text-white outline-none focus:border-brand-400" /></label>
}

function CountedInput({ label, value, onChange, max }: { label: string; value: string; onChange: (value: string) => void; max: number }) {
  return <label className="block"><span className="flex justify-between text-sm font-black text-slate-300">{label}<span className={value.length > max ? 'text-brand-300' : 'text-slate-500'}>{value.length}/{max}</span></span><input maxLength={max + 20} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 text-sm font-bold text-white outline-none focus:border-brand-400" /></label>
}

function CountedTextarea({ label, value, onChange, max }: { label: string; value: string; onChange: (value: string) => void; max: number }) {
  return <label className="block"><span className="flex justify-between text-sm font-black text-slate-300">{label}<span className={value.length > max ? 'text-brand-300' : 'text-slate-500'}>{value.length}/{max}</span></span><textarea maxLength={max + 40} value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-bold text-white outline-none focus:border-brand-400" /></label>
}

function SaveButton() {
  return <button className="mt-6 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-black text-white shadow-[0_0_28px_rgba(244,63,94,0.28)]"><span className="inline-flex items-center gap-2"><Save size={16} />Save Page SEO</span></button>
}
