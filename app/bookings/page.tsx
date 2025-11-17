"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, DollarSign, FileText, Home, User } from "lucide-react"

interface Booking {
  _id: string
  listing: {
    _id: string
    title: string
    images: string[]
    city: string
    area: string
    pricePerMonth: number
    address?: string
  }
  renter: {
    _id: string
    name: string
    email: string
    image?: string
  }
  owner: {
    _id: string
    name: string
    email: string
    image?: string
  }
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit: number
  status: string
  agreementUrl?: string
  paymentStatus: string
  notes?: string
  createdAt: string
}

export default function BookingsPage() {
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
      fetchBookings()
    }
  }, [status, router])

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings")
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      completed: { label: "Completed", className: "bg-gray-100 text-gray-800" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
      expired: { label: "Expired", className: "bg-yellow-100 text-yellow-800" },
    }

    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getPaymentBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      partial: { label: "Partial", className: "bg-orange-100 text-orange-800" },
      paid: { label: "Paid", className: "bg-green-100 text-green-800" },
      overdue: { label: "Overdue", className: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const isOwner = (booking: Booking) => booking.owner._id === session?.user?.id
  const isRenter = (booking: Booking) => booking.renter._id === session?.user?.id

  const renterBookings = bookings.filter(isRenter)
  const ownerBookings = bookings.filter(isOwner)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const months = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    return `${months} month${months !== 1 ? "s" : ""}`
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const isOwnerView = isOwner(booking)
    const otherParty = isOwnerView ? booking.renter : booking.owner

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          {/* Listing Image */}
          <div className="relative w-full md:w-64 h-48 md:h-auto">
            <Image
              src={booking.listing.images[0] || "/placeholder.jpg"}
              alt={booking.listing.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Booking Details */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{booking.listing.title}</h3>
                <div className="flex items-center gap-2 text-neutral-600 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {booking.listing.city}, {booking.listing.area}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {getStatusBadge(booking.status)}
                {getPaymentBadge(booking.paymentStatus)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-semibold">Lease Period</p>
                  <p className="text-neutral-600">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </p>
                  <p className="text-xs text-neutral-500">{calculateDuration(booking.startDate, booking.endDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-semibold">Monthly Rent</p>
                  <p className="text-neutral-600">৳{booking.monthlyRent.toLocaleString()}</p>
                  <p className="text-xs text-neutral-500">Deposit: ৳{booking.securityDeposit.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="font-semibold">{isOwnerView ? "Renter" : "Owner"}</p>
                  <p className="text-neutral-600">{otherParty.name}</p>
                  <p className="text-xs text-neutral-500">{otherParty.email}</p>
                </div>
              </div>

              {booking.agreementUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="font-semibold">Agreement</p>
                    <a
                      href={booking.agreementUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View Document
                    </a>
                  </div>
                </div>
              )}
            </div>

            {booking.notes && (
              <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">Notes:</span> {booking.notes}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Link href={`/listing/${booking.listing._id}`}>
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  View Listing
                </Button>
              </Link>
              {booking.agreementUrl && (
                <a href={booking.agreementUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Agreement
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-neutral-600 mt-2">View and manage your property leases</p>
        </div>

        <Tabs defaultValue={session?.user?.role === "owner" ? "owner" : "renter"} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="renter">
              My Leases ({renterBookings.length})
            </TabsTrigger>
            {session?.user?.role === "owner" && (
              <TabsTrigger value="owner">
                Property Leases ({ownerBookings.length})
              </TabsTrigger>
            )}
          </TabsList>

          {/* Renter's Bookings */}
          <TabsContent value="renter" className="space-y-6">
            {renterBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                  <p className="text-neutral-600 mb-4">
                    Start by sending lease requests to property owners
                  </p>
                  <Link href="/search">
                    <Button>Browse Listings</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Active Bookings */}
                {renterBookings.filter((b) => b.status === "active").length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Active Leases</h2>
                    <div className="space-y-4">
                      {renterBookings
                        .filter((b) => b.status === "active")
                        .map((booking) => (
                          <BookingCard key={booking._id} booking={booking} />
                        ))}
                    </div>
                  </div>
                )}

                {/* Past Bookings */}
                {renterBookings.filter((b) => b.status !== "active").length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Past Leases</h2>
                    <div className="space-y-4">
                      {renterBookings
                        .filter((b) => b.status !== "active")
                        .map((booking) => (
                          <BookingCard key={booking._id} booking={booking} />
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Owner's Bookings */}
          {session?.user?.role === "owner" && (
            <TabsContent value="owner" className="space-y-6">
              {ownerBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Home className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No property leases yet</h3>
                    <p className="text-neutral-600 mb-4">
                      Wait for renters to request leases on your properties
                    </p>
                    <Link href="/host/listings">
                      <Button>View My Listings</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Active Bookings */}
                  {ownerBookings.filter((b) => b.status === "active").length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Active Leases</h2>
                      <div className="space-y-4">
                        {ownerBookings
                          .filter((b) => b.status === "active")
                          .map((booking) => (
                            <BookingCard key={booking._id} booking={booking} />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Past Bookings */}
                  {ownerBookings.filter((b) => b.status !== "active").length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Past Leases</h2>
                      <div className="space-y-4">
                        {ownerBookings
                          .filter((b) => b.status !== "active")
                          .map((booking) => (
                            <BookingCard key={booking._id} booking={booking} />
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
