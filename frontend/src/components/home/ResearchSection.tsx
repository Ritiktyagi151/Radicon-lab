'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ChevronLeft, ChevronRight } from 'lucide-react'

const researchImages = [
  "/product-radicon/AZICON-250.jpg",
  "/product-radicon/Levorad-500.jpg",
  "/product-radicon/Montecon-LC.jpg",
  "/product-radicon/MuscleRelax Forte.jpg",
  "/product-radicon/Spasmorad-40.jpg",
  "/product-radicon/OLAPiNE-5.jpg",
  "/product-radicon/OLAPiNE-5.jpg",
  "/product-radicon/VITARAD_C 500mg.jpg",
  "/product-radicon/AZICON-250.jpg",
  "/product-radicon/Levorad-500.jpg",
  "/product-radicon/Montecon-LC.jpg",
  "/product-radicon/MuscleRelax Forte.jpg"
]

export default function ResearchSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % researchImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + researchImages.length) % researchImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  // Auto-slide every 3 seconds - stops on hover
  useEffect(() => {
    if (!isAutoPlaying || isHovering) return
    
    const interval = setInterval(() => {
      nextSlide()
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, isHovering, currentIndex])

  // Calculate visible images (5 at a time)
  const getVisibleImages = () => {
    const visible: { src: string; index: number }[] = []
    for (let i = 0; i < 5; i++) {
      const imgIndex = (currentIndex + i) % researchImages.length
      visible.push({
        src: researchImages[imgIndex],
        index: imgIndex
      })
    }
    return visible
  }

  return (
    <section className="w-full">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="mx-auto max-w-7xl rounded-t-lg bg-white px-4 py-12 text-center shadow-[0_20px_60px_rgba(39,96,134,0.10)]"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#111111] leading-tight">
          Delivering Quality Healthcare<br />
          Through Advanced Manufacturing
        </h2>
      </motion.div>

      {/* Image Gallery Slider */}
      <div 
        className="relative w-full bg-gray-100 overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Previous Button */}
        <button
          onClick={() => {
            prevSlide()
            setIsAutoPlaying(false)
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-[#111111]" />
        </button>

        {/* Next Button */}
        <button
          onClick={() => {
            nextSlide()
            setIsAutoPlaying(false)
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-[#111111]" />
        </button>

        {/* Images Grid - Smooth one-by-one slide */}
        <div className="relative w-full overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full">
            {getVisibleImages().map((item, index) => (
              <motion.div
                key={`${item.index}-${currentIndex}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6, 
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
                whileHover={{ y: -10, rotateX: 4, rotateY: index % 2 === 0 ? -5 : 5, scale: 1.02 }}
                className="relative aspect-[4/5] overflow-hidden border-r border-white last:border-0 group [transform-style:preserve-3d]"
              >
                {/* Image */}
                <img 
                  src={item.src} 
                  alt={`Research ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-75"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-12 h-1 bg-[#E8E8E8] mb-3"></div>
                    <p className="text-white font-semibold text-sm md:text-base">
                      Research & Development
                    </p>
                    <p className="text-white/80 text-xs mt-1">
                      Advanced Laboratory
                    </p>
                  </div>
                </div>

                {/* Corner Plus Icon on Hover */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white text-gray-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg">
                  <span className="text-gray-700 text-2xl font-light">+</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {researchImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/80 w-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Blue CTA Bar */}
      <div className="bg-[#F0F8FF] py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
        >
          
          {/* Left Text */}
          <div className="text-gray-800 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-1">
              Looking for Trusted Pharmaceutical Solutions?
            </h3>
            <p className="text-lg md:text-xl font-semibold text-gray-600">
               Contract Manufacturing & Healthcare Services
            </p>
          </div>

          {/* Right Phone Info */}
          <div className="flex items-center gap-4">
            <div className="text-right text-gray-700 hidden sm:block">
              <p className="text-xs uppercase tracking-wider opacity-80">Support Available</p>
              <a href="tel:+919971479938" className="text-xl md:text-2xl font-bold hover:underline">
                +91 99714 79938
              </a>
            </div>
            
            <div className="w-14 h-14 bg-white rounded-sm flex items-center justify-center shadow-lg hover:-translate-y-1 hover:rotate-6 hover:scale-110 transition-transform duration-300 cursor-pointer">
              <Phone className="text-slate-500 w-7 h-7 fill-slate-500/10" />
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}