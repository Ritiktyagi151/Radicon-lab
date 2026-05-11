'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Cookie, Settings2, ShieldCheck, X } from 'lucide-react'

type ConsentPreferences = {
  necessary: true
  analytics: boolean
  marketing: boolean
  preferences: boolean
  updatedAt: string
}

const STORAGE_KEY = 'radicon_cookie_consent'
const COOKIE_KEY = 'radicon_cookie_consent'

const defaultPreferences: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
  updatedAt: '',
}

function getSavedPreferences() {
  if (typeof window === 'undefined') return null

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return null

    const parsed = JSON.parse(saved) as Partial<ConsentPreferences>
    return {
      ...defaultPreferences,
      ...parsed,
      necessary: true as const,
    }
  } catch {
    return null
  }
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return

  const hostParts = window.location.hostname.split('.')
  const domains = [
    window.location.hostname,
    hostParts.length > 1 ? `.${hostParts.slice(-2).join('.')}` : '',
  ].filter(Boolean)

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
  domains.forEach((domain) => {
    document.cookie = `${name}=; path=/; domain=${domain}; max-age=0; SameSite=Lax`
  })
}

function clearNonEssentialCookies() {
  [
    '_ga',
    '_gid',
    '_gat',
    '_gcl_au',
    '_fbp',
    '_fbc',
    'fr',
    'analytics_storage',
    'marketing_storage',
  ].forEach(deleteCookie)
}

function publishConsent(preferences: ConsentPreferences) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent('radicon-cookie-consent', {
      detail: preferences,
    }),
  )
}

function persistPreferences(preferences: ConsentPreferences) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(preferences))}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`
  publishConsent(preferences)

  if (!preferences.analytics || !preferences.marketing) {
    clearNonEssentialCookies()
  }
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [draft, setDraft] = useState(defaultPreferences)

  useEffect(() => {
    const saved = getSavedPreferences()

    if (saved) {
      publishConsent(saved)
      if (!saved.analytics || !saved.marketing) clearNonEssentialCookies()
      return
    }

    const timer = window.setTimeout(() => setIsVisible(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  const save = (preferences: Pick<ConsentPreferences, 'analytics' | 'marketing' | 'preferences'>) => {
    const nextPreferences = {
      ...preferences,
      necessary: true as const,
      updatedAt: new Date().toISOString(),
    }

    persistPreferences(nextPreferences)
    setDraft(nextPreferences)
    setIsVisible(false)
    setIsCustomizing(false)
  }

  const summary = useMemo(() => {
    if (draft.analytics && draft.marketing && draft.preferences) return 'All optional cookies enabled'
    if (!draft.analytics && !draft.marketing && !draft.preferences) return 'Only necessary cookies enabled'
    return 'Custom preferences selected'
  }, [draft.analytics, draft.marketing, draft.preferences])

  if (!isVisible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-3 sm:px-6 sm:pb-4 lg:px-8">
      <div className="mx-auto max-h-[82vh] max-w-5xl overflow-y-auto border border-brand-100 bg-white shadow-2xl shadow-black/15">
        <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand-50 text-brand-600">
                <Cookie size={22} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-600">
                  Cookie Preferences
                </p>
                <h2 className="mt-2 text-xl font-black leading-tight text-black sm:text-2xl">
                  We use cookies to improve your website experience.
                </h2>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-gray-600">
                  Necessary cookies keep the site working. Optional cookies help us understand
                  performance, remember preferences, and support marketing only if you allow them.
                  Read our{' '}
                  <Link href="/privacy" className="font-black text-brand-600 underline underline-offset-4">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            {isCustomizing ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <PreferenceToggle
                  title="Analytics"
                  description="Website usage and performance insights."
                  checked={draft.analytics}
                  onChange={(checked) => setDraft((current) => ({ ...current, analytics: checked }))}
                />
                <PreferenceToggle
                  title="Marketing"
                  description="Campaign and advertising measurement."
                  checked={draft.marketing}
                  onChange={(checked) => setDraft((current) => ({ ...current, marketing: checked }))}
                />
                <PreferenceToggle
                  title="Preferences"
                  description="Remember useful site preferences."
                  checked={draft.preferences}
                  onChange={(checked) => setDraft((current) => ({ ...current, preferences: checked }))}
                />
              </div>
            ) : (
              <div className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-gray-500">
                <ShieldCheck size={17} className="text-brand-600" />
                {summary}
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-56 lg:grid-cols-1">
            <button
              type="button"
              onClick={() =>
                save({
                  analytics: true,
                  marketing: true,
                  preferences: true,
                })
              }
              className="inline-flex items-center justify-center bg-brand-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-brand-800"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => save(defaultPreferences)}
              className="inline-flex items-center justify-center border border-brand-100 bg-white px-5 py-3 text-sm font-black uppercase tracking-wide text-black transition hover:border-brand-600 hover:text-brand-600"
            >
              Reject All
            </button>
            {isCustomizing ? (
              <button
                type="button"
                onClick={() => save(draft)}
                className="inline-flex items-center justify-center border border-black bg-black px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-brand-600 hover:border-brand-600"
              >
                Save Choices
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCustomizing(true)}
                className="inline-flex items-center justify-center gap-2 border border-brand-100 bg-brand-50 px-5 py-3 text-sm font-black uppercase tracking-wide text-black transition hover:border-brand-600 hover:text-brand-600"
              >
                <Settings2 size={17} />
                Customize
              </button>
            )}
          </div>
        </div>

        {isCustomizing ? (
          <button
            type="button"
            onClick={() => setIsCustomizing(false)}
            className="absolute right-6 top-6 hidden h-9 w-9 items-center justify-center border border-brand-100 bg-white text-black transition hover:border-brand-600 hover:text-brand-600 sm:flex"
            aria-label="Close preferences"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>
    </div>
  )
}

function PreferenceToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="block border border-brand-100 bg-[#F0F8FF] p-4">
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-sm font-black uppercase text-black">{title}</span>
          <span className="mt-1 block text-xs font-semibold leading-5 text-gray-600">{description}</span>
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-5 w-5 accent-brand-600"
        />
      </span>
    </label>
  )
}
