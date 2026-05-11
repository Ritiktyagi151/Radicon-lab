'use client'

import {
  BarChart3,
  Bell,
  FileText,
  Home,
  Layers3,
  LifeBuoy,
  LogOut,
  Mail,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { clearAdminToken } from '@/lib/admin/auth'
import { useRealtimeUpdates } from '@/lib/admin/realtime'

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/services', label: 'Products', icon: Layers3 },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/contact', label: 'Contact', icon: Mail },
  { href: '/admin/settings', label: 'Nav & Footer', icon: Settings },
  { href: '/admin/seo', label: 'SEO', icon: BarChart3 },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" onClick={onNavigate} className="group flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/50 bg-white/70 text-brand-600 shadow-sm shadow-slate-200 backdrop-blur">
          <Sparkles size={20} />
        </span>
        <span>
          <span className="block text-sm font-black tracking-tight text-slate-950">Radicon</span>
          <span className="block text-xs font-semibold text-slate-500">Enterprise Console</span>
        </span>
      </Link>

      <nav className="mt-9 space-y-1.5">
        {adminLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm font-bold transition-all duration-300 ${
                isActive
                  ? 'border-brand-200 bg-white text-brand-700 shadow-lg shadow-brand-100/70'
                  : 'border-transparent text-slate-600 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/70 hover:text-slate-950 hover:shadow-md hover:shadow-slate-200/70'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-brand-600' : 'text-slate-400'} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          <span className="h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_18px_rgba(16,185,129,0.9)]" />
          Operational
        </div>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
          API, CMS, and dashboard services are healthy.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand-700 transition hover:text-brand-900"
        >
          View Website
        </Link>
      </div>
    </div>
  )
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const realtimeStatus = useRealtimeUpdates({
    resources: ['system'],
  })

  const logout = () => {
    clearAdminToken()
    router.replace('/login')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.16),transparent_32%),linear-gradient(135deg,#f8fafc_0%,#fff1f2_45%,#ffffff_100%)] text-slate-950">
      <aside className="fixed inset-y-4 left-4 z-40 hidden w-72 rounded-[28px] border border-white/70 bg-white/55 p-5 shadow-2xl shadow-slate-300/40 backdrop-blur-2xl lg:block">
        <SidebarContent />
      </aside>

      <div
        className={`fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm transition lg:hidden ${
          isSidebarOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <aside className="h-full w-[min(86vw,320px)] border-r border-white/60 bg-white/80 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
          <SidebarContent onNavigate={() => setIsSidebarOpen(false)} />
        </aside>
      </div>

      <div className="lg:pl-80">
        <header className="sticky top-0 z-30 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/65 px-4 py-3 shadow-lg shadow-slate-200/60 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={19} />
              </button>
              <div className="hidden h-11 min-w-[280px] items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm text-slate-500 shadow-inner sm:flex">
                <Search size={17} className="text-brand-500" />
                Search content, messages, products
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:text-brand-600">
                <Bell size={18} />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-500" />
              </button>
              <span className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm md:inline-flex">
                <span
                  className={`h-2 w-2 rounded-full ${
                    realtimeStatus === 'connected'
                      ? 'bg-brand-500 shadow-[0_0_14px_rgba(16,185,129,0.9)]'
                      : realtimeStatus === 'connecting'
                        ? 'bg-brand-300'
                        : 'bg-brand-500'
                  }`}
                />
                {realtimeStatus === 'connected'
                  ? 'Live Sync'
                  : realtimeStatus === 'connecting'
                    ? 'Connecting'
                    : 'Offline'}
              </span>
              <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm sm:flex">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">
                  RA
                </span>
                <span>
                  <span className="block text-sm font-black text-slate-950">Admin</span>
                  <span className="block text-xs font-semibold text-slate-500">Super Operator</span>
                </span>
              </div>
              <button
                onClick={logout}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-brand-600"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">{children}</main>

        <footer className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/55 px-5 py-4 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <span>Radicon Admin Console v1.0.0</span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-brand-600" />
              System healthy
            </span>
            <span className="flex items-center gap-2">
              <LifeBuoy size={15} className="text-brand-600" />
              Support SLA active
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
