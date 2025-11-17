import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"
import { requireAuth } from "@/lib/session"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const { id } = params

    if (!id) return NextResponse.json({ error: "Post id is required" }, { status: 400 })

    await dbConnect()

    const post = await Post.findByIdAndUpdate(
      id,
      { $pull: { likes: user.id } },
      { new: true }
    )
      .populate("author", "name image")
      .populate("likes", "_id name image")

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 })

    return NextResponse.json(post, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("PATCH /api/posts/[id]/unlike error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
