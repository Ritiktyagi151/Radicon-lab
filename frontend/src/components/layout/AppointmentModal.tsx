'use client'

import React, { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { API_BASE_URL } from '@/lib/admin/api'
import { RecaptchaCheckbox, type RecaptchaCheckboxHandle } from '@/lib/recaptcha'

const subjectOptions = ['General Inquiry', 'Support', 'Sales', 'Partnership'];

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialContactForm: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  subject: 'General Inquiry',
  message: '',
};


export default function AppointmentModal({ onClose }: { onClose: () => void }) {
  const isContactModalOpen = true
  const closeContactModal = onClose
  const [contactForm, setContactForm] = useState<ContactFormState>(initialContactForm);
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [contactMessage, setContactMessage] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const recaptchaRef = useRef<RecaptchaCheckboxHandle>(null);
  const updateContactField = (field: keyof ContactFormState, value: string) => {
    setContactForm((current) => ({ ...current, [field]: value }));
    setContactErrors((current) => ({ ...current, [field]: undefined }));
    if (contactStatus !== 'sending') {
      setContactStatus('idle');
      setContactMessage('');
    }
  };

  const validateContactForm = () => {
    const errors: Partial<Record<keyof ContactFormState, string>> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!contactForm.name.trim()) errors.name = 'Name is required.';
    if (!contactForm.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailPattern.test(contactForm.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (!contactForm.message.trim()) errors.message = 'Message is required.';

    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateContactForm()) return;

    setContactStatus('sending');
    setContactMessage('');

    try {
      if (!recaptchaToken) {
        setContactStatus('error');
        setContactMessage('Please complete the reCAPTCHA verification.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactForm,
          company: 'Navbar modal inquiry',
          recaptchaToken,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || 'Unable to submit inquiry right now.');
      }

      setContactForm(initialContactForm);
      setContactErrors({});
      setRecaptchaToken('');
      recaptchaRef.current?.reset();
      setContactStatus('success');
      setContactMessage('Thank you. Your inquiry has been sent successfully.');
    } catch (error) {
      setContactStatus('error');
      setContactMessage(error instanceof Error ? error.message : 'Unable to submit inquiry right now.');
    }
  };

  return (      <div
        className={`fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm transition-all duration-300 ${
          isContactModalOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={closeContactModal}
        role="presentation"
      >
        <div
          className={`max-h-[calc(100vh-48px)] w-full max-w-2xl overflow-y-auto rounded-sm border border-[#E8E8E8] bg-white shadow-2xl transition-all duration-300 ${
            isContactModalOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-5 scale-95 opacity-0'
          }`}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="navbar-contact-title"
        >
          <div className="flex items-start justify-between border-b border-[#E8E8E8] px-5 py-4 sm:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#DF1F26]">Contact Form</p>
              <p id="navbar-contact-title" className="mt-2 text-2xl font-bold text-slate-950">Send an inquiry</p>
            </div>
            <button
              type="button"
              onClick={closeContactModal}
              className="rounded-sm p-2 text-slate-500 transition-colors hover:bg-[#F0F8FF] hover:text-slate-900"
              aria-label="Close contact form"
            >
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold uppercase text-slate-900">Name</span>
                <input
                  required
                  value={contactForm.name}
                  onChange={(event) => updateContactField('name', event.target.value)}
                  className="mt-2 w-full border border-[#E8E8E8] bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="Your name"
                />
                {contactErrors.name ? <span className="mt-1 block text-xs font-bold text-red-600">{contactErrors.name}</span> : null}
              </label>
              <label className="block">
                <span className="text-sm font-bold uppercase text-slate-900">Email</span>
                <input
                  required
                  type="email"
                  value={contactForm.email}
                  onChange={(event) => updateContactField('email', event.target.value)}
                  className="mt-2 w-full border border-[#E8E8E8] bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="you@example.com"
                />
                {contactErrors.email ? <span className="mt-1 block text-xs font-bold text-red-600">{contactErrors.email}</span> : null}
              </label>
              <label className="block">
                <span className="text-sm font-bold uppercase text-slate-900">Phone Number</span>
                <input
                  value={contactForm.phone}
                  onChange={(event) => updateContactField('phone', event.target.value)}
                  className="mt-2 w-full border border-[#E8E8E8] bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="Phone number"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold uppercase text-slate-900">Subject</span>
                <select
                  value={contactForm.subject}
                  onChange={(event) => updateContactField('subject', event.target.value)}
                  className="mt-2 w-full border border-[#E8E8E8] bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                >
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-bold uppercase text-slate-900">Message</span>
                <textarea
                  required
                  rows={5}
                  value={contactForm.message}
                  onChange={(event) => updateContactField('message', event.target.value)}
                  className="mt-2 w-full resize-none border border-[#E8E8E8] bg-[#F0F8FF] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  placeholder="Tell us how we can help."
                />
                {contactErrors.message ? <span className="mt-1 block text-xs font-bold text-red-600">{contactErrors.message}</span> : null}
              </label>
            </div>

            <RecaptchaCheckbox
              enabled={isContactModalOpen}
              ref={recaptchaRef}
              onVerify={setRecaptchaToken}
            />

            {contactMessage ? (
              <p className={`border px-4 py-3 text-sm font-bold ${
                contactStatus === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}>
                {contactMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={contactStatus === 'sending'}
              className="w-full bg-[#DF1F26] px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {contactStatus === 'sending' ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>

  )
}
