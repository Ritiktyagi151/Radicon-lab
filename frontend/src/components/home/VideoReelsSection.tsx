'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'

const reels = [
  {
    title: 'Quality Manufacturing',
    src: '/video/reel1.mp4',
  },
  {
    title: 'Healthcare Products',
    src: '/video/reel2.mp4',
  },
  {
    title: 'Trusted Production',
    src: '/video/reel3.mp4',
  },
  {
    title: 'Radicon Care',
    src: '/video/reel4.mp4',
  },
]

export default function VideoReelsSection() {
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])

  const playWithSound = (index: number) => {
    const video = videoRefs.current[index]
    if (!video) return

    video.currentTime = 0
    video.muted = false
    video.volume = 1
    void video.play()
  }

  const playMuted = (index: number) => {
    const video = videoRefs.current[index]
    if (!video) return

    video.muted = true
    void video.play()
  }

  return (
    <section className="relative overflow-hidden bg-[#F0F8FF] px-4 py-14 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] bg-[radial-gradient(ellipse_at_16%_20%,#FFFFFF_0_18%,transparent_19%),radial-gradient(ellipse_at_82%_72%,#FFFFFF_0_14%,transparent_15%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-8 text-center sm:mb-10"
        >
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-600">
            Video Reels
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-[#111111] sm:text-3xl md:text-4xl">
            Inside Radicon Lab
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            A quick look at our healthcare products, manufacturing care, and quality-focused work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {reels.map((reel, index) => (
            <motion.article
              key={reel.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ delay: index * 0.08, duration: 0.55, ease: 'easeOut' }}
              whileHover={{ y: -8, rotateX: 2, rotateY: index % 2 === 0 ? -3 : 3 }}
              className="group relative aspect-[9/16] overflow-hidden rounded-lg border border-line bg-white shadow-[0_20px_60px_rgba(39,96,134,0.13)] [transform-style:preserve-3d]"
            >
              <video
                ref={(node) => {
                  videoRefs.current[index] = node
                }}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onMouseEnter={() => playWithSound(index)}
                onMouseLeave={() => playMuted(index)}
                onFocus={() => playWithSound(index)}
                onBlur={() => playMuted(index)}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              >
                <source src={reel.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A1426]/80 via-[#0A1426]/10 to-transparent opacity-85 transition duration-500 group-hover:opacity-55" />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                <div className="mb-3 h-1 w-12 bg-white/80" />
                <h3 className="text-base font-bold leading-tight sm:text-lg">{reel.title}</h3>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
                  <Volume2 className="h-4 w-4" />
                  <span>Hover for sound</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
