"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube, 
  FaXTwitter
} from 'react-icons/fa6'
import { 
  Phone, 
  MapPin, 
  Clock, 
  Search, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useSeoRoutes } from '@/lib/admin/useSeoRoutes';
import { API_BASE_URL } from '@/lib/admin/api';
import type { PublicSeoRoute } from '@/lib/seoRoutes';
import { getAboutPages, getAboutPath } from '@/lib/aboutData';
import { getCategories } from '@/lib/productApi';
import { getCategoryPath } from '@/lib/categoryUrls';
import { getServicePath, getServices } from '@/lib/serviceData';
import type { Category } from '@/types/product';


const aboutLinks = getAboutPages();
const serviceLinks = getServices();

const languages = [
  { name: 'Afrikaans', flag: '🇿🇦' },
  { name: 'Albanian', flag: '🇦🇱' },
  { name: 'Amharic', flag: '🇪🇹' },
  { name: 'Arabic', flag: '🇸🇦' },
  { name: 'Armenian', flag: '🇦🇲' },
  { name: 'Azerbaijani', flag: '🇦🇿' },
  { name: 'Bengali', flag: '🇧🇩' },
  { name: 'Bosnian', flag: '🇧🇦' },
  { name: 'Bulgarian', flag: '🇧🇬' },
  { name: 'Burmese', flag: '🇲🇲' },
  { name: 'Catalan', flag: '🇪🇸' },
  { name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { name: 'Chinese (Traditional)', flag: '🇹🇼' },
  { name: 'Croatian', flag: '🇭🇷' },
  { name: 'Czech', flag: '🇨🇿' },
  { name: 'Danish', flag: '🇩🇰' },
  { name: 'Dutch', flag: '🇳🇱' },
  { name: 'English (UK)', flag: '🇬🇧' },
  { name: 'English (US)', flag: '🇺🇸' },
  { name: 'Estonian', flag: '🇪🇪' },
  { name: 'Filipino', flag: '🇵🇭' },
  { name: 'Finnish', flag: '🇫🇮' },
  { name: 'French', flag: '🇫🇷' },
  { name: 'Georgian', flag: '🇬🇪' },
  { name: 'German', flag: '🇩🇪' },
  { name: 'Greek', flag: '🇬🇷' },
  { name: 'Gujarati', flag: '🇮🇳' },
  { name: 'Hebrew', flag: '🇮🇱' },
  { name: 'Hindi', flag: '🇮🇳' },
  { name: 'Hungarian', flag: '🇭🇺' },
  { name: 'Icelandic', flag: '🇮🇸' },
  { name: 'Indonesian', flag: '🇮🇩' },
  { name: 'Irish', flag: '🇮🇪' },
  { name: 'Italian', flag: '🇮🇹' },
  { name: 'Japanese', flag: '🇯🇵' },
  { name: 'Kannada', flag: '🇮🇳' },
  { name: 'Kazakh', flag: '🇰🇿' },
  { name: 'Khmer', flag: '🇰🇭' },
  { name: 'Korean', flag: '🇰🇷' },
  { name: 'Lao', flag: '🇱🇦' },
  { name: 'Latvian', flag: '🇱🇻' },
  { name: 'Lithuanian', flag: '🇱🇹' },
  { name: 'Malay', flag: '🇲🇾' },
  { name: 'Malayalam', flag: '🇮🇳' },
  { name: 'Marathi', flag: '🇮🇳' },
  { name: 'Mongolian', flag: '🇲🇳' },
  { name: 'Nepali', flag: '🇳🇵' },
  { name: 'Norwegian', flag: '🇳🇴' },
  { name: 'Persian', flag: '🇮🇷' },
  { name: 'Polish', flag: '🇵🇱' },
  { name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { name: 'Portuguese (Portugal)', flag: '🇵🇹' },
  { name: 'Punjabi', flag: '🇮🇳' },
  { name: 'Romanian', flag: '🇷🇴' },
  { name: 'Russian', flag: '🇷🇺' },
  { name: 'Serbian', flag: '🇷🇸' },
  { name: 'Sinhala', flag: '🇱🇰' },
  { name: 'Slovak', flag: '🇸🇰' },
  { name: 'Slovenian', flag: '🇸🇮' },
  { name: 'Spanish', flag: '🇪🇸' },
  { name: 'Swahili', flag: '🇰🇪' },
  { name: 'Swedish', flag: '🇸🇪' },
  { name: 'Tamil', flag: '🇮🇳' },
  { name: 'Telugu', flag: '🇮🇳' },
  { name: 'Thai', flag: '🇹🇭' },
  { name: 'Turkish', flag: '🇹🇷' },
  { name: 'Ukrainian', flag: '🇺🇦' },
  { name: 'Urdu', flag: '🇵🇰' },
  { name: 'Uzbek', flag: '🇺🇿' },
  { name: 'Vietnamese', flag: '🇻🇳' },
  { name: 'Welsh', flag: '🏴' },
  { name: 'Zulu', flag: '🇿🇦' },
];

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

const Navbar = ({ initialRoutes }: { initialRoutes?: PublicSeoRoute[] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages.find((language) => language.name === 'English (US)') || languages[0]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormState>(initialContactForm);
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [contactMessage, setContactMessage] = useState('');
  const { hrefFor } = useSeoRoutes(initialRoutes);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Function to close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openContactModal = () => {
    setIsContactModalOpen(true);
    setContactStatus('idle');
    setContactMessage('');
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

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
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactForm,
          company: 'Navbar modal inquiry',
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || 'Unable to submit inquiry right now.');
      }

      setContactForm(initialContactForm);
      setContactErrors({});
      setContactStatus('success');
      setContactMessage('Thank you. Your inquiry has been sent successfully.');
    } catch (error) {
      setContactStatus('error');
      setContactMessage(error instanceof Error ? error.message : 'Unable to submit inquiry right now.');
    }
  };

  return (
    <header className="w-full">
      {/* CSS for 2s Slide Down Animation */}
      <style jsx global>{`
        @keyframes headerSlideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .header-animate {
          animation: headerSlideDown 2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* 1. TOP BAR */}
      <div 
        className={`border-b border-line/80 bg-[#F0F8FF]/90 hidden lg:block transition-all duration-[2000ms] ease-in-out origin-top ${
          isScrolled ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-20 py-2 opacity-100'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-12 flex justify-between items-center text-[13px] text-gray-600">
          <div className="flex items-center space-x-6 font-medium">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-slate-500" />
              <span>Emergency Line: <a href="tel:+918796911105" className="text-black hover:text-slate-700 transition-colors">+91-8796911105</a></span>
            </div>
            <div className="flex items-center gap-2 border-l pl-6 border-gray-200">
              <MapPin size={14} className="text-slate-500" />
              <span>108-A Ecotech-XII Greater Noida, U.P.India 201306</span>
            </div>
            <div className="flex items-center gap-2 border-l pl-6 border-gray-200">
              <Clock size={14} className="text-slate-500" />
              <span>Mon-Sat: 9.30am To 7.00pm</span>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center space-x-3 px-6 border-r border-gray-200">
              <Link href="#" className="hover:text-slate-700 transition-colors"><FaFacebookF /></Link>
              <Link href="#" className="hover:text-slate-700 transition-colors"><FaXTwitter /></Link>
              <Link href="#" className="hover:text-slate-700 transition-colors"><FaInstagram /></Link>
              <Link href="#" className="hover:text-slate-700 transition-colors"><FaLinkedinIn /></Link>
              <Link href="#" className="hover:text-slate-700 transition-colors"><FaYoutube /></Link>
            </div>
            <div className="relative pl-6 font-medium">
              <button
                type="button"
                onClick={() => setIsLanguageOpen((current) => !current)}
                className="flex items-center gap-1 cursor-pointer hover:text-slate-700 transition-colors"
                aria-expanded={isLanguageOpen}
              >
                <span className="text-base leading-none">{selectedLanguage.flag}</span>
                <span>{selectedLanguage.name}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className={`absolute right-0 top-[calc(100%+12px)] z-[70] w-72 origin-top-right overflow-hidden rounded-sm border border-[#E8E8E8] bg-white shadow-2xl transition-all duration-300 ${
                  isLanguageOpen ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible -translate-y-2 scale-95 opacity-0'
                }`}
              >
                <div className="max-h-80 overflow-y-auto py-2">
                  {languages.map((language) => {
                    const active = language.name === selectedLanguage.name;
                    return (
                      <button
                        key={language.name}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(language);
                          setIsLanguageOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                          active ? 'bg-[#F0F8FF] font-bold text-slate-900' : 'text-gray-600 hover:bg-[#F0F8FF] hover:text-slate-800'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="text-lg leading-none">{language.flag}</span>
                          <span className="truncate">{language.name}</span>
                        </span>
                        {active ? <span className="h-2 w-2 rounded-full bg-[#DF1F26]" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div 
        className={`z-50 w-full transition-all duration-[8000ms] ease-in-out ${
          isScrolled 
            ? 'fixed top-0 left-0 bg-white/95 backdrop-blur-md shadow-lg header-animate' 
            : 'relative bg-white/95 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 xl:px-12 border-b border-line/70">
          <nav className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href={hrefFor('/')} className="ml-0 flex-shrink-0 sm:ml-2 lg:ml-4">
              <Image 
                src="/radicon-logo.png" 
                alt="Logo" 
                width={100} 
                height={40} 
                className="object-contain"
                style={{ width: '100px', height: 'auto' }}
                priority
              />
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex items-center gap-5 text-[15px] text-gray-900 font-medium xl:gap-10 xl:text-[16px]">
              <li className="group relative">
                <Link href={hrefFor('/')} className="flex items-center gap-1 text-slate-900 transition-colors hover:text-slate-600">
                  Home  
                </Link>
              </li>
              <li className="group relative">
                <Link href={hrefFor('/about')} className="flex items-center gap-1 transition-colors hover:text-slate-600">
                  About Us <ChevronDown size={14} />
                </Link>
                <div className="absolute top-[100%] left-0 hidden group-hover:block bg-white shadow-xl w-[200px] py-3 rounded-b-md">
                  {aboutLinks.map((item) => (
                    <Link key={item.slug || 'at-a-glance'} href={getAboutPath(item.slug)} className="block px-6 py-2 text-sm transition-transform duration-300 ease-in-out hover:translate-x-2 hover:text-slate-700">
                      {item.title.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </li>

              <li className="group relative">
                <Link href={hrefFor('/services')} className="flex items-center gap-1 transition-colors hover:text-slate-600">
                  Medicine Range
                  <ChevronDown size={14} />
                </Link>
                <div className="absolute top-[100%] left-0 hidden group-hover:block bg-white shadow-xl  w-[200px] py-3 rounded-b-md">
                  <Link href="/categories" className="block px-6 py-2 text-sm hover:text-slate-700">All Categories</Link>
                  {categories.map((category) => (
                    <Link key={category._id} href={getCategoryPath(category.slug)} className="block px-6 py-2 text-sm hover:bg-[#F0F8FF] hover:text-slate-700">
                      {category.name}
                    </Link>
                  ))}
                </div>
              </li>
               <li className="group relative">
                <Link href={hrefFor('/services')} className="flex items-center gap-1 transition-colors hover:text-slate-600">
                  Services
                  <ChevronDown size={14} />
                </Link>
                <div className="absolute top-[100%] right-0 hidden group-hover:block bg-white shadow-xl  w-[450px] py-3 rounded-b-md xl:left-0 xl:right-auto">
                  {serviceLinks.map((service) => (
                    <Link key={service.slug} href={getServicePath(service.slug)} className="block px-6 py-2 text-sm hover:text-slate-700">
                      {service.title.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </li>
              <li><Link href={hrefFor('/blogs')} className="hover:text-slate-600 transition-colors">Blog</Link></li>
              <li><Link href={hrefFor('/contact')} className="hover:text-slate-600 transition-colors">Contact</Link></li>
            </ul>

            {/* Right Side Icons & CTA */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              <button className="p-2 hover:text-slate-600 transition-colors hidden sm:block">
                <Search size={22} />
              </button>
              
              <button
                type="button"
                onClick={openContactModal}
                className="hidden md:block border border-[#E8E8E8] bg-white px-4 py-3 rounded-sm font-bold text-slate-700 hover:bg-[#F0F8FF] transition-all uppercase text-[11px] tracking-widest shadow-sm active:scale-95 xl:px-7 xl:text-[12px]"
              >
                Get Appointment
              </button>

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 text-gray-800 hover:bg-[#F0F8FF] hover:text-slate-700 rounded-md transition-all"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* 3. MOBILE MENU - Updated with onClick handlers */}
      <div className={`
        lg:hidden fixed inset-x-0 z-40 bg-white transition-all duration-[2000ms] ease-in-out border-b shadow-2xl
        ${isMobileMenuOpen ? 'top-[72px] opacity-100 visible' : 'top-[-100%] opacity-0 invisible'}
      `}>
        <div className="max-h-[calc(100vh-72px)] space-y-4 overflow-y-auto px-5 py-6 sm:px-6 sm:py-8">
          <Link href={hrefFor('/')} onClick={closeMobileMenu} className="block text-lg font-bold border-b pb-2 text-slate-900">Home</Link>
          <Link href={hrefFor('/about')} onClick={closeMobileMenu} className="block text-lg font-medium border-b pb-2">About Us</Link>
          {aboutLinks.slice(1).map((item) => (
            <Link key={item.slug} href={getAboutPath(item.slug)} onClick={closeMobileMenu} className="block border-b pb-2 pl-4 text-base font-medium text-gray-600">
              {item.title}
            </Link>
          ))}
          <Link href="/categories" onClick={closeMobileMenu} className="block text-lg font-medium border-b pb-2">Categories</Link>
          {categories.map((category) => (
            <Link key={category._id} href={getCategoryPath(category.slug)} onClick={closeMobileMenu} className="block border-b pb-2 pl-4 text-base font-medium text-gray-600">
              {category.name}
            </Link>
          ))}
          <Link href={hrefFor('/services')} onClick={closeMobileMenu} className="block text-lg font-medium border-b pb-2">Services</Link>
          {serviceLinks.map((service) => (
            <Link key={service.slug} href={getServicePath(service.slug)} onClick={closeMobileMenu} className="block border-b pb-2 pl-4 text-base font-medium text-gray-600">
              {service.title}
            </Link>
          ))}
          <Link href={hrefFor('/blogs')} onClick={closeMobileMenu} className="block text-lg font-medium border-b pb-2">Blog</Link>
          <div className="border-b pb-4">
            <button
              type="button"
              onClick={() => setIsLanguageOpen((current) => !current)}
              className="flex w-full items-center justify-between text-lg font-medium"
              aria-expanded={isLanguageOpen}
            >
              <span className="flex items-center gap-2">
                <span>{selectedLanguage.flag}</span>
                <span>Language</span>
              </span>
              <ChevronDown size={18} className={`transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ${isLanguageOpen ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                  {languages.map((language) => {
                    const active = language.name === selectedLanguage.name;
                    return (
                      <button
                        key={language.name}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(language);
                          setIsLanguageOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                          active ? 'bg-[#F0F8FF] font-bold text-slate-900' : 'text-gray-600 hover:bg-[#F0F8FF]'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="text-lg leading-none">{language.flag}</span>
                          <span className="truncate">{language.name}</span>
                        </span>
                        {active ? <span className="h-2 w-2 rounded-full bg-[#DF1F26]" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => { closeMobileMenu(); openContactModal(); }} className="block w-full border border-[#E8E8E8] bg-[#F0F8FF] py-4 text-center font-bold text-slate-800 shadow-sm">Get Appointment</button>
          <Link href={hrefFor('/contact')} onClick={closeMobileMenu} className="block text-lg font-medium border-b pb-2">Contact</Link>
          
          <div className="pt-4 flex flex-col space-y-3 text-sm text-gray-600">
             <div className="flex items-center gap-3 font-medium">
                <Phone size={18} className="text-slate-500" />
                <span>+91-8796911105</span>
             </div>
             <div className="flex items-center gap-3 font-medium">
                <MapPin size={18} className="text-slate-500" />
                <span>Greater Noida, U.P.</span>
             </div>
          </div>
        </div>
      </div>

      <div
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
              <h2 id="navbar-contact-title" className="mt-2 text-2xl font-bold text-slate-950">Send an inquiry</h2>
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
    </header>
  );
};

export default Navbar;
