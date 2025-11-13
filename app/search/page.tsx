"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import SearchFilters from "@/components/search-filters"
import AdvancedSearch from "@/components/advanced-search"
import type { SearchFilters as SearchFiltersType } from "@/data/types"

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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [filters, setFilters] = useState<SearchFiltersType>({
    location: searchParams.get("location") || "",
    sortBy: "price-asc",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.location) params.append("city", filters.location)
        if (filters.propertyType) params.append("propertyType", filters.propertyType)
        if (filters.minPrice) params.append("minPrice", filters.minPrice.toString())
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString())
        if (filters.bedrooms) params.append("bedrooms", filters.bedrooms.toString())

        const response = await fetch(`/api/listings?${params.toString()}`)
        const data = await response.json()
        
        if (data.success) {
          let results = data.listings

          // Apply client-side sorting
          if (filters.sortBy === "price-asc") {
            results.sort((a: Listing, b: Listing) => a.pricePerMonth - b.pricePerMonth)
          } else if (filters.sortBy === "price-desc") {
            results.sort((a: Listing, b: Listing) => b.pricePerMonth - a.pricePerMonth)
          } else if (filters.sortBy === "rating") {
            results.sort((a: Listing, b: Listing) => (b.rating || 0) - (a.rating || 0))
          }

          setListings(results)
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error)
      } finally {
        setLoading(false)
      }
    }
    performSearch()
  }, [filters])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <SearchFilters filters={filters} setFilters={setFilters} />
            <AdvancedSearch />
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Search Results</h1>
              <p className="text-neutral-600">{listings.length} apartments found</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
                    <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map((listing) => (
                  <Link
                    key={listing._id}
                    href={`/listing/${listing._id}`}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
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
                      {listing.rating && (
                        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-sm flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {listing.rating}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-1">
                        {listing.title}
                      </h3>
                      <p className="text-neutral-600 mb-4 line-clamp-2">
                        {listing.location.city}, {listing.location.state}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
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
                      <p className="text-sm text-neutral-500 line-clamp-2">{listing.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-600 text-lg">No listings found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
