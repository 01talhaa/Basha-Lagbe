"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [moveInDate, setMoveInDate] = useState("")
  const [leaseDuration, setLeaseDuration] = useState("12")
  const [bedrooms, setBedrooms] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({
      location: location || "",
      moveInDate: moveInDate || "",
      leaseDuration: leaseDuration || "12",
      bedrooms: bedrooms || "",
    })
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Move-in Date</label>
          <input
            type="date"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Lease Duration</label>
          <select value={leaseDuration} onChange={(e) => setLeaseDuration(e.target.value)} className="input-field">
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
            <option value="36">36 months</option>
          </select>
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
