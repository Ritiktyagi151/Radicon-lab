'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useSeoRoutes } from '@/lib/admin/useSeoRoutes'

export default function AboutSection() {
  const { hrefFor } = useSeoRoutes()
  // Animation variants for staggered text
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="floating-panel mx-auto max-w-7xl rounded-lg px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          
          {/* Left Content - Slides from Left with Stagger Animation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="mb-6 text-3xl font-bold leading-tight text-[#111111] sm:text-4xl lg:text-5xl"
            >
              Trusted Pharmaceutical <br /> Manufacturing Company
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="mb-4 text-base font-semibold text-[#111111] sm:text-lg"
            >
              Delivering quality medicines with global standards since 2007!
            </motion.p>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-500 leading-relaxed mb-8"
            >
              We manufacture Tablets, Capsules, Ointments, Syrups, Injectables, and Oral Strips with advanced technology and strict quality control.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Link href={hrefFor('/about')} className="group inline-flex items-center gap-3 border border-[#E8E8E8] bg-white px-8 py-4 font-bold text-gray-700 transition-all hover:border-blue-100 hover:bg-[#F0F8FF] hover:text-blue-700 hover:shadow-lg hover:shadow-blue-100/60">
                More About
                <span className="w-8 h-[2px] bg-gray-400 transition-all group-hover:w-12 group-hover:bg-blue-500"></span>
              </Link>
            </motion.div>

            {/* Middle Info (Signature & List) */}
            <motion.div 
              variants={itemVariants}
              className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-12"
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-gray-500 text-sm italic mb-4">
                  Modern manufacturing facilities with trusted quality assurance.
                </p>
                <h3 className="text-3xl text-[#111111] opacity-80 sm:text-4xl" style={{ fontFamily: 'cursive' }}>
                  Rakesh Kumar Khaneja
                </h3>
              </motion.div>

              <motion.ul 
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15,
                      delayChildren: 0.5
                    }
                  }
                }}
              >
                {['400+ Product Approvals',
                  '600+ Brand Generics in Market',
                  'WHO-GMP Quality Standards'].map((item, i) => (
                  <motion.li 
                    key={i} 
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex items-center gap-3 text-[#111111] font-medium"
                  >
                    <span className="flex-shrink-0 w-5 h-5 bg-[#E8E8E8] flex items-center justify-center transition-colors group-hover:bg-blue-50">
                      <Check className="text-blue-600 w-3 h-3" strokeWidth={4} />
                    </span>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>

          {/* Right Content - Slides from Right with Scale Effect */}
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative [perspective:1200px]"
          >
            <motion.div 
              className="relative z-10 [transform-style:preserve-3d]"
              whileHover={{ scale: 1.03, y: -8, rotateX: 4, rotateY: -5 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            >
              <img 
                src="/founder1.jpeg" 
                alt="Doctor with clipboard" 
                className="h-[360px] w-full rounded-sm object-cover shadow-lg sm:h-[440px] lg:h-[500px] lg:object-fill"
              />
            </motion.div>
            
            {/* Background Accent Square with Animation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute -bottom-3 -right-3 h-full w-full border-2 border-blue-100 -z-0 sm:-bottom-6 sm:-right-6"
            ></motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
