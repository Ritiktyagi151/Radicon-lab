'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  Factory,
  GraduationCap,
  Mail,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react'

const departments = [
  {
    title: 'Production',
    description: 'Work with disciplined manufacturing workflows for tablets, capsules, ointments, syrups, injectables, and oral strips.',
    icon: Factory,
  },
  {
    title: 'Quality Assurance',
    description: 'Support documentation, quality checks, compliance practices, and batch consistency across finished formulations.',
    icon: ShieldCheck,
  },
  {
    title: 'Research & Development',
    description: 'Contribute to formulation support, product improvement, and technical coordination for pharmaceutical products.',
    icon: GraduationCap,
  },
  {
    title: 'Business Development',
    description: 'Help pharma brands with third party manufacturing, export discussions, commercial planning, and client communication.',
    icon: BriefcaseBusiness,
  },
]

const hiringSteps = [
  'Share your resume with department preference and experience details.',
  'Our HR or business team reviews your profile against active requirements.',
  'Shortlisted candidates are contacted for the next round and documentation.',
]

const culturePoints = [
  'Quality-first pharmaceutical work environment',
  'Team collaboration across plant and business teams',
  'Learning opportunities in manufacturing operations',
  'Structured processes and practical responsibility',
]

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export default function CareerPageClient() {
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
              Careers
            </motion.p>
            <motion.h1 variants={fadeInUp} className="mt-4 max-w-4xl text-3xl font-black leading-tight text-black sm:text-5xl lg:text-6xl">
              Build your future with Radicon Laboratories
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-5 max-w-3xl text-base font-semibold leading-8 text-gray-600">
              Join a pharmaceutical manufacturing team focused on quality, reliable production,
              practical innovation, and long-term business relationships.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:contact@radiconlab.com?subject=Career%20Application%20-%20Radicon%20Laboratories"
                className="inline-flex w-full items-center justify-center gap-2 bg-[#DF1F26] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-brand-800 sm:w-auto"
              >
                Send Resume
                <ArrowRight size={18} />
              </a>
              <a
                href="#career-process"
                className="inline-flex w-full items-center justify-center gap-2 border border-brand-200 bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition hover:border-[#DF1F26] hover:text-[#DF1F26] sm:w-auto"
              >
                Hiring Process
                <ClipboardCheck size={18} />
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
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-black">Who We Look For</p>
                <p className="mt-1 text-sm font-semibold text-gray-600">Responsible, detail-oriented pharma professionals</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {culturePoints.map((point, index) => (
                <motion.div
                  key={point}
                  className="flex gap-3"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.1 }}
                >
                  <BadgeCheck size={20} className="mt-0.5 shrink-0 text-[#DF1F26]" />
                  <p className="text-sm font-bold leading-6 text-gray-700">{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.08 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {departments.map(({ title, description, icon: Icon }) => (
            <motion.article
              key={title}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="border border-brand-100 bg-white p-5 shadow-sm transition hover:border-[#DF1F26]"
            >
              <div className="flex h-11 w-11 items-center justify-center bg-brand-50 text-[#DF1F26]">
                <Icon size={22} />
              </div>
              <h2 className="mt-5 text-lg font-black uppercase text-black">{title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-gray-600">{description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="career-process" className="bg-[#eaeef3] py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#DF1F26]">Hiring Process</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black sm:text-4xl">
              Simple steps to apply
            </h2>
            <p className="mt-5 text-base font-semibold leading-8 text-gray-600">
              We welcome applications from experienced professionals and motivated candidates who
              want to grow inside pharmaceutical manufacturing and business operations.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ staggerChildren: 0.12 }}
            className="space-y-4"
          >
            {hiringSteps.map((step, index) => (
              <motion.div key={step} variants={fadeInUp} className="flex gap-4 bg-white p-5 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#DF1F26] text-sm font-black text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-bold leading-7 text-gray-700">{step}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid gap-6 border border-brand-100 bg-white p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center"
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#DF1F26]">Apply Now</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black">
              Send your resume to Radicon Laboratories
            </h2>
            <div className="mt-4 grid gap-3 text-sm font-bold leading-6 text-gray-600 sm:grid-cols-2">
              <p className="flex gap-2">
                <Mail size={18} className="mt-1 shrink-0 text-[#DF1F26]" />
                contact@radiconlab.com
              </p>
              <p className="flex gap-2">
                <MapPin size={18} className="mt-1 shrink-0 text-[#DF1F26]" />
                Greater Noida, U.P. India
              </p>
            </div>
          </div>
          <a
            href="mailto:contact@radiconlab.com?subject=Career%20Application%20-%20Radicon%20Laboratories"
            className="inline-flex items-center justify-center gap-2 bg-[#DF1F26] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-brand-800"
          >
            Email Resume
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </section>
    </main>
  )
}
