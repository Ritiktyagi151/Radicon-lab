'use client'

import { motion } from 'framer-motion'
import { Microscope, FlaskConical, Beaker, Headset } from 'lucide-react'

const features = [
  {
    title: "Advanced Pharmaceutical Manufacturing",
    desc: "We use modern technology and precision-driven processes to manufacture safe and effective medicines.",
    icon: Microscope,
    active: true
  },
  {
    title: "Research & Development",
    desc: "Our expert R&D team focuses on innovative formulations and high-quality healthcare solutions.",
    icon: FlaskConical,
    active: false
  },
  {
    title: "Strict Quality Assurance",
    desc: "Every product undergoes rigorous quality testing to meet international pharmaceutical standards.",
    icon: Beaker,
    active: false
  },
  {
    title: "Reliable Customer Support",
    desc: "Our dedicated support team is always available to assist clients with product and service inquiries.",
    icon: Headset,
    active: false
  }
]

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-[#F5F5F5] px-4 py-16 sm:px-6 lg:px-8 lg:py-20 [perspective:1200px]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] bg-[repeating-radial-gradient(ellipse_at_center,#9CA3AF_0_2px,transparent_3px_24px)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="floating-panel grid grid-cols-1 overflow-hidden rounded-lg md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.28 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -12, rotateX: 5, rotateY: index % 2 === 0 ? -5 : 5, scale: 1.02 }}
              className={`group relative p-10 border border-gray-100 transition-all duration-500 cursor-pointer overflow-hidden
                ${feature.active ? 'bg-[#111111] text-white' : 'bg-white text-gray-900 hover:bg-[#F0F8FF]'}
                [transform-style:preserve-3d] hover:z-10 hover:shadow-2xl hover:shadow-gray-300/50
              `}
            >
              {/* Background Pattern Effect on Hover */}
              <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:block hidden">
                <div className="absolute top-0 right-0 p-4">
                  <feature.icon size={120} strokeWidth={1} />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 transition-transform duration-500 group-hover:translate-z-6">
                <div className={`mb-8 inline-block transition-colors duration-500 
                  ${feature.active ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}
                `}>
                  <feature.icon size={50} strokeWidth={1.5} />
                </div>

                <h3 className="text-xl font-bold mb-4 leading-snug">
                  {feature.title}
                </h3>

                <p className={`text-sm leading-relaxed transition-colors duration-500
                  ${feature.active ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-600'}
                `}>
                  {feature.desc}
                </p>
              </div>
              
              {/* Bottom Border Animation */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-white transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
