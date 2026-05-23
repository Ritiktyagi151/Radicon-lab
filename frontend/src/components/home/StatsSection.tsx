'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Microscope, FlaskConical, ClipboardCheck, Trophy } from 'lucide-react'

// --- Counter Hook ---
const Counter = ({ to, duration = 2 }: { to: number; duration?: number }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const totalMiliseconds = duration * 1000
      const incrementTime = totalMiliseconds / to
      const timer = setInterval(() => {
        start += 1
        setCount(start)
        if (start === to) clearInterval(timer)
      }, incrementTime)
      return () => clearInterval(timer)
    }
  }, [isInView, to, duration])
  return <span ref={ref}>{count}</span>
}

const stats = [
  { label: "Manufacturing Units", value: 24, icon: Microscope },
  { label: "Healthcare Partners", value: 272, icon: FlaskConical },
  { label: "Products Delivered", value: 423, icon: ClipboardCheck },
  { label: "Quality Certifications", value: 56, icon: Trophy },
]

const skills = [
  { name: "Quality Assurance", value: 95 },
  { name: "Contract Manufacturing", value: 90 },
  { name: "Research & Development", value: 92 },
  { name: "Regulatory Compliance", value: 88 },
]

export default function StatsSection() {
  return (
    <div className="relative overflow-hidden bg-[#F0F8FF]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] bg-[radial-gradient(ellipse_at_20%_20%,#FFFFFF_0_18%,transparent_19%),radial-gradient(ellipse_at_82%_54%,#FFFFFF_0_14%,transparent_15%)]" />
      
      {/* 1. COUNTER STATS SECTION */}
      <section className="relative z-20 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="floating-panel rounded-lg p-4 sm:p-8 lg:p-12 [perspective:1200px]"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ delay: idx * 0.08, duration: 0.45 }}
                  whileHover={{ y: -8, rotateX: 5, rotateY: idx % 2 === 0 ? -4 : 4, scale: 1.03 }}
                  className="flex items-center gap-4 border border-transparent p-3 transition hover:border-[#E8E8E8] hover:bg-[#F0F8FF] hover:shadow-lg [transform-style:preserve-3d]"
                >
                  <div className="text-slate-500">
                    <stat.icon className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                      <Counter to={stat.value} />
                    </h3>
                    <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. DARK BLUE HEADER SECTION */}
      <section className="relative mt-0 max-w-full lg:mt-[-100px] lg:max-w-[900px] overflow-hidden">
  
  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src="/texture.webp"
      alt="Background"
      className="w-full h-full object-cover"
    />
    
    {/* Dark Overlay */}
    <div className="  bg-[#0A1426]"></div>
  </div>

  <div className="relative bg-[#0A1426]/70 px-4 pb-20 pt-12 shadow-[0_24px_70px_rgba(39,96,134,0.10)] sm:px-6 sm:pb-24 sm:pt-16 lg:pt-40 lg:pb-60">
    <div className="max-w-7xl mx-auto lg:px-24">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
          Manufacturing Quality Medicines for a Healthier Future.
        </h2>

        <p className="mt-4 text-base text-gray-300 sm:text-lg">
          We are committed to delivering safe, effective, and affordable pharmaceutical products with global quality standards
        </p>
      </motion.div>
    </div>
  </div>
</section>

      {/* 3. OVERLAPPING CONTENT (PROGRESS & VIDEO) */}
      <div className="max-w-7xl mx-auto z-[99] px-4 mt-[-40px] sm:mt-[-80px] lg:mt-[-180px] relative">
        <div className="flex flex-col lg:flex-row gap-0 items-stretch">
          
          {/* LEFT BLOCK: Progress Bars */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            whileHover={{ y: -6, rotateY: 2 }}
            className="bg-white p-5 shadow-lg sm:p-8 lg:w-1/2 lg:p-12 [transform-style:preserve-3d]"
          >
            <div className="space-y-8">
              {skills.map((skill, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between font-bold text-[#111111]">
                    <span>{skill.name}</span>
                    <span>{skill.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.value}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-slate-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT BLOCK: Video Section */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            whileHover={{ y: -8, rotateX: 2, rotateY: -3 }}
            className="relative group overflow-hidden shadow-xl lg:-inset-y-20 lg:w-1/2 [transform-style:preserve-3d]"
          >
            {/* Auto-playing Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full min-h-[280px] w-full object-cover sm:min-h-[360px] lg:min-h-[400px]"
            >
              <source src="https://d2j2uxe7jasn0r.cloudfront.net/watermarks/video/E6LxqQ1ixikssn79z/medicine-pills-tablets-rotating-on-green-background_bevjpxs3__2371880f1f476f681a8b16cc828f1872__P360.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            

            {/* Decorative Border */}
            <div className="absolute top-0 right-0 w-full h-full border-[15px] border-white pointer-events-none group-hover:border-white/20 transition-all"></div>
          </motion.div>

        </div>
      </div>

      <div className="h-20"></div>
    </div>
  )
}
