"use client"

import type React from "react"

import { useState } from "react"
import type { Listing } from "@/data/types"

interface PaymentFormProps {
  listing: Listing
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  totalPrice: number
}

export default function PaymentForm({
  listing,
  checkInDate,
  checkOutDate,
  numberOfGuests,
  totalPrice,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In production, integrate with Stripe or PayPal
      console.log("Payment processed:", {
        method: paymentMethod,
        amount: totalPrice,
        listing: listing.id,
      })

      setSuccess(true)
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">Payment Successful!</h3>
        <p className="text-green-700 text-sm">Your booking has been confirmed. Check your email for details.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

      {/* Order Summary */}
      <div className="mb-6 pb-6 border-b border-neutral-200">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Listing</span>
            <span className="font-semibold">{listing.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Check-in</span>
            <span>{new Date(checkInDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Check-out</span>
            <span>{new Date(checkOutDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Guests</span>
            <span>{numberOfGuests}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Total Amount</span>
            <span>৳{totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Payment Method</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold">Credit/Debit Card</p>
              <p className="text-sm text-neutral-600">Visa, Mastercard, American Express</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold">PayPal</p>
              <p className="text-sm text-neutral-600">Fast and secure payment</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={paymentMethod === "bank"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold">Bank Transfer</p>
              <p className="text-sm text-neutral-600">Direct bank payment</p>
            </div>
          </label>
        </div>
      </div>

      {/* Card Form */}
      {paymentMethod === "card" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Cardholder Name</label>
            <input
              type="text"
              name="cardName"
              value={cardData.cardName}
              onChange={handleCardChange}
              placeholder="John Doe"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleCardChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                value={cardData.expiryDate}
                onChange={handleCardChange}
                placeholder="MM/YY"
                maxLength="5"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">CVV</label>
              <input
                type="text"
                name="cvv"
                value={cardData.cvv}
                onChange={handleCardChange}
                placeholder="123"
                maxLength="4"
                className="input-field"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Processing..." : `Pay ৳${totalPrice}`}
          </button>
        </form>
      )}

      {/* PayPal Form */}
      {paymentMethod === "paypal" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-900 font-semibold mb-4">You will be redirected to PayPal</p>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Processing..." : "Continue to PayPal"}
            </button>
          </div>
        </form>
      )}

      {/* Bank Transfer Form */}
      {paymentMethod === "bank" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <p className="text-sm text-neutral-600 mb-4">
              Bank transfer details will be provided after you confirm your booking.
            </p>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      )}

      {/* Security Info */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </div>
  )
}
