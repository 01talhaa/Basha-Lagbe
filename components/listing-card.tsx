"use client"

import Link from "next/link"
import type { Listing } from "@/data/types"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [isBooked, setIsBooked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkBookingStatus = async () => {
      try {
        const res = await fetch(`/api/bookings/check?listingId=${listing.id}`)
        if (res.ok) {
          const data = await res.json()
          setIsBooked(data.isBooked)
        }
      } catch (error) {
        console.error("Error checking booking status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkBookingStatus()
  }, [listing.id])

  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="card overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative h-48 bg-neutral-200">
          <img
            src={listing.images[0] || "/placeholder.svg?height=192&width=400&query=apartment"}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          {isBooked && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 text-white font-semibold">Already Booked</Badge>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1">
            <span className="text-sm font-semibold">★ {listing.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{listing.title}</h3>
          <p className="text-sm text-neutral-600 mb-3">{listing.location.city}</p>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
            <span>{listing.bedrooms} bed</span>
            <span>{listing.bathrooms} bath</span>
            <span>{listing.maxGuests} guests</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-neutral-900">৳{listing.pricePerMonth}</span>
            <span className="text-neutral-600">/month</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
