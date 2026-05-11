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
import type { PublicSeoRoute } from '@/lib/seoRoutes';
import { getAboutPages, getAboutPath } from '@/lib/aboutData';
import { getCategories } from '@/lib/productApi';
import { getCategoryPath } from '@/lib/categoryUrls';
import { getServicePath, getServices } from '@/lib/serviceData';
import type { Category } from '@/types/product';


const aboutLinks = getAboutPages();
const serviceLinks = getServices();

const Navbar = ({ initialRoutes }: { initialRoutes?: PublicSeoRoute[] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
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
            <div className="flex items-center gap-1 pl-6 cursor-pointer hover:text-slate-700 transition-colors font-medium">
              <span>English</span>
              <ChevronDown size={12} />
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
              
              <Link 
                href={hrefFor('/appointment')} 
                className="hidden md:block border border-[#E8E8E8] bg-white px-4 py-3 rounded-sm font-bold text-slate-700 hover:bg-[#F0F8FF] transition-all uppercase text-[11px] tracking-widest shadow-sm active:scale-95 xl:px-7 xl:text-[12px]"
              >
                Get Appointment
              </Link>

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
          <Link href={hrefFor('/appointment')} onClick={closeMobileMenu} className="block border border-[#E8E8E8] bg-[#F0F8FF] py-4 text-center font-bold text-slate-800 shadow-sm">Get Appointment</Link>
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
    </header>
  );
};

export default Navbar;
