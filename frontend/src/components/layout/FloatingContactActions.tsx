'use client'

import { Download } from 'lucide-react'
import { FaEnvelope, FaPhoneVolume, FaWhatsapp } from 'react-icons/fa6'

const actions = [
  {
    href: 'https://wa.me/919289611886',
    label: 'Chat on WhatsApp',
    icon: FaWhatsapp,
    className: 'bg-[#25D366] hover:bg-[#1fb85a]',
  },
  {
    href: 'mailto:bdm@radiconlab.com',
    label: 'Email Radicon',
    icon: FaEnvelope,
    className: 'bg-[#DF1F26] hover:bg-brand-800',
  },
  {
    href: 'tel:+919289611886',
    label: 'Call Radicon',
    icon: FaPhoneVolume,
    className: 'bg-slate-800 hover:bg-slate-950',
  },
]

export default function FloatingContactActions() {
  return (
    <div className="fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-5">
      <a
        href="/pdf/company_profile.pdf"
        download
        aria-label="Download company profile"
        title="Download company profile"
        className="group relative inline-flex min-h-36 w-11 flex-col items-center justify-center gap-2 overflow-hidden rounded-full bg-[#DF1F26] px-2 py-4 text-[10px] font-black uppercase tracking-wide text-white shadow-2xl shadow-brand-950/20 transition hover:-translate-y-1 hover:bg-brand-800 sm:min-h-44 sm:w-12"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#DF1F26]/25" />
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#DF1F26] transition group-hover:rotate-12">
          <Download size={17} />
        </span>
        <span className="relative [writing-mode:vertical-rl]">Download Profile</span>
      </a>

      <div className="flex flex-col gap-3">
        {actions.map(({ href, label, icon: Icon, className }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noreferrer' : undefined}
          aria-label={label}
          title={label}
          className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 sm:h-12 sm:w-12 ${className}`}
        >
          <Icon size={20} />
        </a>
        ))}
      </div>
    </div>
  )
}
