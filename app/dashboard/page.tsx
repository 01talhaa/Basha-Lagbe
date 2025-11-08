"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { getBookingsByUserId } from "@/lib/api-utils"
import type { Booking } from "@/data/types"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      // Redirect property owners to their listings page
      if (session?.user?.role === "owner") {
        router.push("/host/listings")
        return
      }

      // Simulate fetching bookings
      const fetchBookings = async () => {
        const userBookings = await getBookingsByUserId("user-1")
        setBookings(userBookings)
        setLoading(false)
      }

      fetchBookings()
    }
  }, [router, status, session])

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Renter Dashboard</h1>
            <p className="text-neutral-600">Welcome back, {session.user.name || session.user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-neutral-600 text-sm font-semibold mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-neutral-600 text-sm font-semibold mb-2">Upcoming</h3>
            <p className="text-3xl font-bold">{bookings.filter((b) => b.status === "confirmed").length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-neutral-600 text-sm font-semibold mb-2">Completed</h3>
            <p className="text-3xl font-bold">{bookings.filter((b) => b.status === "completed").length}</p>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

          {loading ? (
            <p className="text-neutral-600">Loading bookings...</p>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">Booking #{booking.id}</h3>
                      <div className="text-sm text-neutral-600">
                        {new Date(booking.moveInDate).toLocaleDateString()} -{" "}
                        {new Date(booking.leaseEndDate).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">${booking.totalPrice} total</span>
                    <Link href={`/booking/${booking.id}/confirm`} className="text-primary hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-600">No bookings yet. Start exploring apartments!</p>
          )}
        </div>
      </div>
    </div>
  )
}
