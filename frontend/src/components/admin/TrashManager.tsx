'use client'

import { RefreshCw, RotateCcw, Search, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { AdminPageHeader, StatusTag } from '@/components/admin/AdminPrimitives'
import { useToast } from '@/components/admin/providers/ToastProvider'
import { apiRequest } from '@/lib/admin/api'
import { useRealtimeUpdates } from '@/lib/admin/realtime'

type Resource = 'products' | 'categories' | 'blogs' | 'contacts' | 'seo'
type TrashItem = {
  id: string
  resource: Resource
  title: string
  slug: string
  deletedAt: string
}
const labels: Record<Resource, string> = {
  products: 'Product', categories: 'Category', blogs: 'Blog', contacts: 'Inquiry', seo: 'SEO record',
}

export default function TrashManager() {
  const { showToast } = useToast()
  const [items, setItems] = useState<TrashItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [restoring, setRestoring] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [resource, setResource] = useState<Resource | 'all'>('all')

  const loadItems = useCallback(() => apiRequest<TrashItem[]>('/trash')
    .then((data) => {
      setItems(data)
      setError('')
    })
    .catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : 'Unable to load Trash')
    })
    .finally(() => setLoading(false)), [])

  useEffect(() => { void loadItems() }, [loadItems])
  useRealtimeUpdates({
    resources: ['products', 'categories', 'blogs', 'contacts', 'seo'],
    onEvent: (event) => {
      if (event.action === 'deleted' || event.action === 'updated') void loadItems()
    },
  })

  const restore = async (item: TrashItem) => {
    const key = `${item.resource}:${item.id}`
    setRestoring(key)
    try {
      await apiRequest(`/trash/${item.resource}/${encodeURIComponent(item.id)}/restore`, { method: 'POST' })
      setItems((current) => current.filter((entry) => `${entry.resource}:${entry.id}` !== key))
      showToast(`${labels[item.resource]} restored successfully`)
      await loadItems()
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : 'Unable to restore item', 'error')
    } finally {
      setRestoring(null)
    }
  }

  const query = search.trim().toLowerCase()
  const visibleItems = items.filter((item) =>
    (resource === 'all' || resource === item.resource) &&
    `${item.title} ${item.slug} ${labels[item.resource]}`.toLowerCase().includes(query),
  )

  return (
    <section>
      <AdminPageHeader eyebrow="Content recovery" title="Trash"
        description="Deleted products, categories, blogs, inquiries and SEO records stay here until you restore them. Restored items keep their original content and status."
        action={<button type="button" onClick={() => { setLoading(true); void loadItems() }} disabled={loading}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 disabled:opacity-50">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />Refresh
        </button>} />
      <div className="rounded-3xl border border-white/70 bg-white/80 shadow-xl shadow-slate-200/60">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input aria-label="Search Trash" value={search} onChange={(event) => setSearch(event.target.value)}
              placeholder="Search deleted items..." className="w-full bg-transparent text-sm outline-none" />
          </label>
          <select aria-label="Filter Trash by type" value={resource} onChange={(event) => setResource(event.target.value as Resource | 'all')}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="all">All types</option>
            {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <span className="text-sm font-semibold text-slate-500">{items.length} items</span>
        </div>
        {error ? <p role="alert" className="p-6 text-sm text-red-600">{error} Use Refresh to try again.</p>
          : loading ? <p role="status" className="p-8 text-center text-sm text-slate-500">Loading Trash...</p>
          : visibleItems.length === 0 ? <div className="flex flex-col items-center gap-3 p-12 text-slate-500">
            <Trash2 size={30} /><p>{items.length ? 'No items match your filters.' : 'Trash is empty.'}</p>
          </div>
          : <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
                <tr><th className="px-6 py-4">Item</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Deleted</th><th className="px-6 py-4 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleItems.map((item) => {
                  const key = `${item.resource}:${item.id}`
                  return <tr key={key}>
                    <td className="px-6 py-5"><p className="font-bold text-slate-900">{item.title}</p>
                      {item.slug && <p className="mt-1 break-all text-xs text-slate-500">{item.slug}</p>}</td>
                    <td className="px-6 py-5"><StatusTag>{labels[item.resource]}</StatusTag></td>
                    <td className="px-6 py-5 text-slate-500">{new Date(item.deletedAt).toLocaleString()}</td>
                    <td className="px-6 py-5 text-right"><button type="button" disabled={restoring !== null}
                      onClick={() => void restore(item)} aria-label={`Restore ${item.title}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 font-bold text-brand-700 hover:bg-brand-100 disabled:opacity-50">
                      <RotateCcw size={16} />{restoring === key ? 'Restoring...' : 'Restore'}
                    </button></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>}
      </div>
    </section>
  )
}
