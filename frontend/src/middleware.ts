import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === '/login'

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
  matcher: ['/admin/:path*', '/login', '/product-:slug', '/product-details-:slug', '/products/:slug', '/services/:slug'],
}
