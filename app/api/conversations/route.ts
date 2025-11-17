import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Conversation from "@/models/Conversation"
import Message from "@/models/Message"
import { requireAuth } from "@/lib/session"

// GET all conversations for current user
export async function GET(req: Request) {
  try {
    const user = await requireAuth()
    await dbConnect()

    const conversations = await Conversation.find({
      $or: [{ renter: user.id }, { owner: user.id }],
    })
      .populate("listing", "title images city area")
      .populate("renter", "name email image")
      .populate("owner", "name email image")
      .sort({ lastMessageAt: -1 })
      .lean()

    return NextResponse.json(conversations, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("GET /api/conversations error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// POST create or get existing conversation
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    await dbConnect()

    const body = await req.json()
    const { listingId, ownerId } = body

    if (!listingId || !ownerId) {
      return NextResponse.json({ error: "listingId and ownerId are required" }, { status: 400 })
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      listing: listingId,
      renter: user.id,
      owner: ownerId,
    })
      .populate("listing", "title images city area")
      .populate("renter", "name email image")
      .populate("owner", "name email image")
      .lean()

    if (conversation) {
      return NextResponse.json(conversation, { status: 200 })
    }

    // Create new conversation
    const newConversation = await Conversation.create({
      listing: listingId,
      renter: user.id,
      owner: ownerId,
      lastMessage: "",
      lastMessageAt: new Date(),
    })

    const populated = await Conversation.findById(newConversation._id)
      .populate("listing", "title images city area")
      .populate("renter", "name email image")
      .populate("owner", "name email image")
      .lean()

    return NextResponse.json(populated, { status: 201 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("POST /api/conversations error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
