'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, BadgeCheck, CheckCircle2, Layers3, Sparkles } from 'lucide-react'
import type { AboutPageContent } from '@/lib/aboutData'
import { getAboutPath } from '@/lib/aboutData'

type AboutPageClientProps = {
  pages: AboutPageContent[]
  page: AboutPageContent
}

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export default function AboutPageClient({ pages, page }: AboutPageClientProps) {
  return (
    <main className="bg-white text-[#111111]">
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <motion.div
          className="absolute left-0 top-0 h-1.5 w-full bg-brand-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
        />

        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
            <motion.p variants={fadeInUp} className="text-sm font-black uppercase tracking-[0.22em] text-brand-600">
              {page.eyebrow}
            </motion.p>
            <motion.h1 variants={fadeInUp} className="mt-3 max-w-4xl text-3xl font-black uppercase leading-tight text-[#111111] sm:text-5xl lg:text-6xl">
              {page.title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-4 max-w-3xl text-base font-semibold leading-8 text-gray-600">
              {page.hero}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -8 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 0.12 }}
            className="[perspective:1000px]"
          >
            <motion.div
              whileHover={{ rotateX: 4, rotateY: -5, y: -8 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="border border-brand-100 bg-white p-6 shadow-xl shadow-brand-100/60 [transform-style:preserve-3d]"
            >
              <div className="flex items-center gap-3 border-b border-line pb-5">
                <div className="flex h-12 w-12 items-center justify-center bg-brand-50 text-brand-600">
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="text-sm font-black uppercase text-[#111111]">{page.description}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-600">Radicon Laboratories Ltd</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {page.highlights.slice(0, 4).map((highlight, index) => (
                  <motion.div
                    key={highlight}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.08 }}
                    className="flex gap-2 bg-surface px-3 py-3"
                  >
                    <BadgeCheck size={18} className="mt-0.5 shrink-0 text-brand-600" />
                    <p className="text-xs font-black uppercase leading-5 text-[#111111]">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.nav
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="mb-8 border border-line bg-white p-3 shadow-sm"
            aria-label="About pages"
          >
            <div className="flex gap-3 overflow-x-auto pb-1">
              {pages.map((item) => (
                <Link
                  key={item.slug || 'who-we-are'}
                  href={getAboutPath(item.slug)}
                  className={`group flex min-w-max items-center justify-between gap-3 px-4 py-3 text-xs font-black uppercase leading-5 transition ${
                    item.slug === page.slug
                      ? 'bg-brand-600 text-white'
                      : 'text-[#111111] hover:bg-brand-50 hover:text-brand-600'
                  }`}
                >
                  {item.title}
                  <ArrowUpRight size={17} className="shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </div>
          </motion.nav>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            transition={{ staggerChildren: 0.12 }}
            className="mb-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"
          >
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className="relative aspect-[16/9] overflow-hidden border border-brand-100 bg-surface shadow-sm [transform-style:preserve-3d]"
            >
              <Image
                src={page.images[0]}
                alt={`${page.title} Radicon Laboratories`}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white">Radicon Laboratories Ltd</p>
                <h2 className="mt-2 text-xl font-black uppercase leading-tight text-white sm:text-2xl">{page.title}</h2>
              </div>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {page.images.slice(1, 3).map((image, index) => (
                <motion.div
                  key={image}
                  variants={fadeInUp}
                  whileHover={{ y: -6, rotateX: -2, rotateY: 3 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className="relative aspect-[4/3] overflow-hidden border border-brand-100 bg-surface shadow-sm [transform-style:preserve-3d]"
                >
                  <Image
                    src={image}
                    alt={`${page.title} section image ${index + 2}`}
                    fill
                    sizes="(min-width: 1024px) 34vw, 100vw"
                    className="object-cover transition duration-700 hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          <article>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="border-l-4 border-brand-600 bg-white pl-5"
            >
              <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-600">
                Radicon Laboratories
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-[#111111] sm:text-4xl">
                {page.description}
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              transition={{ staggerChildren: 0.1 }}
              className="mt-7 grid gap-5"
            >
              {page.sections.map((section) => (
                <motion.div
                  key={section.heading}
                  variants={fadeInUp}
                  whileHover={{ y: -6, rotateX: 1.5, rotateY: -1.5 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className="border border-line bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-xl hover:shadow-brand-100/70 [transform-style:preserve-3d]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-brand-50 text-brand-600">
                      <Layers3 size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase text-[#111111]">{section.heading}</h3>
                      <p className="mt-3 text-sm font-semibold leading-7 text-gray-600">{section.body}</p>
                    </div>
                  </div>
                  {section.points?.length ? (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {section.points.map((point) => (
                        <div key={point} className="flex gap-3 bg-surface p-3">
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-600" />
                          <p className="text-xs font-black uppercase leading-5 text-[#111111]">{point}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ staggerChildren: 0.08 }}
              className="mt-7 grid gap-3 sm:grid-cols-2"
            >
              {page.highlights.map((highlight) => (
                <motion.div
                  key={highlight}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="flex gap-3 border border-line bg-surface p-4 transition hover:border-brand-300 hover:bg-brand-50"
                >
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-brand-600" />
                  <p className="text-sm font-black uppercase leading-6 text-[#111111]">{highlight}</p>
                </motion.div>
              ))}
            </motion.div>
          </article>
        </div>
      </section>
    </main>
  )
}
