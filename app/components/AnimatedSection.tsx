"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface AnimatedSectionProps {
  children: ReactNode
  sectionId: string
  className?: string
  delay?: number
}

export default function AnimatedSection({ 
  children, 
  sectionId, 
  className = "", 
  delay = 0.2 
}: AnimatedSectionProps) {
  return (
    <motion.section
      data-section={sectionId}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.1, 0.25, 0.3, 1]
      }}
    >
      {children}
    </motion.section>
  )
}
