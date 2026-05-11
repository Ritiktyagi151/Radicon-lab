'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'

type Toast = {
  id: number
  message: string
  type: 'success' | 'error'
}

type ToastContextValue = {
  showToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextToastId = useRef(0)

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast: (message, type = 'success') => {
        nextToastId.current += 1
        const id = nextToastId.current
        setToasts((current) => [...current, { id, message, type }])
        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id))
        }, 3200)
      },
    }),
    [],
  )

  useEffect(() => {
    const handleApiError = (event: Event) => {
      const message = event instanceof CustomEvent ? event.detail : 'Backend request failed'
      value.showToast(String(message), 'error')
    }

    window.addEventListener('backend-api-error', handleApiError)
    return () => window.removeEventListener('backend-api-error', handleApiError)
  }, [value])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] w-[min(92vw,380px)] space-y-3">
        {toasts.map((toast) => {
          const Icon = toast.type === 'success' ? CheckCircle2 : XCircle

          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 rounded-2xl border bg-white/90 px-4 py-3 text-sm font-black shadow-2xl backdrop-blur-xl ${
                toast.type === 'success'
                  ? 'border-brand-100 text-brand-700'
                  : 'border-brand-100 text-brand-700'
              }`}
            >
              <Icon size={18} />
              {toast.message}
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
