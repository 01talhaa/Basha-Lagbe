"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [moveInDate, setMoveInDate] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [bedrooms, setBedrooms] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (location) params.append("location", location)
    if (moveInDate) params.append("moveInDate", moveInDate)
    if (propertyType) params.append("propertyType", propertyType)
    if (minPrice) params.append("minPrice", minPrice)
    if (maxPrice) params.append("maxPrice", maxPrice)
    if (bedrooms) params.append("bedrooms", bedrooms)
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Location</label>
          <input
            type="text"
            placeholder="City or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Move-in Date */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Move-in Date</label>
          <input
            type="date"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Property Type</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="input-field">
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
            <option value="room">Room</option>
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Min Price (Tk)</label>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input-field"
            min="0"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Max Price (Tk)</label>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input-field"
            min="0"
          />
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Bedrooms</label>
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="input-field">
            <option value="">Any</option>
            <option value="1">1 bedroom</option>
            <option value="2">2 bedrooms</option>
            <option value="3">3 bedrooms</option>
            <option value="4">4+ bedrooms</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full">
            Search
          </button>
        </div>
      </div>
    </form>
  )
}
