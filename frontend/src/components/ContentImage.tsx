import Image, { type ImageProps } from 'next/image'
import { getApiAssetOrigin, resolveUploadUrl } from '@/lib/uploadUrls'

// Keep existing external/data images working without allowing arbitrary optimizer hosts.
export default function ContentImage({ src, alt, ...props }: Omit<ImageProps, 'src'> & { src: string }) {
  const resolved = resolveUploadUrl(src) || '/radicon-logo.png'
  let optimized = resolved.startsWith('/') && !resolved.startsWith('//')
  try {
    const url = new URL(resolved)
    optimized = [getApiAssetOrigin(), 'https://www.radiconlab.com', 'https://radiconlab.com'].includes(url.origin)
      && url.pathname.startsWith('/uploads/')
      && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  } catch { /* Relative paths use the local optimizer. */ }
  return <Image {...props} src={resolved} alt={alt} unoptimized={!optimized} />
}
