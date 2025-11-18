"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const AMENITIES_OPTIONS = [
  "WiFi",
  "Kitchen",
  "Washer",
  "Dryer",
  "Air Conditioning",
  "Heating",
  "TV",
  "Workspace",
  "Pool",
  "Gym",
  "Parking",
  "Elevator",
  "Balcony",
  "Garden",
  "Security System",
]

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "studio", label: "Studio" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
]

interface FormData {
  title: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
  propertyType: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  pricePerMonth: number
  securityDeposit: number
  maintenanceFee: number
  amenities: string[]
  rules: string[]
  startDate: string
  endDate: string
}

export default function NewListingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [currentRule, setCurrentRule] = useState("")
  const [isDuplicate, setIsDuplicate] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: 23.8103,
    longitude: 90.4125,
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    pricePerMonth: 0,
    securityDeposit: 0,
    maintenanceFee: 0,
    amenities: [],
    rules: [],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })

  const [mapUrl, setMapUrl] = useState("")

  // Check for duplicate listing data on component mount
  useEffect(() => {
    const duplicateData = sessionStorage.getItem("duplicateListingData")
    if (duplicateData) {
      try {
        const parsedData = JSON.parse(duplicateData)
        setFormData(parsedData)
        setIsDuplicate(true)
        
        // Set image previews if images exist
        if (parsedData.images && parsedData.images.length > 0) {
          setImagePreviews(parsedData.images)
        }
        
        // Clear the session storage
        sessionStorage.removeItem("duplicateListingData")
      } catch (error) {
        console.error("Error loading duplicate data:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user?.role !== "owner") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  // Update map URL when location fields change
  const handleLocationChange = () => {
    const { address, city, state, zipCode } = formData
    if (!address && !city) {
      setMapUrl("")
      return
    }

    const fullAddress = `${address || ''} ${city || ''} ${state || ''} ${zipCode || ''}`.trim()
    if (fullAddress) {
      setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`)
    }
  }

  // Geocode address to get exact coordinates
  useEffect(() => {
    const { address, city } = formData
    if (!address && !city) return

    const timer = setTimeout(async () => {
      const { state, zipCode } = formData
      const fullAddress = `${address || ''} ${city || ''} ${state || ''} ${zipCode || ''}`.trim()
      
      if (!fullAddress) return
      
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${GOOGLE_MAPS_API_KEY}`
        )
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location
          setFormData((prev) => ({ 
            ...prev, 
            latitude: lat, 
            longitude: lng 
          }))
        }
      } catch (err) {
        console.error("Geocoding error:", err)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [formData.address, formData.city, formData.state, formData.zipCode, GOOGLE_MAPS_API_KEY])

  // Update map URL when any location field changes
  useEffect(() => {
    handleLocationChange()
  }, [formData.address, formData.city, formData.state, formData.zipCode])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setImageFiles((prev) => [...prev, ...files])

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const addRule = () => {
    if (currentRule.trim()) {
      setFormData((prev) => ({
        ...prev,
        rules: [...prev.rules, currentRule.trim()],
      }))
      setCurrentRule("")
    }
  }

  const removeRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate images
      if (imagePreviews.length === 0) {
        throw new Error("Please add at least one image")
      }

      // Create listing payload
      const listingData = {
        title: formData.title,
        description: formData.description,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        maxGuests: formData.maxGuests,
        pricePerMonth: formData.pricePerMonth,
        securityDeposit: formData.securityDeposit,
        maintenanceFee: formData.maintenanceFee,
        images: imagePreviews, // Base64 images
        amenities: formData.amenities,
        rules: formData.rules,
        availability: {
          startDate: formData.startDate,
          endDate: formData.endDate,
        },
      }

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create listing")
      }

      // Redirect to listings page
      router.push("/host/listings")
    } catch (err: any) {
      setError(err.message || "Failed to create listing")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {isDuplicate ? "Duplicate Listing" : "Create New Listing"}
          </h1>
          <p className="text-neutral-600">
            {isDuplicate 
              ? "Edit the details below to create a new listing based on your previous one" 
              : "Fill in the details to list your property"}
          </p>
          {isDuplicate && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                ℹ️ This listing is duplicated from an existing one. Review and modify the details as needed.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Modern Downtown Apartment with City Views"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe your property in detail..."
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Dhaka"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Dhaka Division"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Zip Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="1000"
                />
              </div>

              {/* Map Preview */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Location Preview
                  <span className="text-xs font-normal text-neutral-500 ml-2">
                    (Map updates automatically as you type the address)
                  </span>
                </label>
                {mapUrl ? (
                  <div className="h-96 rounded-lg overflow-hidden border border-neutral-300">
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
                  <div className="h-96 rounded-lg border border-neutral-300 bg-neutral-100 flex items-center justify-center">
                    <div className="text-center text-neutral-500">
                      <svg className="w-16 h-16 mx-auto mb-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p>Enter address above to see location on map</p>
                    </div>
                  </div>
                )}
                {formData.latitude && formData.longitude && (
                  <p className="text-xs text-neutral-500 mt-2">
                    📍 Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Property Type *
                </label>
                <select
                  required
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Max Guests *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price per Month (৳) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.pricePerMonth}
                  onChange={(e) => setFormData({ ...formData, pricePerMonth: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Security Deposit (৳) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.securityDeposit}
                  onChange={(e) =>
                    setFormData({ ...formData, securityDeposit: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Maintenance Fee (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maintenanceFee}
                  onChange={(e) =>
                    setFormData({ ...formData, maintenanceFee: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Images *</h2>
            <div className="space-y-4">
              <div>
                <label className="block w-full px-6 py-8 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary cursor-pointer transition-colors">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-neutral-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <p className="text-sm text-neutral-600">Click to upload images</p>
                    <p className="text-xs text-neutral-400 mt-1">PNG, JPG up to 10MB each</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {AMENITIES_OPTIONS.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center space-x-2 cursor-pointer p-3 border border-neutral-200 rounded-lg hover:border-primary transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-neutral-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">House Rules</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentRule}
                  onChange={(e) => setCurrentRule(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRule())}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., No smoking"
                />
                <button
                  type="button"
                  onClick={addRule}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Add
                </button>
              </div>

              {formData.rules.length > 0 && (
                <div className="space-y-2">
                  {formData.rules.map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                    >
                      <span className="text-sm text-neutral-700">{rule}</span>
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Available From *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Available Until *
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Listing..." : "Create Listing"}
            </button>
          </div>
        </form>
        </div>
      </div>
  )
}