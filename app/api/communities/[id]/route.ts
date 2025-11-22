import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Community from "@/models/Community"
import { auth } from "@/lib/auth"

/**
 * GET /api/communities/[id] - Get a specific community
 * PUT /api/communities/[id] - Update a community (creator only)
 * DELETE /api/communities/[id] - Delete a community (creator only)
 */

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const community = await Community.findById(params.id)
      .populate("creator", "name email role")
      .lean()

    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      community,
    })
  } catch (error) {
    console.error("Get community error:", error)
    return NextResponse.json({ error: "Failed to fetch community" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    const community = await Community.findById(params.id)

    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    if (community.creator.toString() !== session.user.id) {
      return NextResponse.json({ error: "Only the creator can edit this community" }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, category, image, isPrivate, rules, tags } = body

    community.name = name || community.name
    community.description = description || community.description
    community.category = category || community.category
    community.image = image !== undefined ? image : community.image
    community.isPrivate = isPrivate !== undefined ? isPrivate : community.isPrivate
    community.rules = rules || community.rules
    community.tags = tags || community.tags

    await community.save()

    return NextResponse.json({
      success: true,
      community,
      message: "Community updated successfully",
    })
  } catch (error) {
    console.error("Update community error:", error)
    return NextResponse.json({ error: "Failed to update community" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    const community = await Community.findById(params.id)

    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    if (community.creator.toString() !== session.user.id) {
      return NextResponse.json({ error: "Only the creator can delete this community" }, { status: 403 })
    }

    await Community.findByIdAndDelete(params.id)

    return NextResponse.json({
      success: true,
      message: "Community deleted successfully",
    })
  } catch (error) {
    console.error("Delete community error:", error)
    return NextResponse.json({ error: "Failed to delete community" }, { status: 500 })
  }
}
