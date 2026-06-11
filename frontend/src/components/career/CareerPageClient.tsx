'use client'

import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Factory,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { API_BASE_URL } from '@/lib/admin/api'

type ApplicationFormState = {
  name: string
  email: string
  phone: string
  role: string
  qualification: string
  experience: string
  message: string
}

const initialApplicationForm: ApplicationFormState = {
  name: '',
  email: '',
  phone: '',
  role: 'Training & Internship',
  qualification: '',
  experience: '',
  message: '',
}

const hrEmail = 'garima_hr@radiconlab.com'
const hrPhone = '+91 8796911105'

const jobOpenings = [
  {
    title: 'Training & Internship',
    location: 'Greater Noida, U.P',
    experience: 'Fresher',
    industry: 'Pharmaceuticals',
    summary: 'For certification industrial training or internship.',
    details: [],
    skills: [],
    qualification: '',
  },
  {
    title: 'QC Manager',
    location: 'Greater Noida, U.P',
    experience: '12-15 Years',
    industry: 'Pharmaceuticals',
    department: 'Quality Control (API/Formulations)',
    summary:
      'We are looking for an experienced and dedicated QC Manager to join our Quality Control team with strong expertise in pharmaceutical quality control operations, analytical testing, regulatory compliance, and team management.',
    details: [
      'Manage day-to-day Quality Control laboratory operations',
      'Ensure compliance with cGMP, GLP, SOPs, and regulatory requirements',
      'Handle analytical testing of API and formulation products',
      'Review analytical reports, documentation, and validation records',
      'Lead and supervise QC team activities and performance',
      'Coordinate with production and QA departments for quality assurance',
      'Prepare for regulatory audits and inspections',
      'Maintain laboratory instruments and ensure proper calibration activities',
      'Monitor stability studies and laboratory investigations',
    ],
    skills: [
      'Strong knowledge of pharmaceutical quality control systems',
      'Hands-on experience with analytical instruments like HPLC, GC, UV, etc.',
      'Good understanding of regulatory guidelines and documentation practices',
      'Leadership and team management skills',
      'Exposure to audits and regulatory inspections',
      'Excellent communication and problem-solving abilities',
    ],
    qualification: 'M.Sc / B.Pharm / M.Pharm or relevant pharmaceutical qualification',
  },
]

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
  const [applicationForm, setApplicationForm] = useState<ApplicationFormState>(initialApplicationForm)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const updateApplicationField = (field: keyof ApplicationFormState, value: string) => {
    setApplicationForm((current) => ({ ...current, [field]: value }))
    if (status !== 'sending') {
      setStatus('idle')
      setStatusMessage('')
    }
  }

  const selectRole = (role: string) => {
    setApplicationForm((current) => ({ ...current, role }))
  }

  const handleApplicationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setStatusMessage('')

    const message = [
      `Career application for: ${applicationForm.role}`,
      `Qualification: ${applicationForm.qualification || 'Not provided'}`,
      `Experience: ${applicationForm.experience || 'Not provided'}`,
      '',
      applicationForm.message,
      '',
      `Resume should be shared by candidate at ${hrEmail}.`,
    ].join('\n')

    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: applicationForm.name,
          email: applicationForm.email,
          phone: applicationForm.phone,
          company: 'Career application',
          subject: `Career Application - ${applicationForm.role}`,
          message,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.message || 'Unable to submit application right now.')
      }

      setApplicationForm(initialApplicationForm)
      setStatus('success')
      setStatusMessage(`Thank you. Your application has been sent. Please email your updated resume to ${hrEmail}.`)
    } catch (error) {
      setStatus('error')
      setStatusMessage(error instanceof Error ? error.message : 'Unable to submit application right now.')
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
                href="#career-openings"
                className="inline-flex w-full items-center justify-center gap-2 bg-[#DF1F26] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-brand-800 sm:w-auto"
              >
                Current Openings
                <ArrowRight size={18} />
              </a>
              <a
                href="#career-apply"
                className="inline-flex w-full items-center justify-center gap-2 border border-brand-200 bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition hover:border-[#DF1F26] hover:text-[#DF1F26] sm:w-auto"
              >
                Apply Now
                <Send size={18} />
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

      <section id="career-openings" className="bg-[#F8FAFC] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.08 }}
          >
            <motion.p variants={fadeInUp} className="text-sm font-black uppercase tracking-[0.24em] text-[#DF1F26]">
              Current Job Openings
            </motion.p>
            <motion.h2 variants={fadeInUp} className="mt-3 text-3xl font-black leading-tight text-black sm:text-4xl">
              Explore opportunities and apply now
            </motion.h2>
          </motion.div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {jobOpenings.map((job) => (
              <motion.article
                key={job.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="border border-brand-100 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-100 pb-5">
                  <div>
                    <h3 className="text-2xl font-black text-black">{job.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide text-gray-600">
                      <span className="bg-[#F0F8FF] px-3 py-2">{job.location}</span>
                      <span className="bg-[#F0F8FF] px-3 py-2">{job.experience}</span>
                    </div>
                  </div>
                  <a
                    href="#career-apply"
                    onClick={() => selectRole(job.title)}
                    className="inline-flex items-center justify-center gap-2 bg-[#DF1F26] px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-brand-800"
                  >
                    Apply Now
                    <ArrowRight size={16} />
                  </a>
                </div>

                <div className="mt-5 grid gap-3 text-sm font-bold leading-6 text-gray-700 sm:grid-cols-2">
                  <p><span className="text-black">Industry:</span> {job.industry}</p>
                  {job.department ? <p><span className="text-black">Department:</span> {job.department}</p> : null}
                </div>
                <p className="mt-5 text-sm font-semibold leading-7 text-gray-600">{job.summary}</p>

                {job.details.length ? (
                  <div className="mt-6">
                    <h4 className="text-sm font-black uppercase tracking-wide text-black">Key Responsibilities</h4>
                    <div className="mt-3 grid gap-2">
                      {job.details.map((detail) => (
                        <p key={detail} className="flex gap-2 text-sm font-semibold leading-6 text-gray-600">
                          <CheckCircle2 size={17} className="mt-1 shrink-0 text-[#DF1F26]" />
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {job.skills.length ? (
                  <div className="mt-6">
                    <h4 className="text-sm font-black uppercase tracking-wide text-black">Required Skills & Expertise</h4>
                    <div className="mt-3 grid gap-2">
                      {job.skills.map((skill) => (
                        <p key={skill} className="flex gap-2 text-sm font-semibold leading-6 text-gray-600">
                          <BadgeCheck size={17} className="mt-1 shrink-0 text-[#DF1F26]" />
                          {skill}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {job.qualification ? (
                  <p className="mt-6 border-l-4 border-[#DF1F26] bg-[#F0F8FF] px-4 py-3 text-sm font-bold leading-6 text-black">
                    Qualification: {job.qualification}
                  </p>
                ) : null}
              </motion.article>
            ))}
          </div>
        </div>
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

      <section id="career-apply" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="border border-brand-100 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#DF1F26]">Apply Now</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black">
              Send your resume to Radicon Laboratories
            </h2>
            <p className="mt-4 text-base font-semibold leading-8 text-gray-600">
              Fill the application form and send your updated resume directly to HR for faster processing.
            </p>
            <div className="mt-5 grid gap-3 text-sm font-bold leading-6 text-gray-600">
              <a href={`mailto:${hrEmail}?subject=Career%20Application%20-%20Radicon%20Laboratories`} className="flex gap-2 transition hover:text-[#DF1F26]">
                <Mail size={18} className="mt-1 shrink-0 text-[#DF1F26]" />
                {hrEmail}
              </a>
              <a href="tel:+918796911105" className="flex gap-2 transition hover:text-[#DF1F26]">
                <Phone size={18} className="mt-1 shrink-0 text-[#DF1F26]" />
                {hrPhone}
              </a>
              <p className="flex gap-2">
                <MapPin size={18} className="mt-1 shrink-0 text-[#DF1F26]" />
                Greater Noida, U.P. India
              </p>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleApplicationSubmit}
            initial={{ opacity: 0, y: 30 }}
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
                  value={applicationForm.name}
                  onChange={(event) => updateApplicationField('name', event.target.value)}
                  className="mt-2 w-full border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-black uppercase text-black">Email</span>
                <input
                  required
                  type="email"
                  value={applicationForm.email}
                  onChange={(event) => updateApplicationField('email', event.target.value)}
                  className="mt-2 w-full border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block">
                <span className="text-sm font-black uppercase text-black">Phone</span>
                <input
                  required
                  value={applicationForm.phone}
                  onChange={(event) => updateApplicationField('phone', event.target.value)}
                  className="mt-2 w-full border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="Phone number"
                />
              </label>
              <label className="block">
                <span className="text-sm font-black uppercase text-black">Applying For</span>
                <select
                  value={applicationForm.role}
                  onChange={(event) => updateApplicationField('role', event.target.value)}
                  className="mt-2 w-full border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                >
                  {jobOpenings.map((job) => (
                    <option key={job.title} value={job.title}>{job.title}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-black uppercase text-black">Qualification</span>
                <input
                  value={applicationForm.qualification}
                  onChange={(event) => updateApplicationField('qualification', event.target.value)}
                  className="mt-2 w-full border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="M.Pharm, B.Pharm, M.Sc..."
                />
              </label>
              <label className="block">
                <span className="text-sm font-black uppercase text-black">Experience</span>
                <input
                  value={applicationForm.experience}
                  onChange={(event) => updateApplicationField('experience', event.target.value)}
                  className="mt-2 w-full border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="Fresher or years of experience"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-black uppercase text-black">Message</span>
                <textarea
                  required
                  rows={5}
                  value={applicationForm.message}
                  onChange={(event) => updateApplicationField('message', event.target.value)}
                  className="mt-2 w-full resize-none border border-brand-100 bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="Share your current role, notice period, relevant skills, or training requirement."
                />
              </label>
            </div>

            <div className="mt-4 flex gap-2 bg-[#F0F8FF] px-4 py-3 text-sm font-bold leading-6 text-gray-700">
              <FileText size={18} className="mt-1 shrink-0 text-[#DF1F26]" />
              Please email your updated resume to {hrEmail} after submitting this form.
            </div>

            {statusMessage ? (
              <p className={`mt-4 flex gap-2 border px-4 py-3 text-sm font-bold ${
                status === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}>
                <MessageSquareText size={17} className="mt-0.5 shrink-0" />
                {statusMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#DF1F26] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {status === 'sending' ? 'Submitting...' : 'Submit Application'}
              <Send size={18} />
            </button>
          </motion.form>
        </div>
      </section>
    </main>
  )
}
