import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const legacyServiceRedirects: Record<string, string> = {
  '/third-party-pharma-manufacturer': '/third-party-manufacturer',
  '/third-party-pharma-manufacturer-for-avanafil': '/third-party-manufacturer-for-avanafil',
  '/third-party-pharma-manufacturer-for-sildenafil': '/third-party-manufacturer-for-sildenafil',
  '/third-party-pharma-manufacturer-for-tadalafil': '/third-party-manufacturer-for-tadalafil',
  '/third-party-pharma-manufacturer-for-vardenafil': '/third-party-manufacturer-for-vardenafil',
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === '/login'
  const legacyServicePath = legacyServiceRedirects[pathname]

  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.toLowerCase()
    return NextResponse.redirect(url, 301)
  }

  if (pathname === '/blogs') {
    const url = request.nextUrl.clone()
    url.pathname = '/blog'
    return NextResponse.redirect(url, 301)
  }

  if (pathname.startsWith('/blogs/')) {
    const slug = pathname.slice('/blogs/'.length)
    const url = request.nextUrl.clone()
    url.pathname = slug ? `/blog-${slug}` : '/blog'
    return NextResponse.redirect(url, 301)
  }

  if (legacyServicePath) {
    const url = request.nextUrl.clone()
    url.pathname = legacyServicePath
    return NextResponse.redirect(url, 301)
  }

  if (pathname.startsWith('/products/')) {
    const slug = pathname.slice('/products/'.length)
    const url = request.nextUrl.clone()
    url.pathname = `/product-details-${slug}`
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/product-details-')) {
    const url = request.nextUrl.clone()
    url.pathname = `/products/${pathname.slice('/product-details-'.length)}`
    return NextResponse.rewrite(url)
  }

  if (pathname.startsWith('/services/')) {
    const url = request.nextUrl.clone()
    url.pathname = `/${pathname.slice('/services/'.length)}`
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/product-')) {
    const url = request.nextUrl.clone()
    url.pathname = `/categories/${pathname.slice('/product-'.length)}`
    return NextResponse.rewrite(url)
  }

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
