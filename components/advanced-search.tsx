"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdvancedSearch() {
  const router = useRouter()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    bedrooms: "",
    bathrooms: "",
    priceMin: "",
    priceMax: "",
    amenities: [] as string[],
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    if (filters.location) params.append("location", filters.location)
    if (filters.bedrooms) params.append("bedrooms", filters.bedrooms)
    if (filters.bathrooms) params.append("bathrooms", filters.bathrooms)
    if (filters.priceMin) params.append("minPrice", filters.priceMin)
    if (filters.priceMax) params.append("maxPrice", filters.priceMax)
    if (filters.amenities.length > 0) {
      params.append("amenities", filters.amenities.join(","))
    }

    router.push(`/search?${params.toString()}`)
  }

  const amenitiesList = ["WiFi", "Kitchen", "Pool", "Gym", "Parking", "Washer", "Dryer", "AC"]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-primary font-semibold hover:underline mb-4"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        Advanced Search
      </button>

      {showAdvanced && (
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Bedrooms</label>
              <input
                type="number"
                min="0"
                value={filters.bedrooms}
                onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                placeholder="Any"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Bathrooms</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={filters.bathrooms}
                onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                placeholder="Any"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Min Price</label>
              <input
                type="number"
                min="0"
                value={filters.priceMin}
                onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                placeholder="Tk 0"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Max Price</label>
              <input
                type="number"
                min="0"
                value={filters.priceMax}
                onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                placeholder="Tk 100,000"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({
                          ...filters,
                          amenities: [...filters.amenities, amenity],
                        })
                      } else {
                        setFilters({
                          ...filters,
                          amenities: filters.amenities.filter((a) => a !== amenity),
                        })
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Apply Filters
          </button>
        </form>
      )}
    </div>
  )
}
