import { getBookingById } from "@/lib/api-utils"
import { notFound } from "next/navigation"
import Link from "next/link"

interface BookingConfirmPageProps {
  params: {
    id: string
  }
}

export default async function BookingConfirmPage({ params }: BookingConfirmPageProps) {
  const booking = await getBookingById(params.id)

  if (!booking) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-neutral-600">Your reservation has been confirmed</p>
          </div>

          {/* Booking Details */}
          <div className="space-y-6 mb-8">
            <div className="border-b border-neutral-200 pb-6">
              <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-neutral-600 text-sm">Booking ID</p>
                  <p className="font-semibold">{booking.id}</p>
                </div>
                <div>
                  <p className="text-neutral-600 text-sm">Status</p>
                  <p className="font-semibold capitalize">{booking.status}</p>
                </div>
                <div>
                  <p className="text-neutral-600 text-sm">Check-in</p>
                  <p className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-neutral-600 text-sm">Check-out</p>
                  <p className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-b border-neutral-200 pb-6">
              <h2 className="text-lg font-semibold mb-4">Price Breakdown</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>
                    ৳{booking.priceBreakdown.nightlyRate} × {booking.priceBreakdown.nights} nights
                  </span>
                  <span>৳{booking.priceBreakdown.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>৳{booking.priceBreakdown.cleaningFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>৳{booking.priceBreakdown.serviceFee}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Total</span>
                  <span>৳{booking.priceBreakdown.total}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Payment</h2>
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-neutral-600 text-sm mb-2">Payment Status</p>
                <p className="font-semibold capitalize">{booking.paymentStatus}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/dashboard" className="btn-primary flex-1 text-center">
              Back to Dashboard
            </Link>
            <Link href="/search" className="btn-secondary flex-1 text-center">
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
