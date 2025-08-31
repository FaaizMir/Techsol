"use client"
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        password,
      });

      setMessage(res.data.message);

      // ✅ Navigate to login page if signup successful
      if (res.status === 201 || res.status === 200) {
        router.push("/login");  // <-- Make sure your login page is at /login
      }

    } catch (err: any) {
      setMessage(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600"
    >
      <motion.form
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onSubmit={handleSignup}
        className="bg-white rounded-2xl shadow-2xl p-8 w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-indigo-600 text-white rounded-lg py-3 font-semibold shadow-md hover:bg-indigo-700 transition"
        >
          Sign Up
        </motion.button>

        {message && (
          <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
        )}
      </motion.form>
    </motion.div>
  );
}
