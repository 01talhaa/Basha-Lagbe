"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { getListings } from "@/lib/api-utils"
import type { Listing } from "@/data/types"

export default function HostListingsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      // Redirect renters to their dashboard
      if (session?.user?.role === "renter") {
        router.push("/dashboard")
        return
      }

      // Simulate fetching host listings
      const fetchListings = async () => {
        const allListings = await getListings()
        // Filter to host's listings (in real app, would filter by hostId)
        setListings(allListings.slice(0, 2))
        setLoading(false)
      }

      fetchListings()
    }
  }, [router, status, session])

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Listings</h1>
            <p className="text-neutral-600">Manage your active properties</p>
          </div>
          <Link href="/host/new-listing" className="btn-primary">
            + New Listing
          </Link>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <p className="text-neutral-600">Loading listings...</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="card overflow-hidden">
                <div className="relative h-48 bg-neutral-200">
                  <img
                    src={listing.images[0] || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                  <p className="text-sm text-neutral-600 mb-4">{listing.location.city}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">৳{listing.pricePerMonth}/month</span>
                    <span className="text-sm">★ {listing.rating}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/listing/${listing.id}`}
                      className="flex-1 px-3 py-2 bg-primary text-white rounded text-center text-sm hover:bg-primary-dark transition-colors"
                    >
                      View
                    </Link>
                    <button className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm hover:bg-neutral-50 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-600 mb-4">No listings yet</p>
            <Link href="/host/new-listing" className="btn-primary inline-block">
              Create Your First Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
