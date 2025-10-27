import { getListingById, getReviewsByListingId } from "@/lib/api-utils"
import { notFound } from "next/navigation"
import BookingForm from "@/components/booking-form"
import ReviewSection from "@/components/review-section"
import LocationMap from "@/components/location-map"

interface ListingPageProps {
  params: {
    id: string
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listing = await getListingById(params.id)
  const reviews = await getReviewsByListingId(params.id)

  if (!listing) {
    notFound()
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

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <LocationMap listing={listing} />
            </div>

            {/* Reviews */}
            <ReviewSection reviews={reviews} />
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <BookingForm listing={listing} />
          </div>
        </div>
      </div>
    </div>
  )
}
