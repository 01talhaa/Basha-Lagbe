import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Comment from "@/models/Comment"
import Reply from "@/models/Reply"
import Post from "@/models/Post"
import { auth } from "@/lib/auth"

/**
 * DELETE /api/comments/[id] - Delete a comment (author only)
 */

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    const comment = await Comment.findById(params.id)

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user is the author
    if (comment.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      )
    }

    // Delete all replies to this comment
    await Reply.deleteMany({ comment: params.id })

    // Update post comment count
    const post = await Post.findById(comment.post)
    if (post) {
      post.commentCount = Math.max(0, (post.commentCount || 1) - 1)
      await post.save()
    }

    // Delete the comment
    await Comment.findByIdAndDelete(params.id)

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    })
  } catch (error) {
    console.error("Delete comment error:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
