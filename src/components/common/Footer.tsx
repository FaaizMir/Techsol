"use client"

// import Link from "next/link"
import Link from "next/link"
import { Zap, Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Zap className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                TechCraft Solutions
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Next-gen digital solutions for modern businesses. We transform visions into reality using cutting-edge
              web, app, and cloud technologies.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 mr-3 text-cyan-400" />
                hello@techcraft.dev
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="h-5 w-5 mr-3 text-cyan-400" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center text-gray-300">
                <MapPin className="h-5 w-5 mr-3 text-cyan-400" />
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} TechCraft Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
