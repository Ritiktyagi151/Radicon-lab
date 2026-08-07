'use client'

import { FormEvent, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Factory,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
} from 'lucide-react'
import { API_BASE_URL } from '@/lib/admin/api'
import { RecaptchaCheckbox, type RecaptchaCheckboxHandle } from '@/lib/recaptcha'

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
    label: 'Contact ',
    value: '+91 8796911105',
    detail: 'info@radiconlab.com',
    href: 'tel:+918796911105',
    emailHref: 'mailto:info@radiconlab.com',
    icon: Phone,
  },
  // {
  //   label: 'For Merchant Exports',
  //   value: '+91 8796911105',
  //   detail: 'bdm@radiconlab.com',
  //   href: 'tel:+918796911105',
  //   emailHref: 'mailto:bdm@radiconlab.com',
  //   icon: Mail,
  // },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export default function ContactPageClient() {
  const [form, setForm] = useState<FormState>(initialFormState)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const recaptchaRef = useRef<RecaptchaCheckboxHandle>(null)

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setStatusMessage('')

    try {
      if (!recaptchaToken) {
        setStatus('error')
        setStatusMessage('Please complete the reCAPTCHA verification.')
        return
      }

      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.message || 'Unable to submit inquiry right now.')
      }

      setForm(initialFormState)
      setRecaptchaToken('')
      recaptchaRef.current?.reset()
      setStatus('success')
      setStatusMessage('Thank you. Your inquiry has been sent to the Radicon team.')
    } catch (error) {
      setStatus('error')
      setStatusMessage(error instanceof Error ? error.message : 'Unable to submit inquiry right now.')
    }
  }

  return (
    <main className="bg-white text-[#111827]">
      <section className="relative min-h-[430px] overflow-hidden border-b border-brand-100 bg-[#F0F8FF] sm:min-h-[500px] lg:min-h-[560px]">
        <Image
          src="/homepage-banner/contactus.png"
          alt="Contact Radicon Laboratories"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-[64%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/20" />
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-t from-white/70 via-transparent to-transparent lg:hidden" />
        <motion.div
          className="absolute left-0 top-0 z-10 h-1.5 w-full bg-[#DF1F26]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
        />

        <div className="relative z-10 mx-auto flex min-h-[430px] max-w-7xl items-center px-4 py-14 sm:min-h-[500px] sm:px-6 lg:min-h-[560px] lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.12 }}
            className="max-w-2xl"
          >
            <motion.p variants={fadeInUp} className="text-sm font-black uppercase tracking-[0.24em] text-[#DF1F26]">
              Contact Radicon Lab
            </motion.p>
            <motion.h1 variants={fadeInUp} className="mt-4 text-3xl font-black leading-tight text-black sm:text-4xl lg:text-5xl">
              Talk to our pharmaceutical manufacturing team
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-5 max-w-xl text-base font-semibold leading-8 text-gray-700">
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
                href="https://wa.me/919289611886"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 border border-brand-200 bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition hover:border-[#DF1F26] hover:text-[#DF1F26] sm:w-auto"
              >
                WhatsApp
                <Phone size={18} />
              </a>
            </motion.div>
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
          {contactMethods.map(({ label, value, detail, href, emailHref, icon: Icon }) => (
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
              {detail ? (
                emailHref ? (
                  <span
                    onClick={(event) => {
                      event.preventDefault()
                      window.location.href = emailHref
                    }}
                    className="mt-2 block text-xs font-bold leading-5 text-gray-500 transition hover:text-[#DF1F26]"
                  >
                    {detail}
                  </span>
                ) : (
                  <p className="mt-2 text-xs font-bold leading-5 text-gray-500">{detail}</p>
                )
              ) : null}
            </motion.a>
          ))}
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="overflow-hidden border border-brand-100 bg-white shadow-sm"
        >
          <div className="grid gap-0 lg:grid-cols-[0.42fr_0.58fr]">
            <div className="bg-[#F0F8FF] p-5 sm:p-7 lg:p-8">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#DF1F26]">Find Us</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-black sm:text-4xl">
                Visit Radicon Laboratories
              </h2>
              <p className="mt-4 text-base font-semibold leading-8 text-gray-600">
                Industrial Plot No. 108-A Ecotech-XII Greater Noida, U.P. India-201306
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Industrial%20Plot%20No.%20108-A%20Ecotech-XII%20Greater%20Noida%20U.P.%20India%20201306"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#DF1F26] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-brand-800 sm:w-auto"
              >
                Open In Maps
                <MapPin size={18} />
              </a>
            </div>
            <div className="min-h-[320px] lg:min-h-[430px]">
              <iframe
                title="Radicon Laboratories location map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.9490786249335!2d77.45488619999999!3d28.601304400000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cee6242e0bb79%3A0x955b11d39c5eaad8!2sRadicon%20Laboratories%20Ltd!5e0!3m2!1sen!2sin!4v1779540730501!5m2!1sen!2sin"
                className="h-[320px] w-full border-0 sm:h-[380px] lg:h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
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

            <RecaptchaCheckbox
              ref={recaptchaRef}
              onVerify={setRecaptchaToken}
              className="mt-5"
            />

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
