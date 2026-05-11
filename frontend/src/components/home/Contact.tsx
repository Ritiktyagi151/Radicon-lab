'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSeoRoutes } from '@/lib/admin/useSeoRoutes'

export default function Contact() {
  const { hrefFor } = useSeoRoutes()

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 [perspective:1200px]">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        whileHover={{ y: -8, rotateX: 3, rotateY: -3 }}
        className="floating-panel rounded-lg p-8 transition-shadow hover:shadow-2xl hover:shadow-blue-100/70 md:flex md:items-center md:justify-between [transform-style:preserve-3d]"
      >
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <p className="text-sm font-bold uppercase tracking-wide text-gray-500">Contact</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-950">Ready to discuss a manufacturing requirement?</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">Share your product category, batch expectations, and timeline with the team.</p>
        </motion.div>
        <Link href={hrefFor('/contact')} className="mt-6 inline-flex rounded-sm bg-[#DF1F26] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:-translate-y-1 hover:opacity-95 hover:shadow-lg hover:shadow-blue-200/50 md:mt-0">
          Get in Touch
        </Link>
      </motion.div>
    </section>
  )
}
