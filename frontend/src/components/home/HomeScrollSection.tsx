'use client'

import { motion } from 'framer-motion'

type HomeScrollSectionProps = {
  children: React.ReactNode
  direction?: 'up' | 'left' | 'right'
}

export default function HomeScrollSection({ children, direction = 'up' }: HomeScrollSectionProps) {
  const offset = {
    up: { x: 0, y: 44 },
    left: { x: -54, y: 0 },
    right: { x: 54, y: 0 },
  }[direction]

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: 0.16 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
