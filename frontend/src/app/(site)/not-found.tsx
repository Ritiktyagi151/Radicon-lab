import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Home, SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[62vh] max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-brand-100 bg-brand-50 text-brand-600">
            <SearchX className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="mt-7 text-sm font-bold uppercase tracking-[0.24em] text-brand-600">
            404 error
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-gray-950 sm:text-5xl lg:text-6xl">
            Page not found
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            The page you are looking for does not exist or may have been moved.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Go to homepage
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-line bg-white px-6 py-3 text-sm font-bold text-gray-950 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Contact support
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute inset-6 rounded-full bg-brand-50 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-sm border border-line bg-white p-8 shadow-[0_24px_80px_rgba(39,96,134,0.14)]">
            <Image
              src="/radicon-logo.png"
              alt="Radicon Laboratories Ltd"
              width={260}
              height={88}
              className="h-auto w-48"
              priority
            />
            <div className="mt-10 border-t border-line pt-8">
              <div className="text-[7rem] font-black leading-none text-brand-600 sm:text-[9rem]">
                404
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Invalid route
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
