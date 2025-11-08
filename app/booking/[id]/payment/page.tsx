import { getListingById } from "@/lib/api-utils"
import { notFound } from "next/navigation"
import PaymentForm from "@/components/payment-form"

interface PaymentPageProps {
  params: {
    id: string
  }
  searchParams: {
    checkIn?: string
    checkOut?: string
    guests?: string
    total?: string
  }
}

export default async function PaymentPage({ params, searchParams }: PaymentPageProps) {
  const listing = await getListingById(params.id)

  if (!listing) {
    notFound()
  }

  const checkInDate = searchParams.checkIn || new Date().toISOString().split("T")[0]
  const checkOutDate = searchParams.checkOut || new Date(Date.now() + 86400000).toISOString().split("T")[0]
  const numberOfGuests = Number.parseInt(searchParams.guests || "1")
  const totalPrice = Number.parseInt(searchParams.total || "0")

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <PaymentForm
              listing={listing}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              numberOfGuests={numberOfGuests}
              totalPrice={totalPrice}
            />
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-lg font-bold mb-4">Booking Summary</h3>

              <div className="mb-4 pb-4 border-b border-neutral-200">
                <img
                  src={listing.images[0] || "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-sm">{listing.title}</h4>
                <p className="text-xs text-neutral-600">{listing.location.city}</p>
              </div>

              <div className="space-y-2 text-sm mb-4 pb-4 border-b border-neutral-200">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Check-in</span>
                  <span className="font-semibold">{new Date(checkInDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Check-out</span>
                  <span className="font-semibold">{new Date(checkOutDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Guests</span>
                  <span className="font-semibold">{numberOfGuests}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">৳{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
