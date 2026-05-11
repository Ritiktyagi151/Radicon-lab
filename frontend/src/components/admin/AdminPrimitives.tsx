import { ButtonHTMLAttributes, ReactNode } from 'react'

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-600">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}

export function AdminButton({
  children,
  type = 'button',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type={type}
      className={`rounded-2xl border border-brand-500/40 bg-brand-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-brand-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-brand-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function StatusTag({ children, tone = 'slate' }: { children: ReactNode; tone?: 'green' | 'amber' | 'indigo' | 'slate' | 'rose' }) {
  const tones = {
    green: 'bg-brand-50 text-brand-700 ring-brand-200',
    amber: 'bg-[#F0F8FF] text-brand-700 ring-brand-200',
    indigo: 'bg-brand-50 text-brand-700 ring-brand-200',
    slate: 'bg-slate-100 text-slate-600 ring-slate-200',
    rose: 'bg-brand-50 text-brand-700 ring-brand-200',
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-white/70 bg-white/75 shadow-xl shadow-slate-200/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/60 ${className}`}
    >
      {children}
    </div>
  )
}
