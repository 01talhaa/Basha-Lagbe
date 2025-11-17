import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Message from "@/models/Message"
import Conversation from "@/models/Conversation"
import { requireAuth } from "@/lib/session"

// GET messages for a conversation
export async function GET(req: Request) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId query param required" }, { status: 400 })
    }

    await dbConnect()

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    if (
      conversation.renter.toString() !== user.id &&
      conversation.owner.toString() !== user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name image")
      .sort({ createdAt: 1 })
      .lean()

    return NextResponse.json(messages, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("GET /api/messages error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// POST send a message
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    await dbConnect()

    const body = await req.json()
    const { conversationId, text } = body

    if (!conversationId || !text?.trim()) {
      return NextResponse.json({ error: "conversationId and text are required" }, { status: 400 })
    }

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    if (
      conversation.renter.toString() !== user.id &&
      conversation.owner.toString() !== user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: user.id,
      text: text.trim(),
      read: false,
    })

    // Update conversation lastMessage
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text.trim(),
      lastMessageAt: new Date(),
    })

    const populated = await Message.findById(message._id).populate("sender", "name image").lean()

    return NextResponse.json(populated, { status: 201 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("POST /api/messages error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
