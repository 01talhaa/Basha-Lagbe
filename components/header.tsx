"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session?.user) {
      fetchUnreadCount()
      // Poll every 10 seconds
      const interval = setInterval(fetchUnreadCount, 10000)
      return () => clearInterval(interval)
    }
  }, [session])

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/messages/unread-count")
      if (res.ok) {
        const data = await res.json()
        setUnreadCount(data.count || 0)
      }
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

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
            {session?.user?.role === "owner" && (
              <Link href="/host/listings" className="text-neutral-700 hover:text-primary transition-colors font-medium">
                List Property
              </Link>
            )}
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
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse"></div>
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-primary"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <svg
                    className={`w-4 h-4 text-neutral-600 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-semibold text-neutral-900">{session.user.name}</p>
                      <p className="text-xs text-neutral-600 truncate">{session.user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                        {session.user.role}
                      </span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {session?.user?.role === "owner" && (
                      <Link
                        href="/host/listings"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Listings
                      </Link>
                    )}
                    <Link
                      href="/messages"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors relative"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Messages
                      {unreadCount > 0 && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/lease-requests"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Lease Requests
                    </Link>
                    <Link
                      href="/bookings"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <div className="border-t border-neutral-100 mt-2 pt-2">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-neutral-700 hover:text-primary transition-colors font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
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
              {session?.user ? (
                <>
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={40}
                          height={40}
                          className="rounded-full border-2 border-primary"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{session.user.name}</p>
                        <p className="text-xs text-neutral-600">{session.user.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard" className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium">
                    Dashboard
                  </Link>
                  {session?.user?.role === "owner" && (
                    <Link href="/host/listings" className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium">
                      My Listings
                    </Link>
                  )}
                  <Link href="/messages" className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium relative">
                    Messages
                    {unreadCount > 0 && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/lease-requests" className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium">
                    Lease Requests
                  </Link>
                  <Link href="/bookings" className="block px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium">
                    My Bookings
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="block mx-4 my-2 text-center bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
