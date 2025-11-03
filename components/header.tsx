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
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-xl text-neutral-900 hidden sm:inline">Basha Lagbe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/search" className="text-neutral-600 hover:text-primary transition-colors">
              Search
            </Link>
            <Link href="/host" className="text-neutral-600 hover:text-primary transition-colors">
              Become a Host
            </Link>
            <Link href="/about" className="text-neutral-600 hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-neutral-600 hover:text-primary transition-colors hidden sm:inline">
              Login
            </Link>
            <Link href="/signup" className="btn-primary text-sm">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="/search" className="block px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded">
              Search
            </Link>
            <Link href="/host" className="block px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded">
              Become a Host
            </Link>
            <Link href="/about" className="block px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded">
              About
            </Link>
            <Link href="/login" className="block px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded">
              Login
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
