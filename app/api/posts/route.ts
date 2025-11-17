import { NextResponse, NextRequest } from "next/server"
import dbConnect from "@/lib/mongodb"
import Post from "@/models/Post"
import Community from "@/models/Community"
import { requireAuth } from "@/lib/session"

export async function POST(req: Request) {
  try {
    // ensure logged-in user
    const user = await requireAuth()

    await dbConnect()

    const body = await req.json()
    const { text, image, community } = body

    if (!community) {
      return NextResponse.json({ error: "Community is required" }, { status: 400 })
    }

    // Verify community exists
    const comm = await Community.findById(community)
    if (!comm) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    // Ensure user is a member of the community
    const members = Array.isArray(comm.members) ? comm.members.map((m: any) => String(m)) : []
    if (!members.includes(String(user.id))) {
      return NextResponse.json({ error: "Join the community before posting" }, { status: 403 })
    }

    const newPost = await Post.create({
      text: text || "",
      image: Array.isArray(image) ? image : [],
      author: user.id,
      community,
      likes: [],
    })

    // add post id to community.posts array
    try {
      await Community.findByIdAndUpdate(community, { $push: { posts: newPost._id } })
    } catch (e) {
      // non-fatal: log and continue
      console.warn("Could not push post id to community.posts", e)
    }

    return NextResponse.json(newPost, { status: 201 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("POST /api/posts error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
