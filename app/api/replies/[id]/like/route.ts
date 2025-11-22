import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Reply from "@/models/Reply"
import { auth } from "@/lib/auth"

/**
 * POST /api/replies/[id]/like - Like or unlike a reply
 */

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    const reply = await Reply.findById(params.id)

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 })
    }

    const userId = session.user.id

    // Check if user already liked
    const likeIndex = reply.likes.findIndex(
      (like: any) => like.userId.toString() === userId
    )

    // Check if user disliked
    const dislikeIndex = reply.dislikes.findIndex(
      (dislike: any) => dislike.userId.toString() === userId
    )

    // Remove dislike if exists
    if (dislikeIndex !== -1) {
      reply.dislikes.splice(dislikeIndex, 1)
    }

    if (likeIndex !== -1) {
      // Unlike: remove like
      reply.likes.splice(likeIndex, 1)
    } else {
      // Like: add like
      reply.likes.push({ userId, timestamp: new Date() })
    }

    await reply.save()

    const updatedReply = await Reply.findById(params.id)
      .populate("author", "name email role")
      .lean()

    return NextResponse.json({
      success: true,
      reply: updatedReply,
      message: likeIndex !== -1 ? "Reply unliked" : "Reply liked",
    })
  } catch (error) {
    console.error("Like reply error:", error)
    return NextResponse.json({ error: "Failed to like reply" }, { status: 500 })
  }
}
