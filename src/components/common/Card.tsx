"use client"

import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`
      bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6
      ${hover ? "hover:bg-gray-800/70 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105" : ""}
      ${className}
    `}
    >
      {children}
    </div>
  )
}
