'use client'

import { ArrowLeft, Fingerprint, Lock, Mail, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { apiRequest } from '@/lib/admin/api'
import { setAdminToken } from '@/lib/admin/auth'

type LoginResponse = {
  token: string
  user: {
    email: string
    role: string
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('radiconlab@radicon.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email, password }),
      })
      setAdminToken(response.token)
      router.replace('/admin')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="grid min-h-screen bg-slate-950 text-slate-950 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_18%_20%,rgba(244,63,94,0.55),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(14,165,233,0.32),transparent_28%),radial-gradient(circle_at_52%_78%,rgba(16,185,129,0.28),transparent_32%),linear-gradient(135deg,#020617,#111827)] p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-white/80 transition hover:text-white">
            <ArrowLeft size={17} />
            Back to website
          </Link>
        </div>
        <div className="relative max-w-xl">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-200">Radicon Admin</p>
          <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight text-white">
            Secure operational intelligence for content, products, and inquiries.
          </h1>
          <div className="mt-8 flex gap-3">
            {['Acrylic UI', 'Protected Routes', 'CRUD Ready'].map((item) => (
              <span key={item} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/80 backdrop-blur-xl">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.12),transparent_34%),#f8fafc] px-4 py-10">
        <div className="w-full max-w-md rounded-[32px] border border-white/80 bg-white/85 p-7 shadow-2xl shadow-slate-300/50 backdrop-blur-2xl sm:p-9">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-300">
            <Fingerprint size={24} />
          </div>
          <div className="mt-7 text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-600">Admin Access</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Sign in securely</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
              Enter your credentials to access the Radicon command console.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-black text-slate-700">Email address</span>
              <span className="mt-2 flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-inner transition focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-100">
                <Mail size={18} className="text-brand-500" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  name="email"
                  type="email"
                  className="h-full w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-black text-slate-700">Password</span>
              <span className="mt-2 flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-inner transition focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-100">
                <Lock size={18} className="text-brand-500" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className="h-full w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                  required
                />
              </span>
            </label>

            {error ? (
              <p className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700">
                {error}
              </p>
            ) : null}

            <div className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-brand-600" />
                <p className="text-sm font-black text-slate-800">Two-factor verification ready</p>
              </div>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                Add a second factor later without changing the protected admin flow.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl border border-brand-400/40 bg-brand-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-200 transition-all hover:-translate-y-0.5 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Continue to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
