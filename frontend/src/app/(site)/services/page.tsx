import type { Metadata } from 'next'
import Image from 'next/image'
import { CheckCircle2, PackageCheck } from 'lucide-react'
import { buildSeoMetadata, getPublicSeoRoutes } from '@/lib/seoRoutes'
import { getServiceBySlug, getServicePath, getServices } from '@/lib/serviceData'

type ServicesPageProps = {
  serviceSlug?: string
}

export async function generateMetadata(): Promise<Metadata> {
  const routes = await getPublicSeoRoutes()

  return buildSeoMetadata(routes, '/services', {
    title: 'Pharma Manufacturing Services',
    description: 'Explore Radicon Lab third party pharma manufacturing services.',
  })
}

export function generateServiceMetadata(serviceSlug: string): Metadata {
  const service = getServiceBySlug(serviceSlug)

  if (!service) return {}

  return {
    title: `${service.title} | Radicon Lab`,
    description: service.excerpt,
    alternates: {
      canonical: getServicePath(service.slug),
    },
  }
}

export default function ServicesPage({ serviceSlug }: ServicesPageProps) {
  const services = getServices()
  const selectedService = serviceSlug ? getServiceBySlug(serviceSlug) : services[0]
  const packagingOptions = [
    'Blister',
    'Strip',
    'Alu Alu',
    'Pet Bottles/Jar',
    'HDPE Bottles/Jar',
    'Tubes',
    'Paper Back Blister',
  ]

  return (
    <div className="text-[#111827]">
      <div className="h-1.5 w-full bg-brand-600" />

      <section className="border-b border-brand-100 bg-[#F0F8FF] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-600">
            Services
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-tight text-black sm:text-5xl">
            Third Party Pharma Manufacturing Services
          </h1>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-gray-600">
            Static service content for Radicon Laboratories with focused manufacturing pages and
            clean SEO friendly URLs.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {selectedService ? (
            <article className="overflow-hidden">
              <section className="py-4">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div className="relative aspect-[4/3] overflow-hidden border border-brand-100 bg-[#F0F8FF] shadow-sm">
                    <Image
                      src={selectedService.images[0]}
                      alt={selectedService.title}
                      fill
                      sizes="(min-width: 1024px) 34vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-600">
                      Radicon Lab Service
                    </p>
                    <h2 className="mt-3 text-2xl font-black leading-tight text-black sm:text-4xl">
                      Who Are Third Party Manufacturers?
                    </h2>
                    <p className="mt-5 text-base font-semibold leading-8 text-gray-600">
                      We take pride in our extensive production capacity and wide range of products.
                      With over 400 approved products and 600+ branded generics in the market, we
                      strive to meet the diverse needs of our customers. Our annual production
                      capacity speaks volumes about our dedication to delivering high-quality
                      pharmaceuticals. Radicon Laboratories Ltd offers a wide range of pharmaceutical
                      finished formulations under various therapeutic categories in different dosage
                      forms including tablets, capsules, ointment, syrup, injectable, and oral strips.
                    </p>
                  </div>
                </div>
              </section>

              <section className="relative mt-12 bg-[#eaeef3] py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1440 260"
                  className="pointer-events-none absolute inset-x-0 top-0 h-16 w-full -translate-y-full text-[#eaeef3]"
                  aria-hidden="true"
                >
                  <path fill="currentColor" d="M0,96L1440,256L1440,320L0,320Z" />
                </svg>

                <div className="grid items-center gap-8 px-4 sm:px-7 lg:grid-cols-2">
                  <div>
                    <h2 className="text-2xl font-black leading-tight text-black sm:text-4xl">
                      Our Production
                    </h2>
                    <p className="mt-4 text-base font-semibold leading-8 text-gray-600">
                      <b>Radicon Laboratories</b> Ltd offers a wide range of pharmaceutical finished
                      formulations under various therapeutic categories in dosage forms such as
                      tablets, capsules, ointment, syrup, injectable, and oral strips.
                    </p>

                    <div className="mt-6 overflow-hidden border border-brand-100 bg-white shadow-sm">
                      <table className="w-full border-collapse text-left text-sm">
                        <thead>
                          <tr>
                            <th colSpan={2} className="bg-brand-600 px-4 py-3 font-black uppercase tracking-wide text-white">
                              Annual Production Capacity
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-100">
                          <tr>
                            <td className="px-4 py-3 font-black text-black">Tablets</td>
                            <td className="px-4 py-3 font-bold text-gray-600">360 Million</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 font-black text-black">Capsules</td>
                            <td className="px-4 py-3 font-bold text-gray-600">180 Million</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 font-black text-black">Ointment</td>
                            <td className="px-4 py-3 font-bold text-gray-600">100 Million</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="mt-5 text-sm font-bold leading-7 text-gray-600">
                      The company offers its finished products in different primary packaging.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {packagingOptions.map((option) => (
                        <span
                          key={option}
                          className="inline-flex items-center gap-2 border border-brand-100 bg-white px-3 py-2 text-xs font-black uppercase text-black shadow-sm"
                        >
                          <PackageCheck size={16} className="text-brand-600" />
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden border border-brand-100 bg-white shadow-sm">
                    <Image
                      src={selectedService.images[1] || selectedService.images[0]}
                      alt={`${selectedService.title} production`}
                      fill
                      sizes="(min-width: 1024px) 34vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </section>

              <section className="mt-8 grid gap-3">
                {selectedService.points.map((point) => (
                  <div key={point} className="flex gap-3 border border-brand-100 bg-[#F0F8FF] p-4">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-brand-600" />
                    <p className="text-sm font-bold uppercase leading-6 text-black">{point}</p>
                  </div>
                ))}
              </section>
            </article>
          ) : null}
        </div>
      </section>
    </div>
  )
}
