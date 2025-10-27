"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Listing } from "@/data/types"

interface BookingFormProps {
  listing: Listing
}

export default function BookingForm({ listing }: BookingFormProps) {
  const router = useRouter()
  const [moveInDate, setMoveInDate] = useState("")
  const [leaseLength, setLeaseLength] = useState("12")

  const calculatePrice = () => {
    if (!moveInDate || !leaseLength) return 0
    const months = Number.parseInt(leaseLength)
    const subtotal = months * listing.pricePerMonth
    const total = subtotal + listing.securityDeposit + listing.maintenanceFee
    return { months, subtotal, total }
  }

  const pricing = calculatePrice()

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault()
    if (!moveInDate || !leaseLength) return

    const params = new URLSearchParams({
      moveInDate,
      leaseLength,
      total: pricing.total.toString(),
    })

    router.push(`/booking/${listing.id}/payment?${params.toString()}`)
  }

  return (
    <div className="card p-6 sticky top-20">
      <div className="mb-6">
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-bold">${listing.pricePerMonth}</span>
          <span className="text-neutral-600">/month</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">★ {listing.rating}</span>
          <span className="text-neutral-600">({listing.reviewCount})</span>
        </div>
      </div>

      <form onSubmit={handleReserve} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Move-in Date</label>
          <input
            type="date"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Lease Length (months)</label>
          <select value={leaseLength} onChange={(e) => setLeaseLength(e.target.value)} className="input-field">
            {[3, 6, 12, 24, 36].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "month" : "months"}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary w-full">
          Request Lease
        </button>
      </form>

      {pricing.months > 0 && (
        <div className="mt-6 pt-6 border-t border-neutral-200 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>
              ${listing.pricePerMonth} × {pricing.months} months
            </span>
            <span>${pricing.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Security Deposit</span>
            <span>${listing.securityDeposit}</span>
          </div>
          <div className="flex justify-between">
            <span>Maintenance Fee</span>
            <span>${listing.maintenanceFee}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Total</span>
            <span>${pricing.total}</span>
          </div>
        </div>
      )}
    </div>
  )
}
