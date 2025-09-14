"use client"
import { PublicRoute } from "@/components/common/PublicRoute"
import "../globals.css"
import { motion } from "framer-motion"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const particleVariants = {
    animate: {
      y: [0, -100, 0],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut" as const,
      },
    },
  }

  return (
    <PublicRoute>
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,211,238,0.1),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(236,72,153,0.1),transparent_50%)]" />

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              variants={particleVariants as any}
              animate="animate"
              transition={{
                delay: Math.random() * 3,
                duration: 2 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          ))}

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen">
          {children}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="relative z-10 mt-8 text-center text-xs text-gray-500"
        >
          <p>Powered by Advanced Security Protocols</p>
          <p className="mt-1">© 2024 Techsol - Innovative Digital Solutions</p>
        </motion.div>
      </div>
    </PublicRoute>
  )
}