'use client'

import { Mail, Phone, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AdminPageHeader, StatusTag } from '@/components/admin/AdminPrimitives'
import { useToast } from '@/components/admin/providers/ToastProvider'
import { apiRequest } from '@/lib/admin/api'
import { useRealtimeUpdates } from '@/lib/admin/realtime'

type Contact = {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  status: string
  createdAt: string
}

export default function ContactManager() {
  const { showToast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [activeContact, setActiveContact] = useState<Contact | null>(null)

  const loadContacts = async () => {
    try {
      const data = await apiRequest<Contact[]>('/contacts')
      setContacts(data)
      setActiveContact(data[0] || null)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to load inquiries', 'error')
    }
  }

  useEffect(() => {
    void loadContacts()
  }, [])

  useRealtimeUpdates({
    resources: ['contacts'],
    onEvent: (event) => {
      if (event.resource !== 'contacts' || event.action === 'heartbeat') return
      showToast(event.message)
      void loadContacts()
    },
    onError: () => showToast('Realtime contact sync disconnected. Retrying automatically.', 'error'),
  })

  const deleteContact = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return
    try {
      await apiRequest(`/contacts/${id}`, { method: 'DELETE' })
      showToast('Contact inquiry deleted successfully')
      await loadContacts()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to delete inquiry', 'error')
    }
  }

  return (
    <section>
      <AdminPageHeader
        eyebrow="Client Inbox"
        title="Contact Us CRUD"
        description="Review all user inquiries, inspect messages in a quick-view panel, and delete resolved requests."
      />

      <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
        <div className="overflow-x-auto lg:pr-96">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-slate-100 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              <tr><th className="px-6 py-5">Contact</th><th className="px-6 py-5">Subject</th><th className="px-6 py-5">Status</th><th className="px-6 py-5">Received</th><th className="px-6 py-5 text-right">Delete</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map((contact) => (
                <tr key={contact._id} onClick={() => setActiveContact(contact)} className="cursor-pointer transition hover:bg-brand-50/40">
                  <td className="px-6 py-5"><p className="font-black text-slate-950">{contact.name}</p><p className="mt-1 text-sm font-semibold text-slate-500">{contact.company || contact.email}</p></td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-600">{contact.subject}</td>
                  <td className="px-6 py-5"><StatusTag tone="indigo">{contact.status}</StatusTag></td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-500">{new Date(contact.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-5 text-right"><button onClick={(event) => { event.stopPropagation(); void deleteContact(contact._id) }} className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-brand-600"><Trash2 size={16} /></button></td>
                </tr>
              ))}
              {!contacts.length ? <tr><td className="px-6 py-8 font-bold text-slate-500" colSpan={5}>No inquiries yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <aside className="border-t border-slate-100 bg-slate-950 p-6 text-white lg:absolute lg:inset-y-0 lg:right-0 lg:w-96 lg:border-l lg:border-t-0 lg:border-white/10">
          {activeContact ? (
            <>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-300">Quick View</p>
              <h2 className="mt-3 text-2xl font-black">{activeContact.name}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-400">{activeContact.company || 'Website Inquiry'}</p>
              <div className="mt-7 space-y-3 text-sm font-semibold text-slate-300">
                <p className="flex items-center gap-3"><Mail size={16} className="text-brand-300" />{activeContact.email}</p>
                {activeContact.phone ? <p className="flex items-center gap-3"><Phone size={16} className="text-brand-300" />{activeContact.phone}</p> : null}
              </div>
              <p className="mt-7 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm font-medium leading-7 text-slate-200">{activeContact.message}</p>
            </>
          ) : (
            <p className="text-sm font-bold text-slate-300">Select an inquiry to preview it.</p>
          )}
        </aside>
      </div>
    </section>
  )
}
