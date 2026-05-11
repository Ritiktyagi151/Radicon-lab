'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useSeoRoutes } from '@/lib/admin/useSeoRoutes'

const BANNERS = [
  {
    id: 1,
    image: "/homepage-banner/banner.jpeg",
    title: "Trusted pharmaceutical manufacturing partner in India.",
    subtitle: "Radicon Laboratories Ltd",
    desc: "Scalable pharma manufacturing solutions for tablets, capsules, and oral strips."
  },
  {
    id: 2,
    image: "/homepage-banner/banner2.jpeg", 
    title: "World-class GMP Certified Facilities.",
    subtitle: "Quality Assurance",
    desc: "Maintaining the highest standards in every batch we produce."
  },
  {
    id: 3,
    image: "/homepage-banner/banner3.jpeg",
    title: "Innovative Research & Development.",
    subtitle: "R&D Excellence",
    desc: "Pioneering new formulations to meet global healthcare needs."
  },
  {
    id: 4,
    image: "https://www.healthychildren.org/SiteCollectionImagesArticleImages/dose-of-cough-syrup.jpg?RenditionID=3",
    title: "Global Export & Distribution.",
    subtitle: "Our Presence",
    desc: "Delivering life-saving medicines across continents with precision."
  }
]

export default function Hero() {
  const { hrefFor } = useSeoRoutes()

  const [current, setCurrent] = useState(0)

  // Auto-slide logic (every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1))
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[560px] w-full overflow-hidden  sm:h-[640px] lg:h-[700px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <img
            src={BANNERS[current].image}
            alt="Banner"
            className="h-full w-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-white/5" /> */}
          <div className="absolute inset-0 bg-white/15" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl pt-10 sm:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                {BANNERS[current].subtitle}
              </p>
              
              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-[#111111] sm:text-5xl lg:text-7xl">
                {BANNERS[current].title}
              </h1>
              
              <p className="mt-5 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg">
                {BANNERS[current].desc}
              </p>

              <div className="mt-10 flex flex-wrap gap-4 [perspective:900px]">
                <motion.div whileHover={{ y: -5, rotateX: 8, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href={hrefFor('/contact')} className="inline-flex rounded-full bg-[#DF1F26] px-6 py-3 text-xs font-bold uppercase text-white transition hover:opacity-90 hover:shadow-xl hover:shadow-gray-300 sm:px-8 sm:py-4 sm:text-sm">
                  Contact Us
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -5, rotateX: 8, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href={hrefFor('/services')} className="inline-flex rounded-full border-2 border-[#E8E8E8] px-6 py-3 text-xs font-bold uppercase text-gray-700 transition hover:bg-[#F0F8FF] hover:shadow-xl hover:shadow-gray-200 sm:px-8 sm:py-4 sm:text-sm">
                  View Services
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 transition-all duration-300 rounded-full ${
              current === index ? "w-8 bg-gray-500" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_50%_110%,rgba(240,248,255,0.95)_0_48%,transparent_49%)] opacity-90" />
    </section>
  )
}
