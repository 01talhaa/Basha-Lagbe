"use client"

import Link from "next/link"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-dark rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-xl text-neutral-900 hidden sm:inline">Basha Lagbe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/search" className="text-neutral-700 hover:text-primary transition-colors font-medium">
              Find Rentals
            </Link>
            <Link href="/host/listings" className="text-neutral-700 hover:text-primary transition-colors font-medium">
              List Property
            </Link>
            <Link href="/about" className="text-neutral-700 hover:text-primary transition-colors font-medium">
              About Us
            </Link>
            <Link href="/contact" className="text-neutral-700 hover:text-primary transition-colors font-medium">
              Contact
            </Link>
            <Link href="/faq" className="text-neutral-700 hover:text-primary transition-colors font-medium">
              FAQ
            </Link>
            <Link href="/blog" className="text-neutral-700 hover:text-primary transition-colors font-medium">
              Blog
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-neutral-700 hover:text-primary transition-colors font-medium">
              Log In
            </Link>
            <Link href="/signup" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-1 border-t border-neutral-100">
            <Link href="/search" className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium">
              Find Rentals
            </Link>
            <Link href="/host/listings" className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium">
              List Property
            </Link>
            <Link href="/about" className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium">
              About Us
            </Link>
            <Link href="/contact" className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium">
              Contact
            </Link>
            <Link href="/faq" className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium">
              FAQ
            </Link>
            <Link href="/blog" className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium">
              Blog
            </Link>
            <div className="border-t border-neutral-100 pt-2 mt-2">
              <Link href="/login" className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium">
                Log In
              </Link>
              <Link href="/signup" className="block mx-4 my-2 text-center bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-all">
                Sign Up
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
