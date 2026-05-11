'use client'

import { ArrowDown, ArrowUp, Edit3, GripVertical, ImagePlus, Plus, Trash2, X } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { AdminButton, AdminPageHeader, StatusTag } from '@/components/admin/AdminPrimitives'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { useToast } from '@/components/admin/providers/ToastProvider'
import { apiRequest } from '@/lib/admin/api'
import { uploadAdminImage } from '@/lib/admin/upload'
import { useRealtimeUpdates } from '@/lib/admin/realtime'
import type { Category, Product, ProductStatus } from '@/types/product'

type ProductForm = Omit<Product, '_id' | 'category'> & { _id?: string; category: string }
type CategoryForm = Omit<Category, '_id'> & { _id?: string }
type AdminPayload = Record<string, unknown>

const emptyCategory: CategoryForm = {
  name: '',
  slug: '',
  description: '',
  image: '',
  metaTitle: '',
  metaDescription: '',
  status: 'draft',
}

const emptyProduct: ProductForm = {
  name: '',
  slug: '',
  sku: '',
  category: '',
  description: '',
  shortDescription: '',
  fullContent: '',
  image: '',
  gallery: [],
  tags: [],
  metaTitle: '',
  metaDescription: '',
  seoKeywords: [],
  canonicalUrl: '',
  status: 'draft',
}

