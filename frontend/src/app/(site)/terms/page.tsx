import type { Metadata } from 'next'
import LegalPageClient from '@/components/legal/LegalPageClient'
import { buildSeoMetadata, getPublicSeoRoutes } from '@/lib/seoRoutes'

const termsSections = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing or using the Radicon Laboratories website, you agree to these Terms and Conditions. If you do not agree, please do not use this website.',
    points: [
      'These terms apply to website browsing, form submissions, and general digital communication.',
      'Specific business transactions may require separate written agreements, purchase terms, or regulatory documentation.',
      'Radicon Laboratories may update these terms when required for operational, legal, or business reasons.',
    ],
  },
  {
    title: 'Website Information',
    body: 'The content on this website is provided for general business and informational purposes related to pharmaceutical manufacturing, finished formulations, services, and company capabilities.',
    points: [
      'Website content should not be treated as medical advice, prescription guidance, or regulatory approval.',
      'Product and service details may change based on technical, commercial, regulatory, or operational requirements.',
      'Final business commitments must be confirmed through authorized Radicon communication.',
    ],
  },
  {
    title: 'Business Inquiries',
    body: 'Submitting a contact, product, export, or manufacturing inquiry does not create a binding contract or guaranteed supply commitment.',
    points: [
      'All inquiries are subject to feasibility review, documentation, pricing, compliance, and written confirmation.',
      'Customers are responsible for sharing accurate product, quantity, packaging, market, and regulatory information.',
      'Radicon may decline or request more information for any inquiry where details are incomplete or unsuitable.',
    ],
  },
  {
    title: 'Intellectual Property',
    body: 'Text, logos, page layouts, graphics, images, product descriptions, and other website materials are owned by or licensed to Radicon Laboratories unless otherwise stated.',
    points: [
      'Website content may not be copied, reproduced, modified, or used commercially without permission.',
      'Radicon brand elements must not be used in a misleading or unauthorized manner.',
      'Third party trademarks, if mentioned, remain the property of their respective owners.',
    ],
  },
  {
    title: 'User Responsibilities',
    body: 'Users agree to use the website lawfully and avoid submitting false, harmful, misleading, confidential, or unauthorized material through any form or communication channel.',
    points: [
      'Do not attempt to disrupt website security, performance, or availability.',
      'Do not submit unlawful, abusive, spam, or malicious content.',
      'Do not impersonate another person, company, or authorized representative.',
    ],
  },
  {
    title: 'Limitation of Liability',
    body: 'Radicon Laboratories aims to keep website information accurate and available, but we do not guarantee uninterrupted access, error-free content, or suitability for every purpose.',
    points: [
      'Radicon is not liable for losses arising from reliance on general website information alone.',
      'Users should verify important business, technical, or regulatory information with authorized representatives.',
      'External links or third party platforms are used at the visitor’s own discretion.',
    ],
  },
  {
    title: 'External Communication',
    body: 'Calls, emails, WhatsApp messages, and business discussions should be treated as preliminary unless confirmed through authorized written documentation or formal commercial agreement.',
  },
  {
    title: 'Contact',
    body: 'For questions about these Terms and Conditions, contact Radicon Laboratories at contact@radiconlab.com or bdm@radiconlab.com.',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const routes = await getPublicSeoRoutes()

  return buildSeoMetadata(routes, '/terms', {
    title: 'Terms & Conditions | Radicon Lab',
    description:
      'Read the Radicon Laboratories Terms and Conditions for website use, business inquiries, intellectual property, and communication.',
  })
}

export default function TermsConditionsPage() {
  return (
    <LegalPageClient
      eyebrow="Terms & Conditions"
      title="Terms & Conditions"
      description="These Terms and Conditions explain the rules for using the Radicon Laboratories website and submitting business, manufacturing, product, and export inquiries."
      updatedAt="May 8, 2026"
      sections={termsSections}
    />
  )
}
