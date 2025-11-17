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

    await dbConnect()

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Post id is required" }, { status: 400 })
    }

    const post = await Post.findById(id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Allow only the author or an admin to update
    const isAuthor = post.author && post.author.toString() === user.id
    const isAdmin = (user.role as string) === "admin"
    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const updates: Partial<{ text: string; image: string[] }> = {}

    if (typeof body.text === "string") updates.text = body.text
    if (body.image !== undefined) {
      updates.image = Array.isArray(body.image) ? body.image : [body.image].filter(Boolean)
    }

    // Apply updates
    if (updates.text !== undefined) post.text = updates.text
    if (updates.image !== undefined) post.image = updates.image as any

    await post.save()

    const updated = await Post.findById(post._id)
      .populate("author", "name image")
      .populate("likes", "_id")

    return NextResponse.json(updated, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("PATCH /api/posts/[id] error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
