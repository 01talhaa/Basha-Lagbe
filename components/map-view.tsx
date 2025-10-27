"use client"

import { useEffect, useRef } from "react"
import type { Listing } from "@/data/types"

interface MapViewProps {
  listings: Listing[]
  selectedListingId?: string
}

export default function MapView({ listings, selectedListingId }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Create a simple map visualization using HTML/CSS
    // In production, you would use Google Maps API
    const mapHTML = `
      <div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 relative overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="text-4xl mb-4">🗺️</div>
            <p class="text-neutral-600 font-semibold">Map View</p>
            <p class="text-sm text-neutral-500 mt-2">${listings.length} listings in this area</p>
          </div>
        </div>
        
        <!-- Markers -->
        ${listings
          .map(
            (listing, idx) => `
          <div class="absolute w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform"
               style="left: ${20 + idx * 15}%; top: ${30 + (idx % 2) * 20}%;"
               title="${listing.title}">
            ${idx + 1}
          </div>
        `,
          )
          .join("")}
      </div>
    `

    mapContainer.current.innerHTML = mapHTML
  }, [listings])

  return (
    <div ref={mapContainer} className="w-full h-96 rounded-lg shadow-md overflow-hidden bg-neutral-200">
      <div className="w-full h-full flex items-center justify-center text-neutral-500">Loading map...</div>
    </div>
  )
}
