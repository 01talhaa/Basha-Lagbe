"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, FileText, Calendar, Home, TrendingUp, Users } from "lucide-react"

interface DashboardStats {
  messages: {
    total: number
    unread: number
  }
  leaseRequests: {
    sent: number
    received: number
    pending: number
  }
  bookings: {
    total: number
    upcoming: number
    completed: number
  }
  listings?: {
    total: number
    active: number
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    messages: { total: 0, unread: 0 },
    leaseRequests: { sent: 0, received: 0, pending: 0 },
    bookings: { total: 0, upcoming: 0, completed: 0 },
    listings: { total: 0, active: 0 },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      fetchDashboardStats()
    }
  }, [status, router])

  const fetchDashboardStats = async () => {
    try {
      // Fetch all stats in parallel
      const [messagesRes, leaseRequestsRes, listingsRes] = await Promise.all([
        fetch("/api/messages/unread-count"),
        fetch("/api/lease-requests"),
        session?.user?.role === "owner" ? fetch("/api/listings") : Promise.resolve(null),
      ])

      const messagesData = messagesRes.ok ? await messagesRes.json() : { count: 0 }
      const leaseRequestsData = leaseRequestsRes.ok ? await leaseRequestsRes.json() : []
      const listingsData = listingsRes ? await listingsRes.json() : []

      // Calculate lease request stats
      const sentRequests = leaseRequestsData.filter(
        (req: any) => req.renter._id === session?.user?.id
      )
      const receivedRequests = leaseRequestsData.filter(
        (req: any) => req.owner._id === session?.user?.id
      )
      const pendingRequests = leaseRequestsData.filter(
        (req: any) => req.status === "pending"
      )

      // Calculate completed bookings from lease requests
      const completedBookings = leaseRequestsData.filter(
        (req: any) => req.status === "agreement_signed" || req.status === "completed"
      )

      setStats({
        messages: {
          total: messagesData.count || 0,
          unread: messagesData.count || 0,
        },
        leaseRequests: {
          sent: sentRequests.length,
          received: receivedRequests.length,
          pending: pendingRequests.length,
        },
        bookings: {
          total: completedBookings.length,
          upcoming: completedBookings.filter((req: any) => req.status === "agreement_signed").length,
          completed: completedBookings.filter((req: any) => req.status === "completed").length,
        },
        listings: session?.user?.role === "owner" 
          ? {
              total: listingsData.length || 0,
              active: listingsData.filter((l: any) => l.available).length || 0,
            }
          : undefined,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
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

  const isOwner = session?.user?.role === "owner"

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {isOwner ? "Owner Dashboard" : "Renter Dashboard"}
          </h1>
          <p className="text-neutral-600 mt-2">
            Welcome back, {session?.user?.name || session?.user?.email}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Messages Card */}
          <Link href="/messages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.messages.total}</div>
                <p className="text-xs text-neutral-600 mt-1">
                  {stats.messages.unread > 0 && (
                    <span className="text-red-600 font-semibold">
                      {stats.messages.unread} unread
                    </span>
                  )}
                  {stats.messages.unread === 0 && "All caught up"}
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Lease Requests Card */}
          <Link href="/lease-requests">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lease Requests</CardTitle>
                <FileText className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isOwner ? stats.leaseRequests.received : stats.leaseRequests.sent}
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  {stats.leaseRequests.pending > 0 && (
                    <span className="text-yellow-600 font-semibold">
                      {stats.leaseRequests.pending} pending
                    </span>
                  )}
                  {stats.leaseRequests.pending === 0 && "No pending requests"}
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Bookings Card */}
          <Link href="/bookings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                <Calendar className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.bookings.total}</div>
                <p className="text-xs text-neutral-600 mt-1">
                  {stats.bookings.upcoming} upcoming, {stats.bookings.completed} completed
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Listings Card (Owner Only) */}
          {isOwner && stats.listings && (
            <Link href="/host/listings">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Listings</CardTitle>
                  <Home className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.listings.total}</div>
                  <p className="text-xs text-neutral-600 mt-1">
                    {stats.listings.active} active listings
                  </p>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/search"
                className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Browse Listings</p>
                  <p className="text-xs text-neutral-600">Find your next home</p>
                </div>
              </Link>

              {isOwner && (
                <Link
                  href="/host/new-listing"
                  className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Create Listing</p>
                    <p className="text-xs text-neutral-600">List a new property</p>
                  </div>
                </Link>
              )}

              <Link
                href="/messages"
                className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">View Messages</p>
                  <p className="text-xs text-neutral-600">Check your inbox</p>
                </div>
              </Link>

              <Link
                href="/lease-requests"
                className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold">Lease Requests</p>
                  <p className="text-xs text-neutral-600">
                    {isOwner ? "Manage requests" : "Track your requests"}
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
