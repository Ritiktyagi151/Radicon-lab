'use client'

import { useEffect, useRef, useState } from 'react'
import { API_BASE_URL } from './api'

export type RealtimeResource =
  | 'blogs'
  | 'categories'
  | 'products'
  | 'contacts'
  | 'seo'
  | 'site-settings'
  | 'system'

export type RealtimeEvent = {
  resource: RealtimeResource
  action: string
  message: string
  timestamp: string
}

type UseRealtimeOptions = {
  resources?: RealtimeResource[]
  onEvent?: (event: RealtimeEvent) => void
  onError?: () => void
  onOpen?: () => void
}

export function useRealtimeUpdates({
  resources,
  onEvent,
  onError,
  onOpen,
}: UseRealtimeOptions) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const callbacks = useRef({ onEvent, onError, onOpen, resources })

  useEffect(() => {
    callbacks.current = { onEvent, onError, onOpen, resources }
  }, [onEvent, onError, onOpen, resources])

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/realtime/events`, {
      withCredentials: true,
    })

    eventSource.onopen = () => {
      setStatus('connected')
      callbacks.current.onOpen?.()
    }

    eventSource.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as RealtimeEvent
        const subscribedResources = callbacks.current.resources
        if (
          subscribedResources?.length &&
          event.resource !== 'system' &&
          !subscribedResources.includes(event.resource)
        ) {
          return
        }
        callbacks.current.onEvent?.(event)
      } catch {
        setStatus('disconnected')
        callbacks.current.onError?.()
      }
    }

    eventSource.onerror = () => {
      setStatus('disconnected')
      callbacks.current.onError?.()
    }

    return () => eventSource.close()
  }, [])

  return status
}
