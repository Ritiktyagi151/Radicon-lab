"use client";

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import dynamic from 'next/dynamic';

const AppointmentModal = dynamic(() => import('./AppointmentModal'), { ssr: false });
const SearchPanel = dynamic(() => import('./SearchPanel'), { ssr: false });
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
  Globe2,
  Menu,
  X
} from 'lucide-react';
import { useSeoRoutes } from '@/lib/admin/useSeoRoutes';
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

const googleLanguageCodes: Record<string, string> = {
  Afrikaans: 'af',
  Albanian: 'sq',
  Amharic: 'am',
  Arabic: 'ar',
  Armenian: 'hy',
  Azerbaijani: 'az',
  Bengali: 'bn',
  Bosnian: 'bs',
  Bulgarian: 'bg',
  Burmese: 'my',
  Catalan: 'ca',
  'Chinese (Simplified)': 'zh-CN',
  'Chinese (Traditional)': 'zh-TW',
  Croatian: 'hr',
  Czech: 'cs',
  Danish: 'da',
  Dutch: 'nl',
  'English (UK)': 'en',
  'English (US)': 'en',
  Estonian: 'et',
  Filipino: 'tl',
  Finnish: 'fi',
  French: 'fr',
  Georgian: 'ka',
  German: 'de',
  Greek: 'el',
  Gujarati: 'gu',
  Hebrew: 'iw',
  Hindi: 'hi',
  Hungarian: 'hu',
  Icelandic: 'is',
  Indonesian: 'id',
  Irish: 'ga',
  Italian: 'it',
  Japanese: 'ja',
  Kannada: 'kn',
  Kazakh: 'kk',
  Khmer: 'km',
  Korean: 'ko',
  Lao: 'lo',
  Latvian: 'lv',
  Lithuanian: 'lt',
  Malay: 'ms',
  Malayalam: 'ml',
  Marathi: 'mr',
  Mongolian: 'mn',
  Nepali: 'ne',
  Norwegian: 'no',
  Persian: 'fa',
  Polish: 'pl',
  'Portuguese (Brazil)': 'pt',
  'Portuguese (Portugal)': 'pt',
  Punjabi: 'pa',
  Romanian: 'ro',
  Russian: 'ru',
  Serbian: 'sr',
  Sinhala: 'si',
  Slovak: 'sk',
  Slovenian: 'sl',
  Spanish: 'es',
  Swahili: 'sw',
  Swedish: 'sv',
  Tamil: 'ta',
  Telugu: 'te',
  Thai: 'th',
  Turkish: 'tr',
  Ukrainian: 'uk',
  Urdu: 'ur',
  Uzbek: 'uz',
  Vietnamese: 'vi',
  Welsh: 'cy',
  Zulu: 'zu',
};

const googleTranslateLanguages = Array.from(new Set(Object.values(googleLanguageCodes))).join(',');

type GoogleTranslateElementConstructor = new (
  options: {
    pageLanguage: string;
    includedLanguages: string;
    autoDisplay: boolean;
  },
  elementId: string
) => unknown;

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: GoogleTranslateElementConstructor;
      };
    };
  }
}

