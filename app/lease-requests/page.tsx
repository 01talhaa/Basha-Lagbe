"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Calendar, CheckCircle, XCircle, Clock, Upload } from "lucide-react"

interface LeaseRequest {
  _id: string
  listing: {
    _id: string
    title: string
    images: string[]
    city: string
    area: string
    pricePerMonth: number
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
  status: string
  message: string
  visitDate?: string
  agreementUrl?: string
  agreementSignedAt?: string
  rejectionReason?: string
  createdAt: string
}

export default function LeaseRequestsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [requests, setRequests] = useState<LeaseRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<LeaseRequest | null>(null)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showAgreementDialog, setShowAgreementDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [visitDate, setVisitDate] = useState("")
  const [agreementUrl, setAgreementUrl] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      fetchRequests()
    }
  }, [status, router])

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/lease-requests")
      if (res.ok) {
        const data = await res.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (requestId: string, updates: any) => {
    setProcessing(true)
    try {
      const res = await fetch(`/api/lease-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (res.ok) {
        await fetchRequests()
        setShowScheduleDialog(false)
        setShowAgreementDialog(false)
        setShowRejectDialog(false)
        setSelectedRequest(null)
        alert("Request updated successfully!")
      } else {
        const data = await res.json()
        alert(data.error || "Failed to update request")
      }
    } catch (error) {
      console.error("Error updating request:", error)
      alert("Failed to update request")
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Approved", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
      visit_scheduled: { label: "Visit Scheduled", className: "bg-blue-100 text-blue-800" },
      agreement_sent: { label: "Agreement Sent", className: "bg-purple-100 text-purple-800" },
      agreement_signed: { label: "Agreement Signed", className: "bg-indigo-100 text-indigo-800" },
      completed: { label: "Completed", className: "bg-gray-100 text-gray-800" },
      cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800" },
    }

    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const isOwner = (request: LeaseRequest) => request.owner._id === session?.user?.id
  const isRenter = (request: LeaseRequest) => request.renter._id === session?.user?.id

  const renterRequests = requests.filter(isRenter)
  const ownerRequests = requests.filter(isOwner)

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

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Lease Requests</h1>
          <p className="text-neutral-600 mt-2">Manage your lease requests</p>
        </div>

        <Tabs defaultValue={session?.user?.role === "owner" ? "owner" : "renter"} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="renter">
              My Requests ({renterRequests.length})
            </TabsTrigger>
            {session?.user?.role === "owner" && (
              <TabsTrigger value="owner">
                Received ({ownerRequests.length})
              </TabsTrigger>
            )}
          </TabsList>

          {/* Renter's Sent Requests */}
          <TabsContent value="renter" className="space-y-4">
            {renterRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No requests yet</h3>
                  <p className="text-neutral-600">
                    Browse listings and send lease requests to property owners
                  </p>
                </CardContent>
              </Card>
            ) : (
              renterRequests.map((request) => (
                <Card key={request._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{request.listing.title}</CardTitle>
                        <p className="text-sm text-neutral-600 mt-1">
                          {request.listing.city}, {request.listing.area} • ${request.listing.pricePerMonth}/month
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-neutral-700">Your Message:</p>
                        <p className="text-sm text-neutral-600 mt-1">{request.message}</p>
                      </div>

                      {request.visitDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold">Visit Scheduled:</span>
                          <span>{new Date(request.visitDate).toLocaleString()}</span>
                        </div>
                      )}

                      {request.agreementUrl && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-purple-600" />
                            <span className="font-semibold">Agreement:</span>
                            <a 
                              href={request.agreementUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Document
                            </a>
                          </div>
                          {request.status === "agreement_sent" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateRequestStatus(request._id, { status: "agreement_signed" })}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Sign Agreement
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedRequest(request)
                                  setShowRejectDialog(true)
                                }}
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {request.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm font-semibold text-red-800">Rejection Reason:</p>
                          <p className="text-sm text-red-700 mt-1">{request.rejectionReason}</p>
                        </div>
                      )}

                      <div className="text-xs text-neutral-500">
                        Sent on {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Owner's Received Requests */}
          <TabsContent value="owner" className="space-y-4">
            {ownerRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No requests received</h3>
                  <p className="text-neutral-600">
                    Lease requests from potential renters will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              ownerRequests.map((request) => (
                <Card key={request._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{request.listing.title}</CardTitle>
                        <p className="text-sm text-neutral-600 mt-1">
                          From: {request.renter.name} ({request.renter.email})
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-neutral-700">Renter's Message:</p>
                        <p className="text-sm text-neutral-600 mt-1">{request.message}</p>
                      </div>

                      {request.visitDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold">Visit Scheduled:</span>
                          <span>{new Date(request.visitDate).toLocaleString()}</span>
                        </div>
                      )}

                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateRequestStatus(request._id, { status: "approved" })}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request)
                              setShowRejectDialog(true)
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {request.status === "approved" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowScheduleDialog(true)
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Visit
                        </Button>
                      )}

                      {request.status === "visit_scheduled" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowAgreementDialog(true)
                          }}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Send Agreement
                        </Button>
                      )}

                      <div className="text-xs text-neutral-500">
                        Received on {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Schedule Visit Dialog */}
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Property Visit</DialogTitle>
              <DialogDescription>
                Set a date and time for the renter to visit the property
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="visitDate">Visit Date & Time</Label>
                <Input
                  id="visitDate"
                  type="datetime-local"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedRequest &&
                  updateRequestStatus(selectedRequest._id, {
                    status: "visit_scheduled",
                    visitDate,
                  })
                }
                disabled={!visitDate || processing}
              >
                {processing ? "Scheduling..." : "Schedule Visit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Agreement Dialog */}
        <Dialog open={showAgreementDialog} onOpenChange={setShowAgreementDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Lease Agreement</DialogTitle>
              <DialogDescription>
                Provide the URL to the lease agreement document
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="agreementUrl">Agreement Document URL</Label>
                <Input
                  id="agreementUrl"
                  type="url"
                  placeholder="https://example.com/agreement.pdf"
                  value={agreementUrl}
                  onChange={(e) => setAgreementUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Upload your agreement to a file hosting service and paste the URL here
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAgreementDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedRequest &&
                  updateRequestStatus(selectedRequest._id, {
                    status: "agreement_sent",
                    agreementUrl,
                  })
                }
                disabled={!agreementUrl || processing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {processing ? "Sending..." : "Send Agreement"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Request Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why you're rejecting this request..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedRequest &&
                  updateRequestStatus(selectedRequest._id, {
                    status: "rejected",
                    rejectionReason,
                  })
                }
                disabled={!rejectionReason || processing}
                variant="destructive"
              >
                {processing ? "Rejecting..." : "Reject Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
