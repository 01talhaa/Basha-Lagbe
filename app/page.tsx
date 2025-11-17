"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import SearchBar from "@/components/search-bar"
import HomepageChatbot from "@/components/homepage-chatbot"
import TestimonialSlider from "../components/testimonial-slider"
import WhatsAppButton from "@/components/whatsapp-button"

interface Listing {
  _id: string
  title: string
  description: string
  location: {
    city: string
    state: string
  }
  propertyType: string
  bedrooms: number
  bathrooms: number
  pricePerMonth: number
  images: string[]
  rating: number
  reviewCount: number
}

export default function HomePage() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/listings")
        const data = await response.json()
        if (data.success) {
          setFeaturedListings(data.listings.slice(0, 3))
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  return (
    <div className="min-h-screen">
      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-accent-blue text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center mb-12 space-y-6">
            <div className="inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-accent-gold rounded-full mr-2 animate-pulse"></span>
                Trusted by thousands of renters in Bangladesh
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-accent-gold to-yellow-300 bg-clip-text text-transparent">
                Home Away From Home
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
              Discover premium apartments, studios, and rooms for long-term stays in Bangladesh
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent-gold mb-2">10K+</div>
              <div className="text-sm md:text-base text-white/80">Properties</div>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-accent-gold mb-2">50+</div>
              <div className="text-sm md:text-base text-white/80">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent-gold mb-2">25K+</div>
              <div className="text-sm md:text-base text-white/80">Happy Renters</div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-20 fill-neutral-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      <HomepageChatbot />

      {/* Featured Listings */}
      <section className="bg-neutral-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full">
                Popular Listings
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">
              Discover Your Next Home
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Handpicked apartments offering the best comfort, location, and value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
                  <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : featuredListings.length > 0 ? (
              featuredListings.map((listing, index) => (
                <Link
                  key={listing._id}
                  href={`/listing/${listing._id}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={listing.images[0] || "/placeholder.svg"}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary">
                      ${listing.pricePerMonth}/mo
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-neutral-600 mb-4 line-clamp-2">
                      {listing.location.city}, {listing.location.state}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {listing.bedrooms} beds
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {listing.bathrooms} baths
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-neutral-600">No listings available yet</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link 
              href="/search" 
              className="group inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
            >
              Explore All Properties
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary-dark to-accent-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose Basha-Lagbe?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Experience the easiest way to find and book your perfect apartment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 hover:border-accent-gold/50 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-accent-gold/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-accent-gold/30">
                <svg className="w-7 h-7 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Search</h3>
              <p className="text-white/80 leading-relaxed">
                Find your ideal apartment with our powerful search filters and AI-powered recommendations
              </p>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 hover:border-accent-gold/50 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-accent-gold/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-accent-gold/30">
                <svg className="w-7 h-7 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Listings</h3>
              <p className="text-white/80 leading-relaxed">
                All properties are verified and reviewed by our team to ensure quality and authenticity
              </p>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 hover:border-accent-gold/50 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-accent-gold/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-accent-gold/30">
                <svg className="w-7 h-7 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Best Prices</h3>
              <p className="text-white/80 leading-relaxed">
                Competitive pricing with no hidden fees. Get the best value for your budget
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialSlider />

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-accent-blue text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-block mb-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent-gold/20 backdrop-blur-sm border border-accent-gold/30 text-sm font-medium text-accent-gold">
                  For Property Owners
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Start Earning From Your Property Today
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Join thousands of hosts who are already earning passive income by listing their properties on Basha-Lagbe
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-gold flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-accent-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg text-white/90">Free to list your property</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-gold flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-accent-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg text-white/90">Reach millions of potential renters</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-gold flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-accent-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg text-white/90">Secure and hassle-free payments</span>
                </div>
              </div>

              <Link
                href="/host/new-listing"
                className="group inline-flex items-center gap-3 bg-accent-gold hover:bg-yellow-400 text-neutral-900 px-8 py-4 rounded-xl font-bold shadow-2xl shadow-accent-gold/30 hover:shadow-accent-gold/50 transition-all duration-300 hover:scale-105"
              >
                List Your Property Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 to-transparent rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <span className="text-white/80">Monthly Revenue</span>
                      <span className="text-2xl font-bold text-accent-gold">৳3,50,000+</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <span className="text-white/80">Booking Rate</span>
                      <span className="text-2xl font-bold text-accent-gold">95%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <span className="text-white/80">Avg. Rating</span>
                      <span className="text-2xl font-bold text-accent-gold">4.8★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
