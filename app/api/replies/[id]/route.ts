import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Reply from "@/models/Reply"
import Comment from "@/models/Comment"
import { auth } from "@/lib/auth"

/**
 * DELETE /api/replies/[id] - Delete a reply (author only)
 */

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if user is the author
    if (reply.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own replies" },
        { status: 403 }
      )
    }

    // Update comment reply count
    const comment = await Comment.findById(reply.comment)
    if (comment) {
      comment.replyCount = Math.max(0, (comment.replyCount || 1) - 1)
      await comment.save()
    }

    // Delete the reply
    await Reply.findByIdAndDelete(params.id)

    return NextResponse.json({
      success: true,
      message: "Reply deleted successfully",
    })
  } catch (error) {
    console.error("Delete reply error:", error)
    return NextResponse.json({ error: "Failed to delete reply" }, { status: 500 })
  }
}
