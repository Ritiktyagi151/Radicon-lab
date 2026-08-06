'use client'

import Image, { type StaticImageData } from 'next/image'
import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'

export const EVENT_POPUP_OPEN_EVENT = 'radicon:event-popup-open'

type EventPopupProps = {
  image: string | StaticImageData
  imageAlt?: string
  imageHref?: string
  maxShows?: number
  reopenDelay?: number
  useNextImage?: boolean
  priority?: boolean
}

const EXIT_ANIMATION_MS = 220

export default function EventPopup({
  image,
  imageAlt = 'IPHEX 2026 promotional event banner',
  imageHref,
  maxShows = 5,
  reopenDelay = 12000,
  useNextImage = true,
  priority = true,
}: EventPopupProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const isOpenRef = useRef(false)
  const showCountRef = useRef(0)
  const reopenTimerRef = useRef<number | null>(null)
  const exitTimerRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (reopenTimerRef.current) {
      window.clearTimeout(reopenTimerRef.current)
      reopenTimerRef.current = null
    }

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current)
      exitTimerRef.current = null
    }
  }, [])

  const openPopup = useCallback(() => {
    if (showCountRef.current >= maxShows) return

    showCountRef.current += 1
    setIsMounted(true)

    window.requestAnimationFrame(() => {
      setIsOpen(true)
    })
  }, [maxShows])

  const openPopupFromButton = useCallback(() => {
    if (isOpenRef.current) return

    clearTimers()
    setIsMounted(true)

    window.requestAnimationFrame(() => {
      setIsOpen(true)
    })
  }, [clearTimers])

  const closePopup = useCallback(() => {
    if (!isOpen) return

    setIsOpen(false)

    exitTimerRef.current = window.setTimeout(() => {
      setIsMounted(false)
    }, EXIT_ANIMATION_MS)

    if (showCountRef.current < maxShows) {
      reopenTimerRef.current = window.setTimeout(() => {
        openPopup()
      }, reopenDelay)
    }
  }, [isOpen, maxShows, openPopup, reopenDelay])

  useEffect(() => {
    openPopup()

    return () => {
      clearTimers()
    }
  }, [clearTimers, openPopup])

  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    window.addEventListener(EVENT_POPUP_OPEN_EVENT, openPopupFromButton)

    return () => {
      window.removeEventListener(EVENT_POPUP_OPEN_EVENT, openPopupFromButton)
    }
  }, [openPopupFromButton])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopup()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closePopup, isOpen])

  if (!isMounted) return null

  const banner = (
    <div className="flex max-h-[calc(100dvh-32px)] max-w-[calc(100vw-24px)] items-center justify-center overflow-hidden bg-white">
      {useNextImage ? (
        <div className="relative aspect-[4/5] h-[calc(100dvh-32px)] max-h-[860px] w-[calc((100dvh-32px)*0.8)] max-w-[calc(100vw-24px)]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 96vw, 680px"
            className="object-contain"
          />
        </div>
      ) : (
        // The plain img fallback is intentional for projects that do not want next/image here.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={typeof image === 'string' ? image : image.src}
          alt={imageAlt}
          className="block h-auto max-h-[calc(100dvh-32px)] w-auto max-w-[calc(100vw-24px)] object-contain"
        />
      )}
    </div>
  )

  const popup = (
    <div
      className={`fixed inset-0 z-[2147483647] flex h-dvh items-center justify-center bg-black/70 p-3 transition-opacity duration-200 sm:p-4 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden={!isOpen}
      onClick={closePopup}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="IPHEX 2026 event promotion"
        className={`relative max-h-[calc(100dvh-32px)] max-w-[calc(100vw-24px)] overflow-hidden rounded-[8px] border border-white/20 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.35)] transition duration-200 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close event popup"
          onClick={closePopup}
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-slate-950/75 text-2xl leading-none text-white shadow-lg backdrop-blur transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <span aria-hidden="true" className="-mt-0.5">
            &times;
          </span>
        </button>

        {imageHref ? (
          <a href={imageHref} target="_blank" rel="noreferrer" aria-label="Open IPHEX 2026 event details" className="block">
            {banner}
          </a>
        ) : (
          banner
        )}
      </section>
    </div>
  )

  return createPortal(popup, document.body)
}
