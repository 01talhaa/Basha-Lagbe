"use client"

import type { Listing } from "@/data/types"

interface LocationMapProps {
  listing: Listing
}

export default function LocationMap({ listing }: LocationMapProps) {
  const { latitude, longitude, address, city, state, zipCode } = listing.location

  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${latitude},${longitude}!5e0!3m2!1sen!2sus!4v1234567890`

  return (
    <div className="space-y-4">
      {/* Address Information */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200">
        <h3 className="font-semibold text-lg mb-3">Address</h3>
        <p className="text-neutral-700">{address}</p>
        <p className="text-neutral-600">
          {city}, {state} {zipCode}
        </p>
      </div>

      {/* Google Maps Embed */}
      <div className="rounded-lg overflow-hidden shadow-md border border-neutral-200">
        <iframe
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address + " " + city + " " + state)}`}
          title="Property Location Map"
        />
      </div>

      {/* Coordinates */}
      <div className="bg-neutral-50 p-4 rounded-lg text-sm text-neutral-600">
        <p>
          <span className="font-semibold">Coordinates:</span> {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
      </div>
    </div>
  )
}
