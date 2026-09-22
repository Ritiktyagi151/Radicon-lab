'use client'

import { useEffect } from 'react'

const measurementId = 'G-JGSGPQGP20'
const storageKey = 'radicon_cookie_consent'
const scriptId = 'radicon-google-analytics'
type Preferences = { analytics?: boolean; marketing?: boolean }

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    'ga-disable-G-JGSGPQGP20'?: boolean
  }
}

export default function ConsentAnalytics() {
  useEffect(() => {
    const apply = (preferences: Preferences | null) => {
      const allowed = preferences?.analytics === true
      window['ga-disable-G-JGSGPQGP20'] = !allowed
      if (!allowed && !window.gtag) return

      window.dataLayer ??= []
      // Google's command queue uses an Arguments object for each gtag call.
      // eslint-disable-next-line prefer-rest-params
      window.gtag ??= function () { window.dataLayer!.push(arguments) }
      window.gtag('consent', 'update', {
        analytics_storage: allowed ? 'granted' : 'denied',
        ad_storage: allowed && preferences?.marketing ? 'granted' : 'denied',
        ad_user_data: allowed && preferences?.marketing ? 'granted' : 'denied',
        ad_personalization: allowed && preferences?.marketing ? 'granted' : 'denied',
      })
      if (!allowed || document.getElementById(scriptId)) return

      window.gtag('js', new Date())
      window.gtag('config', measurementId)
      const script = document.createElement('script')
      script.id = scriptId
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      script.onerror = () => script.remove()
      document.head.appendChild(script)
    }
    const restore = () => {
      try { apply(JSON.parse(localStorage.getItem(storageKey) || 'null')) }
      catch { apply(null) }
    }
    const onConsent = (event: Event) => apply((event as CustomEvent<Preferences>).detail)
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) restore()
    }
    window.addEventListener('radicon-cookie-consent', onConsent)
    window.addEventListener('storage', onStorage)
    restore()
    return () => {
      window.removeEventListener('radicon-cookie-consent', onConsent)
      window.removeEventListener('storage', onStorage)
    }
  }, [])
  return null
}
