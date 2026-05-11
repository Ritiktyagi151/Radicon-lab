import type { Metadata } from 'next'
import LegalPageClient from '@/components/legal/LegalPageClient'
import { buildSeoMetadata, getPublicSeoRoutes } from '@/lib/seoRoutes'

const privacySections = [
  {
    title: 'Information We Collect',
    body: 'Radicon Laboratories may collect information that you voluntarily submit through contact forms, inquiry forms, email, phone calls, WhatsApp, or business communication channels.',
    points: [
      'Name, email address, phone number, company name, and location details.',
      'Product category, dosage form, batch quantity, packaging preference, and business requirement.',
      'Technical information such as browser type, device information, and website usage data.',
    ],
  },
  {
    title: 'How We Use Information',
    body: 'We use submitted information to respond to inquiries, understand manufacturing requirements, support business communication, and improve our website experience.',
    points: [
      'To contact you about third party manufacturing, product, export, or support inquiries.',
      'To prepare internal business, production, or quality-related discussion notes.',
      'To improve website content, communication quality, and user experience.',
    ],
  },
  {
    title: 'Business Inquiry Data',
    body: 'Information shared for pharmaceutical manufacturing or commercial discussion may be reviewed by relevant Radicon business, technical, quality, or support teams.',
    points: [
      'Inquiry data is used only for legitimate business communication and requirement evaluation.',
      'Sensitive technical or commercial details should be shared only through authorized communication channels.',
      'We may retain inquiry records for follow-up, compliance, service, and internal reference purposes.',
    ],
  },
  {
    title: 'Cookies and Website Analytics',
    body: 'Our website may use basic cookies or analytics tools to understand visitor behavior, website performance, and page engagement.',
    points: [
      'Cookies may help remember preferences and improve page performance.',
      'Analytics data is generally aggregated and does not directly identify individual visitors.',
      'You can control cookie behavior through your browser settings.',
    ],
  },
  {
    title: 'Data Sharing',
    body: 'Radicon Laboratories does not sell personal information. Information may be shared only when needed for business operations, legal compliance, service providers, or authorized internal handling.',
    points: [
      'Information may be shared with internal teams involved in your inquiry.',
      'Information may be disclosed when required by law, regulation, or lawful authority.',
      'Service providers may process limited data only for operational support.',
    ],
  },
  {
    title: 'Data Security',
    body: 'We take reasonable administrative and technical steps to protect submitted information. However, no internet transmission or electronic storage method can be guaranteed as completely secure.',
    points: [
      'Access to inquiry information is limited to relevant operational users.',
      'We encourage users not to submit unnecessary sensitive personal information through public forms.',
      'Important commercial documents should be shared through verified business contacts.',
    ],
  },
  {
    title: 'Your Choices',
    body: 'You may contact Radicon Laboratories to request correction, update, or removal of personal information submitted through our website, subject to business, legal, and compliance requirements.',
  },
  {
    title: 'Contact for Privacy Questions',
    body: 'For privacy-related questions, contact Radicon Laboratories at contact@radiconlab.com or bdm@radiconlab.com.',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const routes = await getPublicSeoRoutes()

  return buildSeoMetadata(routes, '/privacy', {
    title: 'Privacy Policy | Radicon Lab',
    description:
      'Read the Radicon Laboratories privacy policy for website visitors, contact forms, business inquiries, cookies, and data handling.',
  })
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageClient
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      description="This Privacy Policy explains how Radicon Laboratories collects, uses, protects, and manages information submitted through our website and business inquiry channels."
      updatedAt="May 8, 2026"
      sections={privacySections}
    />
  )
}
