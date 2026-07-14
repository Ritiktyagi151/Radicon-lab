'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
const scriptId = 'google-recaptcha-v2'

type Grecaptcha = {
  render?: (
    container: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
    },
  ) => number
  reset?: (widgetId?: number) => void
}

export type RecaptchaCheckboxHandle = {
  reset: () => void
}

type RecaptchaCheckboxProps = {
  onVerify: (token: string) => void
  className?: string
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha
  }
}

function hasRecaptchaRender() {
  return typeof window.grecaptcha?.render === 'function'
}

function waitForRecaptchaRender(timeoutMs = 10000) {
  return new Promise<void>((resolve, reject) => {
    const startedAt = Date.now()

    const check = () => {
      if (hasRecaptchaRender()) {
        resolve()
        return
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('Unable to initialize reCAPTCHA checkbox.'))
        return
      }

      window.setTimeout(check, 100)
    }

    check()
  })
}

function loadRecaptchaScript() {
  if (!siteKey) {
    return Promise.reject(new Error('reCAPTCHA site key is not configured.'))
  }

  if (typeof window === 'undefined') {
    return Promise.reject(new Error('reCAPTCHA is available only in the browser.'))
  }

  if (hasRecaptchaRender()) return Promise.resolve()

  const existingScript = document.getElementById(scriptId)
  if (existingScript) {
    return new Promise<void>((resolve, reject) => {
      existingScript.addEventListener('load', () => {
        waitForRecaptchaRender().then(resolve).catch(reject)
      }, { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Unable to load reCAPTCHA.')), { once: true })

      if ((existingScript as HTMLScriptElement).dataset.loaded === 'true') {
        waitForRecaptchaRender().then(resolve).catch(reject)
      }
    })
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true'
      waitForRecaptchaRender().then(resolve).catch(reject)
    }, { once: true })
    script.addEventListener('error', () => reject(new Error('Unable to load reCAPTCHA.')), { once: true })
    document.head.appendChild(script)
  })
}

export const RecaptchaCheckbox = forwardRef<RecaptchaCheckboxHandle, RecaptchaCheckboxProps>(
  function RecaptchaCheckbox({ onVerify, className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<number | null>(null)
    const onVerifyRef = useRef(onVerify)
    const [error, setError] = useState('')

    onVerifyRef.current = onVerify

    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          if (widgetIdRef.current !== null) {
            window.grecaptcha?.reset?.(widgetIdRef.current)
          }
          onVerifyRef.current('')
        },
      }),
      [],
    )

    useEffect(() => {
      let isMounted = true

      loadRecaptchaScript()
        .then(() => {
          if (!isMounted || !containerRef.current || widgetIdRef.current !== null || !siteKey) return

          const render = window.grecaptcha?.render
          if (!render) {
            setError('Unable to initialize reCAPTCHA checkbox.')
            return
          }

          widgetIdRef.current = render(containerRef.current, {
            sitekey: siteKey,
            callback: (token) => {
              setError('')
              onVerifyRef.current(token)
            },
            'expired-callback': () => onVerifyRef.current(''),
            'error-callback': () => {
              onVerifyRef.current('')
              setError('Unable to load reCAPTCHA. Please try again.')
            },
          })
        })
        .catch((loadError) => {
          if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Unable to load reCAPTCHA.')
        })

      return () => {
        isMounted = false
      }
    }, [])

    return (
      <div className={className}>
        <div ref={containerRef} />
        {error ? <p className="mt-2 text-sm font-bold text-red-700">{error}</p> : null}
      </div>
    )
  },
)

export async function executeRecaptcha() {
  throw new Error('Please complete the reCAPTCHA verification.')
}
