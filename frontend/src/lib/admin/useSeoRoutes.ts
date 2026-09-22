'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  API_BASE_URL,
  getBlogDetailPath,
  getFallbackSeoRoutes,
  type PublicSeoRoute,
  resolveHref,
} from '@/lib/seoRoutes'

let sharedRoutes = getFallbackSeoRoutes()
let sharedEventSource: EventSource | null = null
let sharedLoadPromise: Promise<void> | null = null
let lastLoadedAt = 0
const listeners = new Set<(routes: PublicSeoRoute[]) => void>()

function emitRoutes(routes: PublicSeoRoute[]) {
  sharedRoutes = routes
  lastLoadedAt = Date.now()
  listeners.forEach((listener) => listener(routes))
}

async function loadSharedRoutes(force = false) {
  if (sharedLoadPromise) return sharedLoadPromise
  if (!force && Date.now() - lastLoadedAt < 30000) return

  sharedLoadPromise = fetch(`${API_BASE_URL}/seo-routes`, {
    cache: 'no-store',
  })
    .then(async (response) => {
      if (!response.ok) throw new Error('Unable to load routes')
      const data = (await response.json()) as PublicSeoRoute[]
      emitRoutes(data.length ? data : getFallbackSeoRoutes())
    })
    .catch(() => { /* Keep the last known routes during temporary API failures. */ })
    .finally(() => {
      sharedLoadPromise = null
    })

  return sharedLoadPromise
}

function ensureRealtimeSync() {
  if (sharedEventSource || typeof window === 'undefined') return

  sharedEventSource = new EventSource(`${API_BASE_URL}/realtime/events`, {
    withCredentials: true,
  })
  let connected = false
  sharedEventSource.onopen = () => {
    void loadSharedRoutes(connected)
    connected = true
  }

  sharedEventSource.onmessage = (message) => {
    try {
      const event = JSON.parse(message.data) as { resource?: string; action?: string }
      if (event.resource === 'seo' && event.action !== 'heartbeat') {
        void loadSharedRoutes(true)
      }
    } catch {
      // Route fetches are still no-store on navigation.
    }
  }
}

export function useSeoRoutes(initialRoutes?: PublicSeoRoute[]) {
  const [routes, setRoutes] = useState<PublicSeoRoute[]>(initialRoutes?.length ? initialRoutes : sharedRoutes)

  useEffect(() => {
    listeners.add(setRoutes)
    if (initialRoutes?.length) emitRoutes(initialRoutes)
    // Other components may have rendered before the layout seeded the shared routes.
    queueMicrotask(() => { if (listeners.has(setRoutes)) setRoutes(sharedRoutes) })
    void loadSharedRoutes()
    ensureRealtimeSync()

    return () => {
      listeners.delete(setRoutes)
      if (!listeners.size) {
        sharedEventSource?.close()
        sharedEventSource = null
      }
    }
  }, [initialRoutes])

  return useMemo(
    () => ({
      routes,
      hrefFor: (defaultPath: string) => resolveHref(routes, defaultPath),
      blogHref: (slug: string) => getBlogDetailPath(routes, slug),
    }),
    [routes],
  )
}
