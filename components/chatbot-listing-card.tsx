"use client"

import Link from "next/link"
import type { Listing } from "@/data/types"

interface ChatbotListingCardProps {
  listing: Listing
}

export default function ChatbotListingCard({ listing }: ChatbotListingCardProps) {
  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Image */}
        <div className="relative h-40 bg-neutral-200">
          <img
            src={listing.images[0] || "/placeholder.svg?height=160&width=300&query=apartment"}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
            <span className="text-xs font-semibold">★ {listing.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h4 className="font-semibold text-sm mb-1 line-clamp-1">{listing.title}</h4>
          <p className="text-xs text-neutral-600 mb-2">{listing.location.city}</p>

          {/* Details */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 mb-2">
            <span>{listing.bedrooms} bed</span>
            <span>•</span>
            <span>{listing.bathrooms} bath</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-primary">${listing.pricePerMonth}</span>
            <span className="text-xs text-neutral-600">/month</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
