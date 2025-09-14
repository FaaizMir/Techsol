"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/providers/AuthProvider"

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      await login(email, password)
      setMessage("Login successful! Redirecting...")
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-8"
      >
        <motion.h1
          className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear" as const,
          }}
        >
          TECHSOL
        </motion.h1>
        <p className="text-gray-300 text-sm font-medium tracking-wide">
          Advanced Tech Solutions • AI • Cloud • 3D Modeling
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.form
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onSubmit={handleLogin}
          className="relative bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-8 w-96 flex flex-col gap-6"
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl -z-10" />

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-center text-white mb-2"
          >
            Secure Access Portal
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl p-4 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none placeholder-gray-400 transition-all duration-300 hover:border-gray-500"
              required
              disabled={isLoading}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="relative"
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl p-4 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none placeholder-gray-400 transition-all duration-300 hover:border-gray-500"
              required
              disabled={isLoading}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(34, 211, 238, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="relative bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl py-4 font-semibold shadow-lg hover:from-cyan-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" as const }}
              />
            )}
            <span className="relative z-10">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" as const }}
                  />
                  Authenticating...
                </div>
              ) : (
                "Access System"
              )}
            </span>
          </motion.button>

          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-center text-sm p-3 rounded-lg ${
                message.includes("successful")
                  ? "text-green-400 bg-green-500/10 border border-green-500/20"
                  : "text-red-400 bg-red-500/10 border border-red-500/20"
              }`}
            >
              {message}
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-sm text-gray-400 mt-4"
          >
            Need system access?{" "}
            <Link
              href="/signup"
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium hover:underline"
            >
              Request Account
            </Link>
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  )
}
