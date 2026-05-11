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
const listeners = new Set<(routes: PublicSeoRoute[]) => void>()

function emitRoutes(routes: PublicSeoRoute[]) {
  sharedRoutes = routes
  listeners.forEach((listener) => listener(routes))
}

async function loadSharedRoutes() {
  if (sharedLoadPromise) return sharedLoadPromise

  sharedLoadPromise = fetch(`${API_BASE_URL}/seo-routes`, {
    cache: 'no-store',
  })
    .then(async (response) => {
      if (!response.ok) throw new Error('Unable to load routes')
      const data = (await response.json()) as PublicSeoRoute[]
      emitRoutes(data.length ? data : getFallbackSeoRoutes())
    })
    .catch(() => emitRoutes(getFallbackSeoRoutes()))
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

  sharedEventSource.onmessage = (message) => {
    try {
      const event = JSON.parse(message.data) as { resource?: string; action?: string }
      if (event.resource === 'seo' && event.action !== 'heartbeat') {
        void loadSharedRoutes()
      }
    } catch {
      // Route fetches are still no-store on navigation.
    }
  }
}

export function useSeoRoutes(initialRoutes?: PublicSeoRoute[]) {
  const [routes, setRoutes] = useState<PublicSeoRoute[]>(initialRoutes?.length ? initialRoutes : sharedRoutes)

  useEffect(() => {
    if (initialRoutes?.length) emitRoutes(initialRoutes)
    listeners.add(setRoutes)
    void loadSharedRoutes()
    ensureRealtimeSync()

    return () => {
      listeners.delete(setRoutes)
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
