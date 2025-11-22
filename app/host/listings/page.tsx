"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { toast } from "sonner"

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

export default function HostListingsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [duplicating, setDuplicating] = useState<string | null>(null)

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

      // Fetch host's listings from MongoDB
      const fetchListings = async () => {
        try {
          const response = await fetch(`/api/listings?hostId=${session.user.id}`)
          const data = await response.json()
          if (data.success) {
            setListings(data.listings)
          }
        } catch (error) {
          console.error("Failed to fetch listings:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchListings()
    }
  }, [router, status, session])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setListings((prev) => prev.filter((listing) => listing._id !== id))
        toast.success("Listing deleted successfully")
      } else {
        toast.error("Failed to delete listing")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete listing")
    } finally {
      setDeleting(null)
    }
  }

  const handleDuplicate = async (id: string) => {
    if (!confirm("Do you want to duplicate this listing? You'll be redirected to edit the details.")) return

    setDuplicating(id)
    try {
      const response = await fetch(`/api/listings/${id}`)
      const data = await response.json()

      if (data.success) {
        const listing = data.listing
        // Store the listing data in sessionStorage to populate the new listing form
        const duplicateData = {
          title: `${listing.title} (Copy)`,
          description: listing.description,
          address: listing.location.address || "",
          city: listing.location.city,
          state: listing.location.state,
          zipCode: listing.location.zipCode || "",
          latitude: listing.location.coordinates?.[1] || 23.8103,
          longitude: listing.location.coordinates?.[0] || 90.4125,
          propertyType: listing.propertyType,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          maxGuests: listing.maxGuests || 2,
          pricePerMonth: listing.pricePerMonth,
          securityDeposit: listing.securityDeposit || 0,
          maintenanceFee: listing.maintenanceFee || 0,
          amenities: listing.amenities || [],
          rules: listing.rules || [],
          images: listing.images || [],
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        }
        sessionStorage.setItem("duplicateListingData", JSON.stringify(duplicateData))
        router.push("/host/new-listing")
      } else {
        toast.error("Failed to fetch listing details")
      }
    } catch (error) {
      console.error("Duplicate error:", error)
      toast.error("Failed to duplicate listing")
    } finally {
      setDuplicating(null)
    }
  }

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
              <div key={listing._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-neutral-200">
                  <img
                    src={listing.images[0] || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    {listing.location.city}, {listing.location.state}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
                    <span>{listing.bedrooms} beds</span>
                    <span>{listing.bathrooms} baths</span>
                    <span className="capitalize">{listing.propertyType}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">৳{listing.pricePerMonth.toLocaleString()}/mo</span>
                    <span className="text-sm text-neutral-600">★ {listing.rating} ({listing.reviewCount})</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/listing/${listing._id}`}
                        className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-center text-sm hover:bg-primary-dark transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/host/listings/${listing._id}/edit`}
                        className="flex-1 px-3 py-2 bg-neutral-100 text-neutral-900 rounded-lg text-center text-sm hover:bg-neutral-200 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDuplicate(listing._id)}
                        disabled={duplicating === listing._id}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors disabled:opacity-50"
                        title="Duplicate this listing"
                      >
                        {duplicating === listing._id ? "Duplicating..." : "Duplicate"}
                      </button>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        disabled={deleting === listing._id}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {deleting === listing._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
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
