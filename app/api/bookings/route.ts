import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Booking from "@/models/Booking"
import { requireAuth } from "@/lib/session"

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    await dbConnect()

    // Get bookings for the current user (as renter or owner)
    const bookings = await Booking.find({
      $or: [{ renter: user.id }, { owner: user.id }],
    })
      .populate({
        path: "listing",
        select: "title images city area pricePerMonth address",
      })
      .populate({
        path: "renter",
        select: "name email image",
      })
      .populate({
        path: "owner",
        select: "name email image",
      })
      .sort({ createdAt: -1 })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    await dbConnect()

    const body = await req.json()
    const { leaseRequestId, startDate, endDate, monthlyRent, securityDeposit, agreementUrl, notes } = body

    // Validate required fields
    if (!leaseRequestId || !startDate || !endDate || !monthlyRent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the lease request to extract listing, renter, and owner
    const LeaseRequest = (await import("@/models/LeaseRequest")).default
    const leaseRequest = await LeaseRequest.findById(leaseRequestId)

    if (!leaseRequest) {
      return NextResponse.json({ error: "Lease request not found" }, { status: 404 })
    }

    // Verify the user is either the renter or owner
    if (
      leaseRequest.renter.toString() !== user.id &&
      leaseRequest.owner.toString() !== user.id
    ) {
      return NextResponse.json({ error: "Unauthorized to create booking for this lease request" }, { status: 403 })
    }

    // Check if booking already exists for this lease request
    const existingBooking = await Booking.findOne({ leaseRequest: leaseRequestId })
    if (existingBooking) {
      return NextResponse.json({ error: "Booking already exists for this lease request" }, { status: 400 })
    }

    // Create the booking
    const booking = await Booking.create({
      leaseRequest: leaseRequestId,
      listing: leaseRequest.listing,
      renter: leaseRequest.renter,
      owner: leaseRequest.owner,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      monthlyRent,
      securityDeposit: securityDeposit || 0,
      agreementUrl: agreementUrl || leaseRequest.agreementUrl,
      notes,
      status: "active",
      paymentStatus: "pending",
    })

    // Populate the booking before returning
    const populatedBooking = await Booking.findById(booking._id)
      .populate("listing", "title images city area pricePerMonth")
      .populate("renter", "name email image")
      .populate("owner", "name email image")

    return NextResponse.json(populatedBooking, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
