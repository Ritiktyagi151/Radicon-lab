'use client'

import Link from 'next/link'
import { useSeoRoutes } from '@/lib/admin/useSeoRoutes'
import type { PublicSeoRoute } from '@/lib/seoRoutes'
import { getServicePath, getServices } from '@/lib/serviceData'
import { 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube, 
  FaXTwitter,
  FaWhatsapp,
  FaPhoneVolume,
  FaEnvelope,
  FaLocationDot
} from 'react-icons/fa6'

// ── Data (No changes made here) ──
const quickLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/career', label: 'Career' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Condition' },
  { href: '/team', label: 'Our Team' },
]

const services = getServices()

const socialLinks = [
  { href: 'https://facebook.com', label: 'Facebook', icon: FaFacebookF },
  { href: 'https://twitter.com', label: 'Twitter', icon: FaXTwitter },
  { href: 'https://instagram.com', label: 'Instagram', icon: FaInstagram },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: FaLinkedinIn },
  { href: 'https://youtube.com', label: 'YouTube', icon: FaYoutube },
]

const contactInfo = [
  { icon: FaLocationDot, content: '108-A Ecotech-XII Greater Noida, U.P. India 201306', isLink: false },
  { icon: FaEnvelope, content: 'contact@radiconlab.com', href: 'mailto:contact@radiconlab.com', isLink: true },
  { icon: FaEnvelope, content: 'bdm@radiconlab.com', href: 'mailto:bdm@radiconlab.com', isLink: true },
  { icon: FaWhatsapp, content: '+91 8796911105', href: 'https://wa.me/918796911105', isLink: true },
  { icon: FaPhoneVolume, content: '+0120-463-32-71', href: 'tel:+0120-463-32-71', isLink: true },
]

