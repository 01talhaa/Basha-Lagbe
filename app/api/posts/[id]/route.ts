import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"
import Comment from "@/models/Comment"
import Reply from "@/models/Reply"
import { auth } from "@/lib/auth"

/**
 * DELETE /api/posts/[id] - Delete a post (author only)
 */

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    const post = await Post.findById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if user is the author
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      )
    }

    // Delete all replies to comments on this post
    const comments = await Comment.find({ post: params.id })
    const commentIds = comments.map((c) => c._id)
    await Reply.deleteMany({ comment: { $in: commentIds } })

    // Delete all comments on this post
    await Comment.deleteMany({ post: params.id })

    // Delete the post
    await Post.findByIdAndDelete(params.id)

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
