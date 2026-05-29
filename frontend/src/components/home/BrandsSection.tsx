'use client'
import { motion } from 'framer-motion'

const brands = [
  {
    name: 'Orgie',
    logo: '/brands/brand1.png'
  },
  {
    name: 'siezta',
    logo: '/brands/brand2.png' // Replace with actual logo URL
  },
  {
    name: 'vita-rad',
    logo: '/brands/brand3.png' // Replace with actual logo URL
  },
  {
    name: 'super filana',
    logo: '/brands/brand4.png' // Replace with actual logo URL
  },
  {
    name: 'levifil',
    logo: '/brands/brand5.png' // Replace with actual logo URL
  },
  {
    name: 'extra super filana ',
    logo: '/brands/brand6.png' // Replace with actual logo URL
  },
  {
    name: 'missopil',
    logo: '/brands/brand7.png' // Replace with actual logo URL
  },
  {
    name: 'levifil super power',
    logo: '/brands/brand8.png' // Replace with actual logo URL
  },
  {
    name : "stenagra",
    logo: '/brands/brand9.png' // Replace with actual logo URL
  },
  {
    name: 'panto rad DSR',
    logo: '/brands/brand10.png' // Replace with actual logo URL
  },{
    name : "radiflame",
    logo: '/brands/brand11.png' // Replace with actual logo URL
  },{
    name : "super zodeo",
    logo: '/brands/brand12.png' // Replace with actual logo URL
  },{
    name : "rab con DSR",
    logo: '/brands/brand13.png' // Replace with actual logo URL
  },{
    name : "tigour power",
    logo: '/brands/brand14.png' // Replace with actual logo URL
  },{
    name : "fluxicon-20",
    logo: '/brands/brand15.png' // Replace with actual logo URL
  }
]

export default function BrandsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="floating-panel mx-auto max-w-7xl rounded-lg px-5 py-12 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gray-500">Our Brands</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-[#111111] sm:text-4xl">
             Our Trusted Pharmaceutical Brands
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
             Our in-house pharmaceutical brands are developed with advanced manufacturing standards, strict quality control, and a commitment to delivering safe and effective healthcare solutions trusted across the industry.
          </p>
        </motion.div>
        
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ delay: index * 0.04, duration: 0.45, ease: 'easeOut' }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group flex h-28 items-center justify-center rounded-sm border border-[#E8E8E8] bg-white px-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:bg-[#F0F8FF] hover:shadow-xl hover:shadow-blue-100/70 sm:h-32"
            >
              <div className="flex h-16 w-full items-center justify-center rounded-sm bg-[#F5F5F5] px-3 transition-all duration-300 group-hover:bg-white">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain  transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}