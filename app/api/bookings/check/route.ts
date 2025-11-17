import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import dbConnect from "@/lib/mongodb"
import Booking from "@/models/Booking"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const listingId = searchParams.get("listingId")

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID required" }, { status: 400 })
    }

    await dbConnect()

    // Check if there's an active booking for this listing
    const activeBooking = await Booking.findOne({
      listing: listingId,
      status: "active",
    })
      .populate("renter", "name email")
      .populate("owner", "name email")

    return NextResponse.json({
      isBooked: !!activeBooking,
      booking: activeBooking,
    })
  } catch (error) {
    console.error("Error checking booking status:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