const Navbar = ({ initialRoutes }: { initialRoutes?: PublicSeoRoute[] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [translationRequested, setTranslationRequested] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(languages.find((language) => language.name === 'English (US)') || languages[0]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [pendingLanguageCode, setPendingLanguageCode] = useState('');
  const { hrefFor } = useSeoRoutes(initialRoutes);
  const filteredLanguages = useMemo(() => {
    const query = languageSearch.trim().toLowerCase();
    if (!query) return languages;
    return languages.filter((language) => language.name.toLowerCase().includes(query));
  }, [languageSearch]);
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

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      const TranslateElement = window.google?.translate?.TranslateElement;
      if (!TranslateElement) return;

      new TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: googleTranslateLanguages,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // Restore an existing language choice without loading translation for new visitors.
    const restoreTimer = window.setTimeout(() => {
      if (document.cookie.split(';').some((cookie) => cookie.trim().startsWith('googtrans='))) {
        setTranslationRequested(true);
      }
    }, 0);

    return () => {
      window.clearTimeout(restoreTimer);
      window.googleTranslateElementInit = undefined;
    };
  }, []);

  useEffect(() => {
    if (!pendingLanguageCode) return;

    const deadline = Date.now() + 15000;
    const timer = window.setInterval(() => {
      if (Date.now() > deadline) {
        window.clearInterval(timer);
        return;
      }
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (!select) return;

      select.value = pendingLanguageCode;
      select.dispatchEvent(new Event('change'));
      setPendingLanguageCode('');
      window.clearInterval(timer);
    }, 250);

    return () => window.clearInterval(timer);
  }, [pendingLanguageCode]);

  const handleLanguageSelect = (language: (typeof languages)[number]) => {
    setTranslationRequested(true);
    const languageCode = googleLanguageCodes[language.name] || 'en';
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');

    setSelectedLanguage(language);
    setIsLanguageOpen(false);
    setLanguageSearch('');
    closeMobileMenu();

    if (select) {
      select.value = languageCode;
      select.dispatchEvent(new Event('change'));
      return;
    }

    setPendingLanguageCode(languageCode);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    setIsMobileMenuOpen(false);
  };

  // Function to close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  return (
    <header className="w-full">
      <div id="google_translate_element" className="hidden" aria-hidden="true" />
      {translationRequested && <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />}

      {/* CSS for 2s Slide Down Animation */}
      <style jsx global>{`
        @keyframes headerSlideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .header-animate {
          animation: headerSlideDown 2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .goog-te-banner-frame,
        .goog-te-gadget,
        .skiptranslate {
          display: none !important;
        }
        body {
          top: 0 !important;
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
              <span>Emergency Line: <a href="tel:+918796911105" className="text-black hover:text-slate-700 transition-colors">+91 8796911105</a></span>
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
              <Link href="https://www.facebook.com/people/Radicon-Laboratories-Ltd/61570856968202/?rdid=r9luudJKmBIB0nLO&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CaBY4WqpT%2F" target="_blank" rel="noreferrer" className="hover:text-slate-700 transition-colors"><FaFacebookF /></Link>
              <Link href="https://x.com/radiconlabsltd?t=wHM92aoO5oyHsB25pQJJ5Q&s=09" target="_blank" rel="noreferrer" className="hover:text-slate-700 transition-colors"><FaXTwitter /></Link>
              <Link href="https://www.instagram.com/radiconlaboratorieslimited?igsh=MWowOGl4dHk3bzI4cw==" target="_blank" rel="noreferrer" className="hover:text-slate-700 transition-colors"><FaInstagram /></Link>
              <Link href="https://www.linkedin.com/company/radicon-laboratories-limited./" target="_blank" rel="noreferrer" className="hover:text-slate-700 transition-colors"><FaLinkedinIn /></Link>
              <Link href="https://www.youtube.com/@radiconlaboratoriesltd" target="_blank" rel="noreferrer" className="hover:text-slate-700 transition-colors"><FaYoutube /></Link>
            </div>
            <div className="relative pl-6 font-medium">
              <button
                type="button"
                onClick={() => setIsLanguageOpen((current) => !current)}
                className="flex items-center gap-1 cursor-pointer hover:text-slate-700 transition-colors"
                aria-expanded={isLanguageOpen}
              >
                <Globe2 size={15} className="text-slate-500" />
                <span>{selectedLanguage.name}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className={`absolute right-0 top-[calc(100%+12px)] z-[70] w-72 origin-top-right overflow-hidden rounded-sm border border-[#E8E8E8] bg-white shadow-2xl transition-all duration-300 ${
                  isLanguageOpen ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible -translate-y-2 scale-95 opacity-0'
                }`}
              >
                <div className="border-b border-[#E8E8E8] p-3">
                  <label className="sr-only" htmlFor="desktop-language-search">Search language</label>
                  <input
                    id="desktop-language-search"
                    value={languageSearch}
                    onChange={(event) => setLanguageSearch(event.target.value)}
                    placeholder="Search language"
                    className="w-full rounded-sm border border-[#E8E8E8] bg-[#F0F8FF] px-3 py-2 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                  />
                </div>
                <div className="max-h-80 overflow-y-auto py-2">
                  {filteredLanguages.map((language) => {
                    const active = language.name === selectedLanguage.name;
                    return (
                      <button
                        key={language.name}
                        type="button"
                        onClick={() => {
                          handleLanguageSelect(language);
                        }}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                          active ? 'bg-[#F0F8FF] font-bold text-slate-900' : 'text-gray-600 hover:bg-[#F0F8FF] hover:text-slate-800'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="w-10 shrink-0 rounded-sm bg-[#F0F8FF] px-2 py-1 text-center text-[11px] font-bold uppercase text-slate-600">
                            {googleLanguageCodes[language.name] || 'en'}
                          </span>
                          <span className="truncate">{language.name}</span>
                        </span>
                        {active ? <span className="h-2 w-2 rounded-full bg-[#DF1F26]" /> : null}
                      </button>
                    );
                  })}
                  {!filteredLanguages.length ? (
                    <p className="px-4 py-3 text-sm font-semibold text-gray-500">No language found</p>
                  ) : null}
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
          <nav className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo */}
            <Link href={hrefFor('/')} className="ml-0 flex-shrink-0 sm:ml-2 lg:ml-4">
              <Image 
                src="/radicon-logo.png" 
                alt="Logo" 
                width={100} 
                height={40} 
                className="h-auto w-[88px] object-contain sm:w-[100px]"
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
                <span className="flex items-center gap-1 transition-colors hover:text-slate-600 cursor-pointer">
                  Medicine Range
                  <ChevronDown size={14} />
                </span>
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
                <span className="flex items-center gap-1 transition-colors hover:text-slate-600 cursor-pointer">
                  Services
                  <ChevronDown size={14} />
                </span>
                <div className="absolute top-[100%] right-0 hidden group-hover:block bg-white shadow-xl  w-[450px] py-3 rounded-b-md xl:left-0 xl:right-auto">
                  {serviceLinks.map((service) => (
                    <Link key={service.slug} href={getServicePath(service.slug)} className="block px-6 py-2 text-sm hover:text-slate-700">
                      {service.title.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </li>
              <li><Link href={hrefFor('/blog')} className="hover:text-slate-600 transition-colors">Blog</Link></li>
              <li><Link href={hrefFor('/contact')} className="hover:text-slate-600 transition-colors">Contact</Link></li>
            </ul>

            {/* Right Side Icons & CTA */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              <button
                type="button"
                onClick={openSearch}
                className="hidden p-2 transition-colors hover:text-slate-600 sm:block"
                aria-label="Open website search"
              >
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
        ${isMobileMenuOpen ? 'top-[64px] opacity-100 visible sm:top-[72px]' : 'top-[-100%] opacity-0 invisible'}
      `}>
        <div className="max-h-[calc(100vh-64px)] space-y-4 overflow-y-auto px-5 py-6 sm:max-h-[calc(100vh-72px)] sm:px-6 sm:py-8">
          <button
            type="button"
            onClick={openSearch}
            className="flex w-full items-center gap-3 border border-[#E8E8E8] bg-[#F0F8FF] px-4 py-3 text-left text-base font-bold text-slate-800"
          >
            <Search size={18} className="text-slate-500" />
            <span>Search products, blogs, services</span>
          </button>
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
          <Link href={hrefFor('/blog')} onClick={closeMobileMenu} className="block text-lg font-medium border-b pb-2">Blog</Link>
          <div className="border-b pb-4">
            <button
              type="button"
              onClick={() => setIsLanguageOpen((current) => !current)}
              className="flex w-full items-center justify-between text-lg font-medium"
              aria-expanded={isLanguageOpen}
            >
              <span className="flex items-center gap-2">
                <Globe2 size={18} className="text-slate-500" />
                <span>Language</span>
              </span>
              <ChevronDown size={18} className={`transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ${isLanguageOpen ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <label className="sr-only" htmlFor="mobile-language-search">Search language</label>
                <input
                  id="mobile-language-search"
                  value={languageSearch}
                  onChange={(event) => setLanguageSearch(event.target.value)}
                  placeholder="Search language"
                  className="mb-3 w-full rounded-sm border border-[#E8E8E8] bg-[#F0F8FF] px-3 py-2 text-sm font-semibold outline-none transition focus:border-[#DF1F26] focus:bg-white"
                />
                <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                  {filteredLanguages.map((language) => {
                    const active = language.name === selectedLanguage.name;
                    return (
                      <button
                        key={language.name}
                        type="button"
                        onClick={() => {
                          handleLanguageSelect(language);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                          active ? 'bg-[#F0F8FF] font-bold text-slate-900' : 'text-gray-600 hover:bg-[#F0F8FF]'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="w-10 shrink-0 rounded-sm bg-[#F0F8FF] px-2 py-1 text-center text-[11px] font-bold uppercase text-slate-600">
                            {googleLanguageCodes[language.name] || 'en'}
                          </span>
                          <span className="truncate">{language.name}</span>
                        </span>
                        {active ? <span className="h-2 w-2 rounded-full bg-[#DF1F26]" /> : null}
                      </button>
                    );
                  })}
                  {!filteredLanguages.length ? (
                    <p className="px-3 py-2 text-sm font-semibold text-gray-500">No language found</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => { closeMobileMenu(); openContactModal(); }} className="block w-full border border-[#E8E8E8] bg-[#F0F8FF] py-4 text-center font-bold text-slate-800 shadow-sm">Get Appointment</button>
          <Link href={hrefFor('/contact')} onClick={closeMobileMenu} className="block text-lg font-medium border-b pb-2">Contact</Link>
          
          <div className="pt-4 flex flex-col space-y-3 text-sm text-gray-600">
             <div className="flex items-center gap-3 font-medium">
                <Phone size={18} className="text-slate-500" />
                 <span>+91 8796911105</span>
             </div>
             <div className="flex items-center gap-3 font-medium">
                <MapPin size={18} className="text-slate-500" />
                <span>Greater Noida, U.P.</span>
             </div>
          </div>
        </div>
      </div>

      {isSearchOpen && <SearchPanel isScrolled={isScrolled} onClose={() => setIsSearchOpen(false)} />}
      {isContactModalOpen && <AppointmentModal onClose={() => setIsContactModalOpen(false)} />}
    </header>
  );
};

export default Navbar;
