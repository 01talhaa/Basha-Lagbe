"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getBookingsByHostId } from "@/lib/api-utils"
import type { Booking } from "@/data/types"

export default function HostDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "host") {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)

    // Simulate fetching host bookings
    const fetchBookings = async () => {
      const hostBookings = await getBookingsByHostId("host-1")
      setBookings(hostBookings)
      setLoading(false)
    }

    fetchBookings()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Host Dashboard</h1>
            <p className="text-neutral-600">Manage your listings and bookings</p>
          </div>
          <div className="flex gap-4">
            <Link href="/host/new-listing" className="btn-primary">
              + New Listing
            </Link>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-neutral-600 text-sm font-semibold mb-2">Active Listings</h3>
            <p className="text-3xl font-bold">3</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-neutral-600 text-sm font-semibold mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-neutral-600 text-sm font-semibold mb-2">Pending Requests</h3>
            <p className="text-3xl font-bold">{bookings.filter((b) => b.status === "pending").length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-neutral-600 text-sm font-semibold mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold">
              ${bookings.reduce((sum, b) => sum + (b.status === "completed" ? b.totalPrice : 0), 0)}
            </p>
          </div>
        </div>

        {/* Booking Requests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Booking Requests</h2>

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
                      <p className="text-sm text-neutral-600">
                        {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </p>
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
                    {booking.status === "pending" && (
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors">
                          Accept
                        </button>
                        <button className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-600">No booking requests yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
