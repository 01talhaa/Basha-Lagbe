import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import LeaseRequest from "@/models/LeaseRequest"
import { requireAuth } from "@/lib/session"

// GET all lease requests (filtered by user role)
export async function GET(req: Request) {
  try {
    const user = await requireAuth()
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role") // 'renter' or 'owner'

    let query: any = {}
    if (role === "renter") {
      query.renter = user.id
    } else if (role === "owner") {
      query.owner = user.id
    } else {
      // Return both renter and owner requests
      query = { $or: [{ renter: user.id }, { owner: user.id }] }
    }

    const requests = await LeaseRequest.find(query)
      .populate("listing", "title images city area pricePerMonth")
      .populate("renter", "name email image")
      .populate("owner", "name email image")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(requests, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("GET /api/lease-requests error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// POST create new lease request
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    await dbConnect()

    const body = await req.json()
    const { listingId, ownerId, message } = body

    if (!listingId || !ownerId || !message) {
      return NextResponse.json(
        { error: "listingId, ownerId, and message are required" },
        { status: 400 }
      )
    }

    // Check if request already exists
    const existingRequest = await LeaseRequest.findOne({
      listing: listingId,
      renter: user.id,
      status: { $nin: ["rejected", "cancelled", "completed"] },
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have an active request for this listing" },
        { status: 400 }
      )
    }

    const leaseRequest = await LeaseRequest.create({
      listing: listingId,
      renter: user.id,
      owner: ownerId,
      message,
      status: "pending",
    })

    const populated = await LeaseRequest.findById(leaseRequest._id)
      .populate("listing", "title images city area pricePerMonth")
      .populate("renter", "name email image")
      .populate("owner", "name email image")
      .lean()

    return NextResponse.json(populated, { status: 201 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("POST /api/lease-requests error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
