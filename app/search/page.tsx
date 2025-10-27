"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ListingCard from "@/components/listing-card"
import SearchFilters from "@/components/search-filters"
import AdvancedSearch from "@/components/advanced-search"
import { searchListings } from "@/lib/api-utils"
import type { Listing, SearchFilters as SearchFiltersType } from "@/data/types"

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
      const results = await searchListings(filters)
      setListings(results)
      setLoading(false)
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
              <div className="text-center py-12">
                <p className="text-neutral-600">Loading listings...</p>
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
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
