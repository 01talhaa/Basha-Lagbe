"use client"

import type React from "react"

import { useState } from "react"
import MapView from "@/components/map-view"
import { getListings } from "@/lib/api-utils"

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  const [showMap, setShowMap] = useState(false)
  const [listings, setListings] = useState<any[]>([])

  const loadListings = async () => {
    const data = await getListings()
    setListings(data)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Map Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
        <button
          onClick={() => {
            setShowMap(!showMap)
            if (!showMap) loadListings()
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.553-.894L9 7m0 13l6.447 3.224A1 1 0 0021 19.382V8.618a1 1 0 00-1.553-.894L15 11m0 0V5m0 6v8m0-13l-6.447-3.224A1 1 0 003 4.618v10.764"
            />
          </svg>
          {showMap ? "Hide Map" : "Show Map"}
        </button>
      </div>

      {/* Map View */}
      {showMap && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <MapView listings={listings} />
        </div>
      )}

      {/* Main Content */}
      {children}
    </div>
  )
}
