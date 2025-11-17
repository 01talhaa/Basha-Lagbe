import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import LeaseRequest from "@/models/LeaseRequest"
import { requireAuth } from "@/lib/session"

// GET single lease request
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    await dbConnect()

    const leaseRequest = await LeaseRequest.findById(id)
      .populate("listing", "title images city area pricePerMonth")
      .populate("renter", "name email image")
      .populate("owner", "name email image")
      .lean()

    if (!leaseRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Verify user is involved
    if (
      leaseRequest.renter._id.toString() !== user.id &&
      leaseRequest.owner._id.toString() !== user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(leaseRequest, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("GET /api/lease-requests/[id] error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// PATCH update lease request
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    await dbConnect()

    const body = await req.json()
    const { status, visitDate, agreementUrl, rejectionReason } = body

    const leaseRequest = await LeaseRequest.findById(id)

    if (!leaseRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Authorization checks
    const isOwner = leaseRequest.owner.toString() === user.id
    const isRenter = leaseRequest.renter.toString() === user.id

    if (!isOwner && !isRenter) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update based on status
    if (status) {
      // Only owner can approve/reject/schedule visit/send agreement
      if (["approved", "rejected", "visit_scheduled", "agreement_sent"].includes(status) && !isOwner) {
        return NextResponse.json({ error: "Only owner can perform this action" }, { status: 403 })
      }

      // Only renter can sign agreement or cancel
      if (["agreement_signed", "cancelled"].includes(status) && !isRenter) {
        return NextResponse.json({ error: "Only renter can perform this action" }, { status: 403 })
      }

      leaseRequest.status = status

      if (status === "agreement_signed") {
        leaseRequest.agreementSignedAt = new Date()
        
        // Automatically create a booking when agreement is signed
        try {
          const Booking = (await import("@/models/Booking")).default
          
          // Check if booking already exists
          const existingBooking = await Booking.findOne({ leaseRequest: leaseRequest._id })
          
          if (!existingBooking) {
            // Calculate lease dates (default to 1 year from visit date or now)
            const startDate = leaseRequest.visitDate 
              ? new Date(leaseRequest.visitDate) 
              : new Date()
            const endDate = new Date(startDate)
            endDate.setFullYear(endDate.getFullYear() + 1)
            
            // Get listing details for monthly rent
            const Listing = (await import("@/models/Listing")).default
            const listing = await Listing.findById(leaseRequest.listing)
            
            await Booking.create({
              leaseRequest: leaseRequest._id,
              listing: leaseRequest.listing,
              renter: leaseRequest.renter,
              owner: leaseRequest.owner,
              startDate,
              endDate,
              monthlyRent: listing?.pricePerMonth || 0,
              securityDeposit: listing?.pricePerMonth || 0, // Default to 1 month rent
              agreementUrl: leaseRequest.agreementUrl,
              status: "active",
              paymentStatus: "pending",
            })
          }
        } catch (bookingError) {
          console.error("Error creating booking:", bookingError)
          // Don't fail the lease request update if booking creation fails
        }
      }
    }

    if (visitDate) leaseRequest.visitDate = new Date(visitDate)
    if (agreementUrl) leaseRequest.agreementUrl = agreementUrl
    if (rejectionReason) leaseRequest.rejectionReason = rejectionReason

    await leaseRequest.save()

    const populated = await LeaseRequest.findById(leaseRequest._id)
      .populate("listing", "title images city area pricePerMonth")
      .populate("renter", "name email image")
      .populate("owner", "name email image")
      .lean()

    return NextResponse.json(populated, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("PATCH /api/lease-requests/[id] error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
