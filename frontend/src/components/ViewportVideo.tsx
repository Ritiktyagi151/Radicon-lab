'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, type VideoHTMLAttributes } from 'react'

type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'autoPlay' | 'children'> & {
  src: string
}

// Keep media requests out of the critical loading path and pause off-screen work.
const ViewportVideo = forwardRef<HTMLVideoElement, Props>(function ViewportVideo(
  { src, ...props }, ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useImperativeHandle(ref, () => videoRef.current!, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let visible = false
    const updatePlayback = () => {
      if (visible && !document.hidden) {
        if (!video.hasAttribute('src')) video.src = src
        void video.play().catch(() => { /* Autoplay can be blocked by browser preferences. */ })
      } else {
        video.pause()
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      updatePlayback()
    }, { threshold: 0.01 })
    observer.observe(video)
    document.addEventListener('visibilitychange', updatePlayback)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updatePlayback)
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [src])

  return <video {...props} ref={videoRef} preload="none" />
})

export default ViewportVideo
