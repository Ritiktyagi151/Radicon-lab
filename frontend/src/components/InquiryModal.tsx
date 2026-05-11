'use client'

import { useState } from 'react'
import { Mail, MessageCircle, Package, Send, User, X } from 'lucide-react'

type InquiryModalProps = {
  isOpen: boolean
  onClose: () => void
  productName: string
}

export default function InquiryModal({ isOpen, onClose, productName }: InquiryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    window.setTimeout(() => {
      setIsSubmitting(false)
      onClose()
    }, 700)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111]/70 p-4">
      <button
        type="button"
        aria-label="Close inquiry modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg border border-[#DF1F26] bg-white shadow-2xl">
        <div className="h-1.5 w-full bg-[#DF1F26]" />

        <div className="flex items-center justify-between border-b border-[#DF1F26]/20 px-5 py-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#DF1F26]">
              Radicon Lab
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-2xl font-black uppercase tracking-normal text-black">
              <MessageCircle size={22} className="text-[#DF1F26]" />
              Product Inquiry
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close inquiry modal"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center border border-[#DF1F26] text-[#DF1F26] transition hover:bg-[#DF1F26] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-black">
              Product Name
            </label>
            <div className="flex items-center gap-2 border border-[#DF1F26]/30 px-3 py-2.5">
              <Package size={17} className="shrink-0 text-[#DF1F26]" />
              <input
                type="text"
                readOnly
                value={productName}
                className="w-full bg-transparent text-sm font-black uppercase text-black outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-black">
                Name
              </label>
              <div className="flex items-center gap-2 border border-[#DF1F26]/30 px-3 py-2.5 focus-within:border-[#DF1F26]">
                <User size={17} className="shrink-0 text-[#DF1F26]" />
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-transparent text-sm font-bold text-black outline-none placeholder:text-black/35"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-black">
                Email
              </label>
              <div className="flex items-center gap-2 border border-[#DF1F26]/30 px-3 py-2.5 focus-within:border-[#DF1F26]">
                <Mail size={17} className="shrink-0 text-[#DF1F26]" />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm font-bold text-black outline-none placeholder:text-black/35"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-black">
              Requirements
            </label>
            <textarea
              required
              name="requirements"
              rows={4}
              placeholder="Share quantity, market, dosage, or other requirements."
              className="w-full resize-none border border-[#DF1F26]/30 px-3 py-2.5 text-sm font-bold text-black outline-none placeholder:text-black/35 focus:border-[#DF1F26]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-3 bg-[#DF1F26] px-6 py-3.5 text-sm font-black uppercase italic tracking-widest text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:bg-[#111111]/45"
          >
            <Send size={18} />
            {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  )
}
