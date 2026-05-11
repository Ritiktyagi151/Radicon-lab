'use client'

import { Mail, MessageSquare, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { StatusTag } from './AdminPrimitives'

const messages = [
  {
    name: 'Ankit Sharma',
    company: 'Northwell Pharma',
    email: 'ankit@northwell.example',
    phone: '+91 98765 43210',
    subject: 'Third party manufacturing inquiry',
    urgency: 'High',
    status: 'New',
    time: '12 min ago',
    message:
      'We are evaluating partners for a new oral solid dosage product line and need details on capacity, documentation, and estimated lead times.',
  },
  {
    name: 'Dr. Meera Kapoor',
    company: 'Clinical Procurement Desk',
    email: 'meera@clinicaldesk.example',
    phone: '+91 98111 20444',
    subject: 'Quality documentation request',
    urgency: 'Medium',
    status: 'Open',
    time: '2 hr ago',
    message:
      'Please share the documentation checklist required before vendor qualification review.',
  },
  {
    name: 'Rohit Malhotra',
    company: 'MedTrade Associates',
    email: 'rohit@medtrade.example',
    phone: '+91 90221 67500',
    subject: 'Bulk product availability',
    urgency: 'Low',
    status: 'Queued',
    time: 'Yesterday',
    message:
      'We would like to understand available product categories and commercial terms for repeat orders.',
  },
]

const urgencyTone = {
  High: 'rose',
  Medium: 'amber',
  Low: 'green',
} as const

export default function ContactInbox() {
  const [activeMessage, setActiveMessage] = useState(messages[0])

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              <th className="px-6 py-5">Contact</th>
              <th className="px-6 py-5">Subject</th>
              <th className="px-6 py-5">Urgency</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Received</th>
              <th className="px-6 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {messages.map((message) => (
              <tr key={message.email} className="transition hover:bg-brand-50/40">
                <td className="px-6 py-5">
                  <p className="font-black text-slate-950">{message.name}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{message.company}</p>
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-slate-700">{message.subject}</td>
                <td className="px-6 py-5">
                  <StatusTag tone={urgencyTone[message.urgency as keyof typeof urgencyTone]}>
                    {message.urgency}
                  </StatusTag>
                </td>
                <td className="px-6 py-5">
                  <StatusTag tone="indigo">{message.status}</StatusTag>
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-slate-500">{message.time}</td>
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => setActiveMessage(message)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-brand-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200"
                  >
                    Quick View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="border-t border-slate-100 bg-slate-950 p-6 text-white lg:absolute lg:inset-y-0 lg:right-0 lg:w-96 lg:border-l lg:border-t-0 lg:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-300">Quick View</p>
            <h2 className="mt-3 text-2xl font-black">{activeMessage.name}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-400">{activeMessage.company}</p>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-300">
            <X size={17} />
          </button>
        </div>
        <div className="mt-7 space-y-3 text-sm font-semibold text-slate-300">
          <p className="flex items-center gap-3">
            <Mail size={16} className="text-brand-300" />
            {activeMessage.email}
          </p>
          <p className="flex items-center gap-3">
            <Phone size={16} className="text-brand-300" />
            {activeMessage.phone}
          </p>
          <p className="flex items-center gap-3">
            <MessageSquare size={16} className="text-brand-300" />
            {activeMessage.subject}
          </p>
        </div>
        <p className="mt-7 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm font-medium leading-7 text-slate-200">
          {activeMessage.message}
        </p>
      </aside>
    </div>
  )
}
