'use client'

import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Factory,
  Headphones,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
} from 'lucide-react'
import { API_BASE_URL } from '@/lib/admin/api'

type FormState = {
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
}

const initialFormState: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
}

const contactMethods = [
  {
    label: 'Head Office Location',
    value: 'No-159/8, Ground Floor, Bhagirath Palace, Chandni Chowk Near Diwan Hall, New Delhi, India-110006',
    href: 'https://www.google.com/maps/search/?api=1&query=No-159%2F8%20Ground%20Floor%20Bhagirath%20Palace%20Chandni%20Chowk%20Near%20Diwan%20Hall%20New%20Delhi%20110006',
    icon: MapPin,
  },
  {
    label: 'Manufacturing Plant',
    value: 'Industrial Plot No. 108-A Ecotech-XII Greater Noida, U.P. India- 201306',
    href: 'https://www.google.com/maps/search/?api=1&query=Industrial%20Plot%20No.%20108-A%20Ecotech-XII%20Greater%20Noida%20U.P.%20India%20201306',
    icon: Factory,
  },
  {
    label: 'Customer Support',
    value: '+91 8796911105',
    detail: 'Give us a free call 24/7',
    href: 'tel:+918796911105',
    icon: Headphones,
  },
  {
    label: 'Email Us',
    value: 'contact@radiconlab.com',
    detail: 'bdm@radiconlab.com',
    href: 'mailto:contact@radiconlab.com',
    icon: Mail,
  },
  {
    label: 'Export Support',
    value: '+91 8796911105',
    detail: '+0120-463-32-71 | Give us a free call 24/7',
    href: 'tel:+918796911105',
    icon: Phone,
  },
  {
    label: 'WhatsApp',
    value: '+91 8796911105',
    href: 'https://wa.me/918796911105',
    icon: MessageSquareText,
  },
]

const inquirySteps = [
  'Share product category, dosage form, and target market.',
  'Mention batch quantity, packaging needs, and timeline.',
  'Our team reviews feasibility and responds with the next steps.',
]

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export default function ContactPageClient() {
  const [form, setForm] = useState<FormState>(initialFormState)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setStatusMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.message || 'Unable to submit inquiry right now.')
      }

      setForm(initialFormState)
      setStatus('success')
      setStatusMessage('Thank you. Your inquiry has been sent to the Radicon team.')
    } catch (error) {
      setStatus('error')
      setStatusMessage(error instanceof Error ? error.message : 'Unable to submit inquiry right now.')
    }
  }

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

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
            <motion.p variants={fadeInUp} className="text-sm font-black uppercase tracking-[0.24em] text-[#DF1F26]">
              Contact Radicon Lab
            </motion.p>
            <motion.h1 variants={fadeInUp} className="mt-4 max-w-4xl text-3xl font-black leading-tight text-black sm:text-5xl lg:text-6xl">
              Talk to our pharmaceutical manufacturing team
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-5 max-w-3xl text-base font-semibold leading-8 text-gray-600">
              Share your manufacturing, third party production, packaging, export, or product
              development requirement. We will route your inquiry to the right business desk.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact-form"
                className="inline-flex w-full items-center justify-center gap-2 bg-[#DF1F26] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-brand-800 sm:w-auto"
              >
                Send Inquiry
                <ArrowRight size={18} />
              </a>
              <a
                href="https://wa.me/918796911105"
                className="inline-flex w-full items-center justify-center gap-2 border border-brand-200 bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition hover:border-[#DF1F26] hover:text-[#DF1F26] sm:w-auto"
              >
                WhatsApp
                <Phone size={18} />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="border border-brand-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 border-b border-brand-100 pb-5">
              <div className="flex h-12 w-12 items-center justify-center bg-brand-50 text-[#DF1F26]">
                <Clock3 size={24} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-black">Inquiry Desk</p>
                <p className="mt-1 text-sm font-semibold text-gray-600">Manufacturing and business support</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {inquirySteps.map((step, index) => (
                <motion.div
                  key={step}
                  className="flex gap-3"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.12 }}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#DF1F26] text-xs font-black text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-bold leading-6 text-gray-700">{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.08 }}
        >
          {contactMethods.map(({ label, value, detail, href, icon: Icon }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer' : undefined}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="group border border-brand-100 bg-white p-5 shadow-sm transition hover:border-[#DF1F26]"
            >
              <div className="flex h-11 w-11 items-center justify-center bg-brand-50 text-[#DF1F26] transition group-hover:bg-[#DF1F26] group-hover:text-white">
                <Icon size={22} />
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#DF1F26]">{label}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-black">{value}</p>
              {detail ? <p className="mt-2 text-xs font-bold leading-5 text-gray-500">{detail}</p> : null}
            </motion.a>
          ))}
        </motion.div>
      </section>

      <section className="bg-[#eaeef3] py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#DF1F26]">Get In Touch</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black sm:text-4xl">
              Send your requirement directly to our team
            </h2>
            <p className="mt-5 text-base font-semibold leading-8 text-gray-600">
              For faster response, include dosage form, molecule or product category, expected order
              size, preferred packaging, and delivery timeline.
            </p>

            <div className="mt-7 space-y-3">
              {[
                'Third party manufacturing inquiries',
                'Finished formulation and packaging discussion',
                'Export, supply, and business collaboration',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-white px-4 py-3">
                  <CheckCircle2 size={20} className="shrink-0 text-[#DF1F26]" />
                  <p className="text-sm font-black uppercase leading-6 text-black">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            id="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="border border-brand-100 bg-white p-5 shadow-sm sm:p-7"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black uppercase text-black">Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className="mt-2 w-full border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-black uppercase text-black">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className="mt-2 w-full border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block">
                <span className="text-sm font-black uppercase text-black">Phone</span>
                <input
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  className="mt-2 w-full border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="Phone number"
                />
              </label>
              <label className="block">
                <span className="text-sm font-black uppercase text-black">Company</span>
                <input
                  value={form.company}
                  onChange={(event) => updateField('company', event.target.value)}
                  className="mt-2 w-full border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="Company name"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-black uppercase text-black">Subject</span>
                <input
                  required
                  value={form.subject}
                  onChange={(event) => updateField('subject', event.target.value)}
                  className="mt-2 w-full border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="Manufacturing inquiry"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-black uppercase text-black">Message</span>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  className="mt-2 w-full resize-none border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="Tell us about product category, quantity, packaging, and timeline."
                />
              </label>
            </div>

            {statusMessage ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 flex items-center gap-2 text-sm font-bold ${
                  status === 'success' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                <MessageSquareText size={17} />
                {statusMessage}
              </motion.p>
            ) : null}

            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileHover={{ y: status === 'sending' ? 0 : -2 }}
              whileTap={{ scale: status === 'sending' ? 1 : 0.98 }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#DF1F26] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {status === 'sending' ? 'Sending...' : 'Submit Inquiry'}
              <Send size={18} />
            </motion.button>
          </motion.form>
        </div>
      </section>
    </main>
  )
}
