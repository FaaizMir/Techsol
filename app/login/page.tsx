"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ✅ Import Link

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // Next.js router

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://techsol-backend-production.up.railway.app/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        router.push("/dashboardmain");
      }, 1200);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)]"
    >
      <motion.form 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        onSubmit={handleLogin}
        className="bg-[#0a0f1c] bg-[radial-gradient(circle_at_30%_70%,#0a0f7c,#0d1117)] rounded-2xl shadow-2xl p-8 w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)] text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none placeholder-gray-400"
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#0a0f1c] bg-[radial-gradient(circle_at_50%_50%,#0a0f2c,#0d1117)] text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none placeholder-gray-400"
          required
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-indigo-600 text-white rounded-lg py-3 font-semibold shadow-md hover:bg-indigo-700 transition"
        >
          Login
        </motion.button>

        {/* Message */}
        {message && (
          <p className="text-center text-sm text-gray-400 mt-2">{message}</p>
        )}

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-indigo-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.form>
    </motion.div>
  );
}