export default function ProductManager() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct)
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategory)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [isProductOpen, setIsProductOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [draggingProductId, setDraggingProductId] = useState<string | null>(null)
  const [draggingCategoryId, setDraggingCategoryId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const [categoryData, productData] = await Promise.all([
        apiRequest<Category[]>('/categories', { auth: false }),
        apiRequest<Product[]>('/products', { auth: false }),
      ])
      setCategories(categoryData)
      setProducts(productData)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to load product data', 'error')
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  useRealtimeUpdates({
    resources: ['products', 'categories'],
    onEvent: (event) => {
      if (event.action === 'heartbeat') return
      showToast(event.message)
      void loadData()
    },
    onError: () => showToast('Realtime product sync disconnected. Retrying automatically.', 'error'),
  })

  const uploadImage = async (file: File, setter: (url: string) => void) => {
    try {
      const url = await uploadAdminImage(file)
      setter(url)
      showToast('Image uploaded successfully')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to upload image', 'error')
    }
  }

  const uploadRichContentImage = async (file: File) => {
    const url = await uploadAdminImage(file)
    showToast('Image uploaded successfully')
    return url
  }

  const saveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = { ...categoryForm, slug: categoryForm.slug || categoryForm.name }
    stripReadonlyFields(payload)

    try {
      if (editingCategoryId) {
        await apiRequest(`/categories/${editingCategoryId}`, { method: 'PATCH', body: JSON.stringify(payload) })
        showToast('Category updated successfully')
      } else {
        await apiRequest('/categories', { method: 'POST', body: JSON.stringify(payload) })
        showToast('Category created successfully')
      }
      setIsCategoryOpen(false)
      await loadData()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to save category', 'error')
    }
  }

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = {
      ...productForm,
      slug: productForm.slug || productForm.name,
      description: productForm.shortDescription || productForm.description,
    }
    stripReadonlyFields(payload)

    try {
      if (editingProductId) {
        await apiRequest(`/products/${editingProductId}`, { method: 'PATCH', body: JSON.stringify(payload) })
        showToast('Product updated successfully')
      } else {
        await apiRequest('/products', { method: 'POST', body: JSON.stringify(payload) })
        showToast('Product created successfully')
      }
      setIsProductOpen(false)
      await loadData()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to save product', 'error')
    }
  }

  const deleteCategory = async (id?: string) => {
    if (!id || !window.confirm('Delete this category? Products assigned to it should be moved first.')) return
    try {
      await apiRequest(`/categories/${id}`, { method: 'DELETE' })
      showToast('Category deleted successfully')
      await loadData()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to delete category', 'error')
    }
  }

  const deleteProduct = async (id?: string) => {
    if (!id || !window.confirm('Delete this product?')) return
    try {
      await apiRequest(`/products/${id}`, { method: 'DELETE' })
      showToast('Product deleted successfully')
      await loadData()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to delete product', 'error')
    }
  }

  const seedSampleData = async () => {
    try {
      await apiRequest('/products/sample-data', { method: 'POST' })
      showToast('Sample product data is ready')
      await loadData()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to create sample data', 'error')
    }
  }

  const persistProductOrder = async (items: Product[]) => {
    setProducts(items)
    try {
      await apiRequest('/products/reorder/items', {
        method: 'PATCH',
        body: JSON.stringify({ items: items.map((item, index) => ({ id: item._id, sortOrder: index })) }),
      })
      showToast('Product order updated successfully')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update product order', 'error')
      await loadData()
    }
  }

  const persistCategoryOrder = async (items: Category[]) => {
    setCategories(items)
    try {
      await apiRequest('/categories/reorder/items', {
        method: 'PATCH',
        body: JSON.stringify({ items: items.map((item, index) => ({ id: item._id, sortOrder: index })) }),
      })
      showToast('Category order updated successfully')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update category order', 'error')
      await loadData()
    }
  }

  const moveProduct = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= products.length || fromIndex === toIndex) return
    const nextProducts = [...products]
    const [moved] = nextProducts.splice(fromIndex, 1)
    nextProducts.splice(toIndex, 0, moved)
    void persistProductOrder(nextProducts)
  }

  const moveCategory = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= categories.length || fromIndex === toIndex) return
    const nextCategories = [...categories]
    const [moved] = nextCategories.splice(fromIndex, 1)
    nextCategories.splice(toIndex, 0, moved)
    void persistCategoryOrder(nextCategories)
  }

  const dropProduct = (targetIndex: number) => {
    const fromIndex = products.findIndex((product) => product._id === draggingProductId)
    setDraggingProductId(null)
    if (fromIndex === -1) return
    moveProduct(fromIndex, targetIndex)
  }

  const dropCategory = (targetIndex: number) => {
    const fromIndex = categories.findIndex((category) => category._id === draggingCategoryId)
    setDraggingCategoryId(null)
    if (fromIndex === -1) return
    moveCategory(fromIndex, targetIndex)
  }

  const openCreateCategory = () => {
    setCategoryForm(emptyCategory)
    setEditingCategoryId(null)
    setIsCategoryOpen(true)
  }

  const openEditCategory = (category: Category) => {
    setCategoryForm(category)
    setEditingCategoryId(category._id)
    setIsCategoryOpen(true)
  }

  const openCreateProduct = () => {
    setProductForm({ ...emptyProduct, category: categories[0]?._id || '' })
    setEditingProductId(null)
    setIsProductOpen(true)
  }

  const openEditProduct = (product: Product) => {
    const category = typeof product.category === 'string' ? product.category : product.category?._id || ''
    setProductForm({
      ...emptyProduct,
      ...product,
      category,
      shortDescription: product.shortDescription || product.description || '',
      fullContent: product.fullContent || '',
      seoKeywords: product.seoKeywords || [],
      canonicalUrl: product.canonicalUrl || '',
    })
    setEditingProductId(product._id)
    setIsProductOpen(true)
  }

  return (
    <section>
      <AdminPageHeader
        eyebrow="Product Operations"
        title="Product & Category Management"
        description="Manage product categories, product details, galleries, content, SEO, and display order."
        action={
          <div className="flex flex-wrap gap-2">
            <AdminButton onClick={openCreateCategory}><span className="inline-flex items-center gap-2"><Plus size={17} />Add Category</span></AdminButton>
            <AdminButton onClick={openCreateProduct}><span className="inline-flex items-center gap-2"><Plus size={17} />Add Product</span></AdminButton>
            <AdminButton onClick={seedSampleData}>Load Samples</AdminButton>
          </div>
        }
      />

      <div className="mb-5 flex gap-2">
        {(['products', 'categories'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-2xl border px-5 py-3 text-sm font-black capitalize transition ${
              activeTab === tab
                ? 'border-brand-200 bg-white text-brand-700 shadow-lg shadow-brand-100/70'
                : 'border-white/70 bg-white/60 text-slate-600 hover:text-slate-950'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'products' ? (
        <DataTable columns={['Product', 'SKU', 'Category', 'Status', 'Actions']}>
          {products.map((product, index) => {
            const category = typeof product.category === 'string' ? null : product.category
            return (
              <tr
                key={product._id || product.slug}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => dropProduct(index)}
                onDragEnd={() => setDraggingProductId(null)}
                className="transition hover:bg-brand-50/40"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <span
                      draggable
                      onDragStart={() => setDraggingProductId(product._id)}
                      className="cursor-grab text-slate-300 active:cursor-grabbing"
                    >
                      <GripVertical size={18} />
                    </span>
                    <img src={product.image} alt={product.name} className="h-14 w-20 rounded-2xl object-cover" />
                    <div>
                      <p className="font-black text-slate-950">{product.name}</p>
                      <p className="mt-1 max-w-md truncate text-sm font-semibold text-slate-500">{product.shortDescription || product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-600">{product.sku}</td>
                <td className="px-6 py-5 text-sm font-bold text-slate-600">{category?.name || 'Unassigned'}</td>
                <td className="px-6 py-5"><StatusTag tone={product.status === 'active' ? 'green' : product.status === 'draft' ? 'slate' : 'amber'}>{product.status}</StatusTag></td>
                <td className="px-6 py-5"><RowActions onMoveUp={() => moveProduct(index, index - 1)} onMoveDown={() => moveProduct(index, index + 1)} canMoveUp={index > 0} canMoveDown={index < products.length - 1} onEdit={() => openEditProduct(product)} onDelete={() => deleteProduct(product._id)} /></td>
              </tr>
            )
          })}
          {!products.length ? <EmptyRow colSpan={5} label="No products yet." /> : null}
        </DataTable>
      ) : (
        <DataTable columns={['Category', 'Slug', 'Status', 'Actions']}>
          {categories.map((category, index) => (
            <tr
              key={category._id || category.slug}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => dropCategory(index)}
              onDragEnd={() => setDraggingCategoryId(null)}
              className="transition hover:bg-brand-50/40"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <span
                    draggable
                    onDragStart={() => setDraggingCategoryId(category._id)}
                    className="cursor-grab text-slate-300 active:cursor-grabbing"
                  >
                    <GripVertical size={18} />
                  </span>
                  {category.image ? <img src={category.image} alt={category.name} className="h-14 w-20 rounded-2xl object-cover" /> : <span className="h-14 w-20 rounded-2xl bg-slate-100" />}
                  <div>
                    <p className="font-black text-slate-950">{category.name}</p>
                    <p className="mt-1 max-w-md truncate text-sm font-semibold text-slate-500">{category.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 text-sm font-bold text-slate-600">{category.slug}</td>
              <td className="px-6 py-5"><StatusTag tone={category.status === 'active' ? 'green' : category.status === 'draft' ? 'slate' : 'amber'}>{category.status}</StatusTag></td>
              <td className="px-6 py-5"><RowActions onMoveUp={() => moveCategory(index, index - 1)} onMoveDown={() => moveCategory(index, index + 1)} canMoveUp={index > 0} canMoveDown={index < categories.length - 1} onEdit={() => openEditCategory(category)} onDelete={() => deleteCategory(category._id)} /></td>
            </tr>
          ))}
          {!categories.length ? <EmptyRow colSpan={4} label="No categories yet." /> : null}
        </DataTable>
      )}

      {isCategoryOpen ? (
        <Modal title={editingCategoryId ? 'Edit Category' : 'Add Category'} onClose={() => setIsCategoryOpen(false)} onSubmit={saveCategory}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" value={categoryForm.name} onChange={(value) => setCategoryForm({ ...categoryForm, name: value })} required />
            <Input label="Slug" value={categoryForm.slug} onChange={(value) => setCategoryForm({ ...categoryForm, slug: value })} placeholder="Auto from name if blank" />
            <ImageInput label="Category Image" value={categoryForm.image || ''} onUpload={(file) => uploadImage(file, (url) => setCategoryForm({ ...categoryForm, image: url }))} onChange={(value) => setCategoryForm({ ...categoryForm, image: value })} />
            <StatusSelect value={categoryForm.status} onChange={(status) => setCategoryForm({ ...categoryForm, status })} />
            <Textarea label="Description" value={categoryForm.description || ''} onChange={(value) => setCategoryForm({ ...categoryForm, description: value })} />
            <Input label="SEO Meta Title" value={categoryForm.metaTitle || ''} onChange={(value) => setCategoryForm({ ...categoryForm, metaTitle: value })} />
            <Textarea label="SEO Meta Description" value={categoryForm.metaDescription || ''} onChange={(value) => setCategoryForm({ ...categoryForm, metaDescription: value })} />
          </div>
          <SubmitLabel label={editingCategoryId ? 'Update Category' : 'Create Category'} />
        </Modal>
      ) : null}

      {isProductOpen ? (
        <Modal title={editingProductId ? 'Edit Product' : 'Add Product'} onClose={() => setIsProductOpen(false)} onSubmit={saveProduct}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" value={productForm.name} onChange={(value) => setProductForm({ ...productForm, name: value })} required />
            <Input label="Slug" value={productForm.slug} onChange={(value) => setProductForm({ ...productForm, slug: value })} placeholder="Auto from name if blank" />
            <Input label="SKU" value={productForm.sku} onChange={(value) => setProductForm({ ...productForm, sku: value })} required />
            <label className="block">
              <span className="text-sm font-black text-slate-700">Category</span>
              <select value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} required className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-brand-300">
                <option value="">Select category</option>
                {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
              </select>
            </label>
            <ImageInput label="Main Image" value={productForm.image} onUpload={(file) => uploadImage(file, (url) => setProductForm({ ...productForm, image: url }))} onChange={(value) => setProductForm({ ...productForm, image: value })} required />
            <StatusSelect value={productForm.status} onChange={(status) => setProductForm({ ...productForm, status })} />
            <Textarea label="Short Description" value={productForm.shortDescription ?? productForm.description} onChange={(value) => setProductForm({ ...productForm, shortDescription: value, description: value })} required />
            <Input label="Tags (comma separated)" value={productForm.tags.join(', ')} onChange={(value) => setProductForm({ ...productForm, tags: splitLines(value, ',') })} />
            <Input label="Gallery URLs (one per line)" value={productForm.gallery.join('\n')} onChange={(value) => setProductForm({ ...productForm, gallery: splitLines(value) })} />
            <RichTextEditor label="Full Content / Detailed Content" value={productForm.fullContent || ''} onChange={(value) => setProductForm({ ...productForm, fullContent: value })} onUploadImage={uploadRichContentImage} />
            <Input label="SEO Meta Title" value={productForm.metaTitle || ''} onChange={(value) => setProductForm({ ...productForm, metaTitle: value })} />
            <Textarea label="SEO Meta Description" value={productForm.metaDescription || ''} onChange={(value) => setProductForm({ ...productForm, metaDescription: value })} />
            <Input label="SEO Keywords (comma separated)" value={(productForm.seoKeywords || []).join(', ')} onChange={(value) => setProductForm({ ...productForm, seoKeywords: splitLines(value, ',') })} />
            <Input label="Canonical URL" value={productForm.canonicalUrl || ''} onChange={(value) => setProductForm({ ...productForm, canonicalUrl: value })} />
          </div>
          {productForm.image ? <img src={productForm.image} alt="Preview" className="mt-5 h-52 w-full rounded-3xl object-cover" /> : null}
          <SubmitLabel label={editingProductId ? 'Update Product' : 'Create Product'} />
        </Modal>
      ) : null}
    </section>
  )
}

function DataTable({ columns, children }: { columns: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left">
          <thead className="border-b border-slate-100 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            <tr>{columns.map((column) => <th key={column} className={`px-6 py-5 ${column === 'Actions' ? 'text-right' : ''}`}>{column}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
    </div>
  )
}

function RowActions({
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onEdit,
  onDelete,
}: {
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex justify-end gap-2">
      <button type="button" onClick={onMoveUp} disabled={!canMoveUp} className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-35"><ArrowUp size={16} /></button>
      <button type="button" onClick={onMoveDown} disabled={!canMoveDown} className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-35"><ArrowDown size={16} /></button>
      <button type="button" onClick={onEdit} className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-brand-600"><Edit3 size={16} /></button>
      <button type="button" onClick={onDelete} className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-brand-600"><Trash2 size={16} /></button>
    </div>
  )
}

function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return <tr><td className="px-6 py-8 font-bold text-slate-500" colSpan={colSpan}>{label}</td></tr>
}

function Modal({ title, onClose, onSubmit, children }: { title: string; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="mx-auto my-8 max-w-5xl rounded-[32px] border border-white/70 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-950">{title}</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200"><X size={17} /></button>
        </div>
        <div className="mt-6">{children}</div>
      </form>
    </div>
  )
}

function Input({ label, value, onChange, required, placeholder }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; placeholder?: string }) {
  return <label className="block"><span className="text-sm font-black text-slate-700">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} required={required} placeholder={placeholder} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-brand-300" /></label>
}

