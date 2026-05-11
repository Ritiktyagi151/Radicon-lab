'use client'

import { Edit3, Eye, Image as ImageIcon, Plus, Trash2, Upload, X } from 'lucide-react'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { AdminButton, AdminPageHeader, StatusTag } from '@/components/admin/AdminPrimitives'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { useToast } from '@/components/admin/providers/ToastProvider'
import { apiRequest } from '@/lib/admin/api'
import { useRealtimeUpdates } from '@/lib/admin/realtime'
import { uploadAdminImage, validateImageFile } from '@/lib/admin/upload'
import { useSeoRoutes } from '@/lib/admin/useSeoRoutes'
import type { Blog } from '@/types/blog'

type BlogForm = Omit<Blog, '_id' | 'createdAt' | 'updatedAt'>

const toDateInputValue = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 10)
}

const toIsoDate = (value?: string) => {
  if (!value) return undefined
  return new Date(`${value}T00:00:00.000Z`).toISOString()
}

const formatAdminDate = (value?: string) => {
  if (!value) return 'Not set'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

const emptyForm: BlogForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: '',
  tags: [],
  author: 'Radicon Lab Team',
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
  readTime: '3 min read',
  publishedAt: toDateInputValue(new Date().toISOString()),
}

export default function BlogManager() {
  const { showToast } = useToast()
  const { blogHref } = useSeoRoutes()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [form, setForm] = useState<BlogForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadingFeaturedImage, setIsUploadingFeaturedImage] = useState(false)

  const sortedBlogs = useMemo(() => blogs, [blogs])

  const loadBlogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await apiRequest<{ data: Blog[] }>('/blogs?limit=100', { auth: false })
      setBlogs(response.data)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to load blogs', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadBlogs()
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [loadBlogs])

  useRealtimeUpdates({
    resources: ['blogs'],
    onEvent: (event) => {
      if (event.resource !== 'blogs' || event.action === 'heartbeat') return
      showToast(event.message)
      void loadBlogs()
    },
    onError: () => showToast('Realtime blog sync disconnected. Retrying automatically.', 'error'),
  })

  const startCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setIsOpen(true)
  }

  const startEdit = (blog: Blog) => {
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: blog.featuredImage,
      category: blog.category,
      tags: blog.tags,
      author: blog.author,
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || '',
      status: blog.status,
      readTime: blog.readTime,
      publishedAt: toDateInputValue(blog.publishedAt || blog.createdAt),
    })
    setEditingId(blog._id || null)
    setIsOpen(true)
  }

  const saveBlog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.content.trim()) {
      showToast('Please add blog content before saving.', 'error')
      return
    }

    try {
      const payload = { ...form, slug: form.slug || form.title, publishedAt: toIsoDate(form.publishedAt) }
      if (editingId) {
        await apiRequest(`/blogs/${editingId}`, { method: 'PATCH', body: JSON.stringify(payload) })
        showToast('Blog updated successfully')
      } else {
        await apiRequest('/blogs', { method: 'POST', body: JSON.stringify(payload) })
        showToast('Blog created successfully')
      }
      setIsOpen(false)
      await loadBlogs()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to save blog', 'error')
    }
  }

  const uploadFeaturedImage = async (file?: File) => {
    if (!file) return
    try {
      validateImageFile(file)
      setIsUploadingFeaturedImage(true)
      const url = await uploadAdminImage(file)
      setForm((currentForm) => ({ ...currentForm, featuredImage: url }))
      showToast('Featured image uploaded')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to upload image', 'error')
    } finally {
      setIsUploadingFeaturedImage(false)
    }
  }

  const uploadEditorImage = async (file: File) => {
    try {
      const url = await uploadAdminImage(file)
      showToast('Image inserted')
      return url
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to upload image', 'error')
      throw error
    }
  }

  const deleteBlog = async (id?: string) => {
    if (!id || !window.confirm('Delete this blog?')) return
    try {
      await apiRequest(`/blogs/${id}`, { method: 'DELETE' })
      showToast('Blog deleted successfully')
      await loadBlogs()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to delete blog', 'error')
    }
  }

  return (
    <section>
      <AdminPageHeader
        eyebrow="Content Studio"
        title="Blog CRUD"
        description="Create, edit, preview, delete, and publish blog content with image previews and status tracking."
        action={
          <AdminButton onClick={startCreate}>
            <span className="inline-flex items-center gap-2">
              <Plus size={17} />
              New Blog
            </span>
          </AdminButton>
        }
      />

      <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="border-b border-slate-100 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-6 py-5">Blog</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Author</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Read</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td className="px-6 py-8 font-bold text-slate-500" colSpan={7}>Loading blogs...</td></tr>
              ) : sortedBlogs.length ? (
                sortedBlogs.map((blog) => (
                  <tr key={blog.slug} className="transition hover:bg-brand-50/40">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img src={blog.featuredImage} alt={blog.title} className="h-14 w-20 rounded-2xl object-cover" />
                        <div>
                          <p className="font-black text-slate-950">{blog.title}</p>
                          <p className="mt-1 max-w-md truncate text-sm font-semibold text-slate-500">{blog.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600">{blog.category}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600">{blog.author}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600">{formatAdminDate(blog.publishedAt || blog.createdAt)}</td>
                    <td className="px-6 py-5"><StatusTag tone={blog.status === 'published' ? 'green' : blog.status === 'draft' ? 'slate' : 'amber'}>{blog.status}</StatusTag></td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600">{blog.readTime}</td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <a href={blogHref(blog.slug)} target="_blank" className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-brand-600"><Eye size={16} /></a>
                        <button onClick={() => startEdit(blog)} className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-brand-600"><Edit3 size={16} /></button>
                        <button onClick={() => deleteBlog(blog._id)} className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-brand-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td className="px-6 py-8 font-bold text-slate-500" colSpan={7}>No blogs yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
          <form onSubmit={saveBlog} className="mx-auto my-8 max-w-4xl rounded-[32px] border border-white/70 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-950">{editingId ? 'Edit Blog' : 'Add Blog'}</h2>
              <button type="button" onClick={() => setIsOpen(false)} className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200"><X size={17} /></button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Input label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} required />
              <Input label="Slug" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} placeholder="Auto from title if blank" />
              <Input label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} required />
              <Input label="Author" value={form.author} onChange={(value) => setForm({ ...form, author: value })} required />
              <Input label="Read Time" value={form.readTime} onChange={(value) => setForm({ ...form, readTime: value })} required />
              <Input label="Blog Date" type="date" value={form.publishedAt || ''} onChange={(value) => setForm({ ...form, publishedAt: value })} required />
              <label className="block">
                <span className="text-sm font-black text-slate-700">Status</span>
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as BlogForm['status'] })} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-brand-300">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <Input label="Tags (comma separated)" value={form.tags.join(', ')} onChange={(value) => setForm({ ...form, tags: value.split(',').map((tag) => tag.trim()).filter(Boolean) })} />
              <div className="md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-black text-slate-700">Featured Image</span>
                  {form.featuredImage ? (
                    <button type="button" onClick={() => setForm({ ...form, featuredImage: '' })} className="text-xs font-black uppercase tracking-wide text-brand-600">
                      Remove image
                    </button>
                  ) : null}
                </div>
                <div className="mt-2 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_220px]">
                  <div className="space-y-3">
                    <Input label="Image URL" value={form.featuredImage} onChange={(value) => setForm({ ...form, featuredImage: value })} required />
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-600">
                      {isUploadingFeaturedImage ? <ImageIcon size={17} /> : <Upload size={17} />}
                      {isUploadingFeaturedImage ? 'Uploading...' : form.featuredImage ? 'Replace image' : 'Upload JPG, PNG, WEBP'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={isUploadingFeaturedImage}
                        onChange={(event) => {
                          void uploadFeaturedImage(event.target.files?.[0])
                          event.currentTarget.value = ''
                        }}
                      />
                    </label>
                  </div>
                  <div className="min-h-40 overflow-hidden rounded-2xl border border-white bg-white shadow-sm">
                    {form.featuredImage ? (
                      <img src={form.featuredImage} alt="Featured preview" className="h-full min-h-40 w-full object-cover" />
                    ) : (
                      <div className="grid h-full min-h-40 place-items-center px-5 text-center text-sm font-bold text-slate-400">
                        Image preview
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Textarea label="Excerpt" value={form.excerpt} onChange={(value) => setForm({ ...form, excerpt: value })} required />
              <RichTextEditor
                label="Content"
                value={form.content}
                onChange={(value) => setForm({ ...form, content: value })}
                onUploadImage={uploadEditorImage}
                required
              />
            </div>
            <button className="mt-6 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-brand-200">{editingId ? 'Update Blog' : 'Create Blog'}</button>
          </form>
        </div>
      ) : null}
    </section>
  )
}

function Input({ label, value, onChange, required, placeholder, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} placeholder={placeholder} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-brand-300" />
    </label>
  )
}

function Textarea({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="block md:col-span-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} required={required} rows={5} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-brand-300" />
    </label>
  )
}
