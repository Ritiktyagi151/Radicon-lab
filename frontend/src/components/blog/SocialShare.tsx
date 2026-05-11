'use client'

import { Link as LinkIcon } from 'lucide-react'
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { useEffect, useState } from 'react'

export default function SocialShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const links = [
    {
      label: 'Share on Facebook',
      icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'Share on X',
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: 'Share on LinkedIn',
      icon: FaLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ]

  const copyLink = async () => {
    await navigator.clipboard.writeText(url || window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {links.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all hover:border-brand-600 hover:bg-brand-600 hover:text-white"
          aria-label={label}
        >
          <Icon size={16} />
        </a>
      ))}
      <button
        onClick={copyLink}
        className="inline-flex h-11 items-center gap-2 rounded-sm border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition-all hover:border-brand-600 hover:text-brand-600"
      >
        <LinkIcon size={16} />
        {copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  )
}
