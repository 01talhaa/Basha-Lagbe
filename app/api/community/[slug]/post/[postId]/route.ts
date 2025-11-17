import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"

export async function GET(
  req: Request,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    const { id: communityId, postId } = params

    if (!communityId || !postId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 })
    }

    await dbConnect()

    const post = await Post.findOne({ _id: postId, community: communityId })
      .populate("author", "name image")
      .populate("likes", "_id")
      .lean()

    if (!post) {
      return NextResponse.json({ error: "Post not found in community" }, { status: 404 })
    }

    return NextResponse.json(post, { status: 200 })
  } catch (error) {
    console.error("GET /api/community/[id]/post/[postId] error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
