import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import dbConnect from "@/lib/mongodb"
import Booking from "@/models/Booking"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    await dbConnect()

    const body = await req.json()
    const { status, cancellationReason } = body

    const booking = await Booking.findById(id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Only owner can cancel bookings
    if (booking.owner.toString() !== user.id) {
      return NextResponse.json({ error: "Only the owner can cancel bookings" }, { status: 403 })
    }

    // Update booking status
    booking.status = status
    if (cancellationReason) {
      booking.notes = cancellationReason
    }

    await booking.save()

    const populated = await Booking.findById(booking._id)
      .populate("listing", "title images city area pricePerMonth")
      .populate("renter", "name email image")
      .populate("owner", "name email image")

    return NextResponse.json(populated, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("PATCH /api/bookings/[id] error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