function Textarea({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="block md:col-span-2"><span className="text-sm font-black text-slate-700">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} required={required} rows={4} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-brand-300" /></label>
}

function ImageInput({ label, value, onChange, onUpload, required }: { label: string; value: string; onChange: (value: string) => void; onUpload: (file: File) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <div className="mt-2 flex gap-2">
        <input value={value} onChange={(event) => onChange(event.target.value)} required={required} placeholder="Image URL or upload" className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-brand-300" />
        <span className="relative grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-brand-600">
          <ImagePlus size={18} />
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => event.target.files?.[0] && onUpload(event.target.files[0])} className="absolute inset-0 cursor-pointer opacity-0" />
        </span>
      </div>
    </label>
  )
}

function StatusSelect({ value, onChange }: { value: ProductStatus; onChange: (value: ProductStatus) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">Status</span>
      <select value={value} onChange={(event) => onChange(event.target.value as ProductStatus)} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-brand-300">
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>
    </label>
  )
}

function SubmitLabel({ label }: { label: string }) {
  return <button className="mt-6 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-brand-200">{label}</button>
}

function splitLines(value: string, separator: string | RegExp = /\n/) {
  return value.split(separator).map((item) => item.trim()).filter(Boolean)
}

function stripReadonlyFields(payload: AdminPayload) {
  delete payload._id
  delete payload.__v
  delete payload.createdAt
  delete payload.updatedAt
}
