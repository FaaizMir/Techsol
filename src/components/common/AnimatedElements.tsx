"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface AnimatedTitleProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedTitle({ children, className = "", delay = 0.3 }: AnimatedTitleProps) {
  return (
    <motion.h2
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.7, delay, ease: [0.1, 0.25, 0.3, 1] }}
    >
      {children}
    </motion.h2>
  )
}

export function AnimatedSubtitle({ children, className = "", delay = 0.4 }: AnimatedTitleProps) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.7, delay, ease: [0.1, 0.25, 0.3, 1] }}
    >
      {children}
    </motion.p>
  )
}

export function AnimatedItem({ children, className = "", index = 0 }: AnimatedTitleProps & { index?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.1 + index * 0.1, 
        ease: [0.1, 0.25, 0.3, 1] 
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedFadeIn({ children, className = "", delay = 0.2 }: AnimatedTitleProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedScaleIn({ children, className = "", delay = 0.2 }: AnimatedTitleProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.1, 0.25, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