export default function Footer({ initialRoutes }: { initialRoutes?: PublicSeoRoute[] }) {
  const { hrefFor } = useSeoRoutes(initialRoutes)

  return (
    <footer className="relative overflow-hidden bg-white">
      {/* ── Background Animated Waves (Strictly in Background) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <svg 
          className="absolute bottom-0 w-[200%] h-[600px]  animate-wave-slow" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="#CFE5FF"
          ></path>
        </svg>
      </div>

      {/* ── Wave SVG (Top Border) ── */}
      {/* <div className="relative z-10 top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg className="relative block w-full h-[60px] sm:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                className="fill-blue-300"></path>
        </svg>
      </div> */}

      <div className="relative z-10">
        {/* ── Main Grid ── */}
        <div className="relative mx-auto max-w-8xl grid gap-y-10 gap-x-8 px-5 pt-24 sm:pt-28 pb-10 sm:pb-12 grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-[1.3fr_.6fr_.6fr_1.3fr_1.2fr] xl:px-12">
          
          {/* Brand Column */}
          <div className="group/col col-span-1 xs:col-span-2 md:col-span-2 lg:col-span-1">
            <Link href={hrefFor('/')} className="inline-flex items-center gap-2.5 mb-6" aria-label="Radicon Home">
              <img className="h-16 w-auto" src="/radicon-logo.png" alt="Radicon logo" />
            </Link>
            <p className="text-[15px] leading-[1.8] text-gray-500 mb-6 max-w-xs">
              Redicon Laboratories Ltd, a leading Pharmaceutical company in India offers a wide range of pharmaceutical finished formulations (FF) under various therapeutic categories in three different dosage form.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a 
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-slate-300 hover:bg-[#F0F8FF] hover:text-slate-700 hover:shadow-lg hover:shadow-gray-300/30"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="group">
            <h2 className="relative pb-3 text-[15px] font-bold uppercase tracking-widest text-gray-900 mb-6 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-6 after:h-[2px] after:bg-[#e34d55] after:transition-all after:duration-300 group-hover:after:w-12">
              Quick Links
            </h2>
            <ul className="space-y-[11px]">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={hrefFor(link.href)}
                    className="group/link inline-flex items-center text-[16px] text-gray-500 transition-all duration-300 hover:text-slate-700 hover:pl-4"
                  >
                    <span className="opacity-0 -translate-x-2 text-[10px] text-slate-400 transition-all duration-200 group-hover/link:opacity-100 group-hover/link:translate-x-[-8px]">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Products Column */}
          <div className="group">
            <h2 className="relative pb-3 text-[15px] font-bold uppercase tracking-widest text-gray-900 mb-6 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-6 after:h-[2px] after:bg-[#e34d55] after:transition-all after:duration-300 group-hover:after:w-12">
              Our Products
            </h2>
            <ul className="space-y-[11px]">
              <li>
                <Link href="/products/tablets" className="group/link inline-flex items-center text-[16px] text-gray-500 transition-all duration-300 hover:text-slate-700 hover:pl-4">
                  <span className="opacity-0 -translate-x-2 text-[10px] text-slate-400 transition-all duration-200 group-hover/link:opacity-100 group-hover/link:translate-x-[-8px]">→</span>
                  Tablets
                </Link>
              </li>
              <li>
                <Link href="/products/capsules" className="group/link inline-flex items-center text-[16px] text-gray-500 transition-all duration-300 hover:text-slate-700 hover:pl-4">
                  <span className="opacity-0 -translate-x-2 text-[10px] text-slate-400 transition-all duration-200 group-hover/link:opacity-100 group-hover/link:translate-x-[-8px]">→</span>
                  Capsules
                </Link>
              </li>
              <li>
                <Link href="/products/syrups" className="group/link inline-flex items-center text-[16px] text-gray-500 transition-all duration-300 hover:text-slate-700 hover:pl-4">
                  <span className="opacity-0 -translate-x-2 text-[10px] text-slate-400 transition-all duration-200 group-hover/link:opacity-100 group-hover/link:translate-x-[-8px]">→</span>
                  Ointments
                </Link>
              </li>
              <li>
                <Link href="/products/syrups" className="group/link inline-flex items-center text-[16px] text-gray-500 transition-all duration-300 hover:text-slate-700 hover:pl-4">
                  <span className="opacity-0 -translate-x-2 text-[10px] text-slate-400 transition-all duration-200 group-hover/link:opacity-100 group-hover/link:translate-x-[-8px]">→</span>
                  Orally-Disintegrating Strips
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services Column */}
          <div className="group">
            <h2 className="relative pb-3 text-[15px] font-bold uppercase tracking-widest text-gray-900 mb-6 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-6 after:h-[2px] after:bg-[#e34d55] after:transition-all after:duration-300 group-hover:after:w-12">
              Our Services
            </h2>
            <ul className="space-y-[11px]">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={getServicePath(service.slug)}
                    className="group/link inline-flex items-center text-[15px] text-gray-500 transition-all duration-300 hover:text-slate-700 hover:pl-4"
                  >
                    <span className="opacity-0 -translate-x-2 text-[10px] text-slate-400 transition-all duration-200 group-hover/link:opacity-100 group-hover/link:translate-x-[-8px]">→</span>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch Column */}
          <div className="group">
            <h2 className="relative pb-3 text-[15px] font-bold uppercase tracking-widest text-gray-900 mb-6 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-6 after:h-[2px] after:bg-[#e34d55] after:transition-all after:duration-300 group-hover:after:w-12">
              Get In Touch
            </h2>
            <ul className="space-y-4">
              {contactInfo.map(({ icon: Icon, content, href, isLink }, idx) => (
                <li key={idx} className="group/item flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F8FF] transition-all duration-300 group-hover/item:bg-[#E8E8E8] group-hover/item:scale-110 group-hover/item:-rotate-6">
                    <Icon className="text-slate-400 group-hover/item:text-slate-700 transition-colors duration-300 text-[14px]" />
                  </div>
                  {isLink ? (
                    <a href={href} className="mt-1 text-[16px] leading-[1.6] text-gray-500 hover:text-slate-700 transition-colors duration-200">
                      {content}
                    </a>
                  ) : (
                    <span className="mt-1 text-[13px] leading-[1.6] text-gray-500">{content}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Legal Links ── */}
        <div className="pb-8">
          <div className="mx-auto max-w-8xl flex items-center justify-center gap-6 px-5 sm:px-8">
            <Link 
              href={hrefFor('/privacy')} 
              className="text-[16px] font-medium text-gray-500 hover:text-slate-700 transition-colors relative after:content-[''] after:absolute after:-right-3 after:top-1/2 after:-translate-y-1/2 after:w-[1px] after:h-3 after:bg-gray-300 last:after:hidden"
            >
              Privacy Policy
            </Link>
            <Link 
              href={hrefFor('/terms')} 
              className="text-[16px] font-medium text-gray-500 hover:text-slate-700 transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="mx-auto max-w-8xl flex flex-col items-center gap-4 px-5 py-6 sm:flex-row sm:justify-between sm:px-8 xl:px-12">
            <p className="text-[16px] text-gray-400 text-center sm:text-left order-2 sm:order-1">
              Copyright © {new Date().getFullYear()} <span className="font-semibold text-blue-500">Radicon</span>. All rights reserved.
            </p>
            <div className="text-[16px] text-gray-400 text-center sm:text-right order-1 sm:order-2">
              Design & Development by{' '}
              <Link
                href="https://jaikvik.com"
                target="_blank"
                className="text-slate-400 hover:text-blue-500 transition-colors font-semibold"
              >
                Jaikvik Technology India Pvt Ltd
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes waveMove {
          0% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }
        /* .animate-wave-slow {
          animation: waveMove 20s ease-in-out infinite;
        } */
      `}</style>
    </footer>
  )
}