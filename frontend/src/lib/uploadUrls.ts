const DEFAULT_API_BASE_URL = 'https://www.radiconlab.com/api'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL

export function getApiAssetOrigin() {
  return API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/+$/, '')
}

export function resolveUploadUrl(value?: string | null) {
  if (!value) return ''

  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value
  }

  if (value.startsWith('/uploads/')) {
    return `${getApiAssetOrigin()}${value}`
  }

  return value
}

export function resolveUploadHtml(html: string) {
  if (!html) return ''

  return html.replace(
    /(<img\b[^>]*\bsrc=["'])(\/uploads\/[^"']+)(["'][^>]*>)/gi,
    (_match, before, src, after) => `${before}${resolveUploadUrl(src)}${after}`,
  )
}

export function stripUploadUrl(value: string) {
  if (!value) return ''

  return value.replace(/https?:\/\/[^/"'\s<>]+(?=\/uploads\/)/g, '')
}

export function stripUploadUrlHtml(html: string) {
  if (!html) return ''

  return html.replace(
    /(<img\b[^>]*\bsrc=["'])(https?:\/\/[^/"'\s<>]+)(\/uploads\/[^"']+)(["'][^>]*>)/gi,
    (_match, before, _origin, src, after) => `${before}${src}${after}`,
  )
}
