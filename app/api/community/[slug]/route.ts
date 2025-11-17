import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Community from "@/models/Community"
import Post from "@/models/Post"
import { requireAuth } from "@/lib/session"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Community id is required" }, { status: 400 })
    }

    await dbConnect()

    // return community populated with members and posts (with author)
    const community = await Community.findById(id)
      .populate("members", "name image")
      .populate({ path: "posts", populate: { path: "author", select: "name image" } })
      .lean()

    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    return NextResponse.json(community, { status: 200 })
  } catch (error) {
    console.error("GET /api/community/[id] error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Community id is required" }, { status: 400 })
    }

    await dbConnect()
    // Use $addToSet to avoid duplicates and atomically add the member
    const updated = await Community.findByIdAndUpdate(
      id,
      { $addToSet: { members: user.id } },
      { new: true }
    )
      .populate("members", "name image")
      .lean()

    if (!updated) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    return NextResponse.json(updated, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("POST /api/community/[id] (join) error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Community id is required" }, { status: 400 })
    }

    await dbConnect()

    // Remove the user from members
    const updated = await Community.findByIdAndUpdate(
      id,
      { $pull: { members: user.id } },
      { new: true }
    )
      .populate("members", "name image")
      .lean()

    if (!updated) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Left community", community: updated }, { status: 200 })
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("DELETE /api/community/[id] (leave) error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
