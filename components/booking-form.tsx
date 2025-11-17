"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import type { Listing } from "@/data/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import LoginAlert from "@/components/login-alert"

interface BookingFormProps {
  listing: Listing
  onContactOwner?: () => void
  isContactingOwner?: boolean
  isOwner?: boolean
  isBooked?: boolean
  bookingInfo?: any
}

export default function BookingForm({ listing, onContactOwner, isContactingOwner = false, isOwner = false, isBooked = false, bookingInfo = null }: BookingFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [moveInDate, setMoveInDate] = useState("")
  const [showLeaseDialog, setShowLeaseDialog] = useState(false)
  const [leaseMessage, setLeaseMessage] = useState("")
  const [sendingLeaseRequest, setSendingLeaseRequest] = useState(false)
  const [showLoginAlert, setShowLoginAlert] = useState(false)

  const calculatePrice = () => {
    if (!moveInDate) return 0
    // Default to 1 month for pricing display
    const subtotal = listing.pricePerMonth
    const total = subtotal + listing.securityDeposit + listing.maintenanceFee
    return { subtotal, total }
  }

  const pricing = calculatePrice()

  const handleRequestLease = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user) {
      setShowLoginAlert(true)
      return
    }

    if (!moveInDate) {
      alert("Please select move-in date")
      return
    }

    setShowLeaseDialog(true)
  }

  const submitLeaseRequest = async () => {
    if (!leaseMessage.trim()) {
      alert("Please add a message to the owner")
      return
    }

    setSendingLeaseRequest(true)
    try {
      const res = await fetch("/api/lease-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          ownerId: listing.hostId,
          message: leaseMessage,
          moveInDate,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setShowLeaseDialog(false)
        setLeaseMessage("")
        alert("Lease request sent successfully! The owner will review your request.")
        router.push("/lease-requests")
      } else {
        alert(data.error || "Failed to send lease request")
      }
    } catch (error) {
      console.error("Error sending lease request:", error)
      alert("Failed to send lease request. Please try again.")
    } finally {
      setSendingLeaseRequest(false)
    }
  }

  return (
    <div className="card p-6 sticky top-20">
      {/* Contact Owner Button */}


      <div className="mb-6">
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-bold">৳{listing.pricePerMonth}</span>
          <span className="text-neutral-600">/month</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">★ {listing.rating}</span>
          <span className="text-neutral-600">({listing.reviewCount})</span>
        </div>
      </div>

      {isBooked && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Already Booked</span>
          </div>
          <p className="text-sm text-red-600">
            This property is currently leased until {bookingInfo?.endDate && new Date(bookingInfo.endDate).toLocaleDateString()}.
          </p>
        </div>
      )}

      {!isBooked && (
      <form onSubmit={handleRequestLease} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Move-in Date</label>
          <input
            type="date"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
            className="input-field"
            required
          />
        </div>
              {!isOwner && onContactOwner && (
        <Button
          onClick={onContactOwner}
          disabled={isContactingOwner}
          className="w-full mb-4 btn-primary"
          size="lg"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {isContactingOwner ? "Loading..." : "Contact Owner"}
        </Button>
      )}

        <button type="submit" className="btn-primary w-full">
          Request Lease
        </button>
      </form>
      )}

      {/* Login Alert */}
      <LoginAlert open={showLoginAlert} onOpenChange={setShowLoginAlert} />

      {/* Lease Request Dialog */}
      <Dialog open={showLeaseDialog} onOpenChange={setShowLeaseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Request Lease</DialogTitle>
            <DialogDescription>
              You're requesting to lease this property starting {moveInDate && new Date(moveInDate).toLocaleDateString()}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-neutral-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Move-in Date:</span>
                <span>{moveInDate && new Date(moveInDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Monthly Rent:</span>
                <span>৳{listing.pricePerMonth.toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message to Owner *</Label>
              <Textarea
                id="message"
                placeholder="Hi, I'm interested in leasing this property. I'm a..."
                value={leaseMessage}
                onChange={(e) => setLeaseMessage(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Introduce yourself and explain why you're a good fit for this property.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLeaseDialog(false)}
              disabled={sendingLeaseRequest}
            >
              Cancel
            </Button>
            <Button
              onClick={submitLeaseRequest}
              disabled={sendingLeaseRequest || !leaseMessage.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {sendingLeaseRequest ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {pricing !== 0 && (
        <div className="mt-6 pt-6 border-t border-neutral-200 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>
              Monthly Rent
            </span>
            <span>৳{pricing.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Security Deposit</span>
            <span>৳{listing.securityDeposit}</span>
          </div>
          <div className="flex justify-between">
            <span>Maintenance Fee</span>
            <span>৳{listing.maintenanceFee}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Total</span>
            <span>৳{pricing.total}</span>
          </div>
        </div>
      )}
    </div>
  )
}
