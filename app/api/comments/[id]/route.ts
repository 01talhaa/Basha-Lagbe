import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Comment from "@/models/Comment"
import Post from "@/models/Post"
import { requireAuth } from "@/lib/session"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const { id } = params

    if (!id) return NextResponse.json({ error: "Comment id is required" }, { status: 400 })

    await dbConnect()

    const comment = await Comment.findById(id)
    if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 })

    if (String(comment.author) !== String(user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await Comment.findByIdAndDelete(id)

    // Pull from post.comments
    try {
      await Post.findByIdAndUpdate(comment.post, { $pull: { comments: id } })
    } catch (err) {
      console.warn("Could not remove comment id from post.comments", err)
    }

    return NextResponse.json({ message: "Comment deleted" }, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("DELETE /api/comments/[id] error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
