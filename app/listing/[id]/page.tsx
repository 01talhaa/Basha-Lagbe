"use client"

import { useState, useEffect } from "react"
import { useParams, notFound, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import BookingForm from "@/components/booking-form"
import ReviewSection from "@/components/review-section"
import ChatInterface from "@/components/chat-interface"
import LoginAlert from "@/components/login-alert"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface Listing {
  _id: string
  title: string
  description: string
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    latitude: number
    longitude: number
  }
  propertyType: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  pricePerMonth: number
  securityDeposit: number
  maintenanceFee: number
  images: string[]
  amenities: string[]
  rules: string[]
  rating: number
  reviewCount: number
  hostId: string
}

export default function ListingPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [mapUrl, setMapUrl] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [creatingConversation, setCreatingConversation] = useState(false)
  const [showLoginAlert, setShowLoginAlert] = useState(false)
  const [ownerName, setOwnerName] = useState<string>("Owner")

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`)
        const data = await response.json()

        if (!data.success) {
          setError("Listing not found")
          return
        }

        setListing(data.listing)
        
        // Generate map URL from location
        const location = data.listing.location
        const fullAddress = `${location.address} ${location.city} ${location.state} ${location.zipCode}`.trim()
        if (fullAddress) {
          setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`)
        }
      } catch (err) {
        console.error("Failed to fetch listing:", err)
        setError("Failed to load listing")
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [params.id])

  const handleContactOwner = async () => {
    if (!session?.user) {
      setShowLoginAlert(true)
      return
    }

    if (!listing) return

    setCreatingConversation(true)
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing._id,
          ownerId: listing.hostId,
        }),
      })

      if (res.ok) {
        const conversation = await res.json()
        setConversationId(conversation._id)
        setOwnerName(conversation.owner.name)
        setShowChat(true)
      } else {
        alert("Failed to create conversation. Please try again.")
      }
    } catch (error) {
      console.error("Error creating conversation:", error)
      alert("Failed to create conversation. Please try again.")
    } finally {
      setCreatingConversation(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Listing Not Found</h1>
          <p className="text-neutral-600 mb-4">The listing you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/search")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Browse Listings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="md:col-span-2 h-96 bg-neutral-200 rounded-lg overflow-hidden">
            <img
              src={listing.images[0] || "/placeholder.svg?height=400&width=800&query=apartment"}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
          {listing.images.slice(1, 3).map((image, idx) => (
            <div key={idx} className="h-48 bg-neutral-200 rounded-lg overflow-hidden">
              <img
                src={image || "/placeholder.svg"}
                alt={`${listing.title} ${idx + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Rating */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-semibold">★ {listing.rating}</span>
                  <span className="text-neutral-600">({listing.reviewCount} reviews)</span>
                </div>
                <span className="text-neutral-600">
                  {listing.location.city}, {listing.location.state}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About this place</h2>
              <p className="text-neutral-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-white rounded-lg">
              <div>
                <p className="text-neutral-600 text-sm">Bedrooms</p>
                <p className="text-2xl font-bold">{listing.bedrooms}</p>
              </div>
              <div>
                <p className="text-neutral-600 text-sm">Bathrooms</p>
                <p className="text-2xl font-bold">{listing.bathrooms}</p>
              </div>
              <div>
                <p className="text-neutral-600 text-sm">Max Guests</p>
                <p className="text-2xl font-bold">{listing.maxGuests}</p>
              </div>
              <div>
                <p className="text-neutral-600 text-sm">Property Type</p>
                <p className="text-2xl font-bold capitalize">{listing.propertyType}</p>
              </div>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 p-3 bg-white rounded-lg">
                      <span className="text-primary">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House Rules */}
            {listing.rules && listing.rules.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">House Rules</h2>
                <div className="bg-white rounded-lg p-6">
                  <ul className="space-y-3">
                    {listing.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-neutral-400 mt-1">•</span>
                        <span className="text-neutral-700">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-neutral-700">
                  <span className="font-semibold">Address:</span> {listing.location.address}
                </p>
                <p className="text-neutral-700">
                  <span className="font-semibold">City:</span> {listing.location.city}, {listing.location.state} {listing.location.zipCode}
                </p>
              </div>
              {mapUrl ? (
                <div className="w-full h-96 rounded-lg overflow-hidden border border-neutral-300">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="w-full h-96 rounded-lg border border-neutral-300 bg-neutral-100 flex items-center justify-center">
                  <p className="text-neutral-500">Map unavailable</p>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              <div className="bg-white rounded-lg p-6">
                <div className="text-center text-neutral-600">
                  <p className="text-4xl mb-2">★ {listing.rating}</p>
                  <p>{listing.reviewCount} reviews</p>
                  <p className="text-sm text-neutral-500 mt-4">Reviews coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <BookingForm 
              listing={{
                ...listing,
                id: listing._id,
                propertyType: listing.propertyType as "apartment" | "house" | "room" | "studio",
                availability: { 
                  startDate: new Date(), 
                  endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 
                  bookedDates: [] 
                },
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
              onContactOwner={handleContactOwner}
              isContactingOwner={creatingConversation}
              isOwner={session?.user?.id === listing.hostId}
            />
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {showChat && conversationId && session?.user && listing && (
        <ChatInterface
          conversationId={conversationId}
          currentUserId={session.user.id}
          recipientName={listing.hostId === session.user.id ? "Renter" : ownerName}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Login Alert Dialog */}
      <LoginAlert open={showLoginAlert} onOpenChange={setShowLoginAlert} />
    </div>
  )
}
