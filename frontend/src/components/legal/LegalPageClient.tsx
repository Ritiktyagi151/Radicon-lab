'use client'

import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Clock3, FileText, Mail, ShieldCheck } from 'lucide-react'

type LegalSection = {
  title: string
  body: string
  points?: string[]
}

type LegalPageClientProps = {
  eyebrow: string
  title: string
  description: string
  updatedAt: string
  sections: LegalSection[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export default function LegalPageClient({
  eyebrow,
  title,
  description,
  updatedAt,
  sections,
}: LegalPageClientProps) {
  return (
    <main className="bg-white text-[#111827]">
      <section className="relative overflow-hidden border-b border-brand-100 bg-[#F0F8FF]">
        <motion.div
          className="absolute left-0 top-0 h-1.5 w-full bg-[#DF1F26]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
            <motion.p variants={fadeInUp} className="text-sm font-black uppercase tracking-[0.24em] text-[#DF1F26]">
              {eyebrow}
            </motion.p>
            <motion.h1 variants={fadeInUp} className="mt-4 max-w-4xl text-3xl font-black leading-tight text-black sm:text-5xl lg:text-6xl">
              {title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-5 max-w-3xl text-base font-semibold leading-8 text-gray-600">
              {description}
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
              <a
                href="#legal-details"
                className="inline-flex w-full items-center justify-center gap-2 bg-[#DF1F26] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-brand-800 sm:w-auto"
              >
                Read Details
                <ArrowRight size={18} />
              </a>
              <a
                href="mailto:contact@radiconlab.com"
                className="inline-flex w-full items-center justify-center gap-2 border border-brand-200 bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition hover:border-[#DF1F26] hover:text-[#DF1F26] sm:w-auto"
              >
                Contact Us
                <Mail size={18} />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 42 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="border border-brand-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 border-b border-brand-100 pb-5">
              <div className="flex h-12 w-12 items-center justify-center bg-brand-50 text-[#DF1F26]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-black">Radicon Laboratories</p>
                <p className="mt-1 text-sm font-semibold text-gray-600">Policy information for website visitors and business inquiries</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4">
              <div className="flex gap-3">
                <Clock3 size={20} className="mt-0.5 shrink-0 text-[#DF1F26]" />
                <p className="text-sm font-bold leading-6 text-gray-700">Last updated: {updatedAt}</p>
              </div>
              <div className="flex gap-3">
                <FileText size={20} className="mt-0.5 shrink-0 text-[#DF1F26]" />
                <p className="text-sm font-bold leading-6 text-gray-700">
                  This page explains important website, inquiry, communication, and business-use terms.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="legal-details" className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.32fr_0.68fr] lg:px-8">
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="h-max border border-brand-100 bg-[#F0F8FF] p-5"
        >
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#DF1F26]">Contents</p>
          <nav className="mt-5 space-y-3">
            {sections.map((section, index) => (
              <a
                key={section.title}
                href={`#section-${index + 1}`}
                className="block border border-brand-100 bg-white px-4 py-3 text-sm font-black uppercase leading-6 text-black transition hover:border-[#DF1F26] hover:text-[#DF1F26]"
              >
                {index + 1}. {section.title}
              </a>
            ))}
          </nav>
        </motion.aside>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          transition={{ staggerChildren: 0.08 }}
          className="space-y-5"
        >
          {sections.map((section, index) => (
            <motion.article
              id={`section-${index + 1}`}
              key={section.title}
              variants={fadeInUp}
              className="scroll-mt-28 border border-brand-100 bg-white p-5 shadow-sm sm:p-6"
            >
              <h2 className="text-2xl font-black leading-tight text-black">{section.title}</h2>
              <p className="mt-4 text-base font-semibold leading-8 text-gray-600">{section.body}</p>
              {section.points?.length ? (
                <div className="mt-5 grid gap-3">
                  {section.points.map((point) => (
                    <div key={point} className="flex gap-3 bg-[#F0F8FF] px-4 py-3">
                      <BadgeCheck size={19} className="mt-0.5 shrink-0 text-[#DF1F26]" />
                      <p className="text-sm font-bold leading-6 text-gray-700">{point}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </motion.article>
          ))}
        </motion.div>
      </section>
    </main>
  )
}
