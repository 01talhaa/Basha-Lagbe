import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Community from "@/models/Community"
import { auth } from "@/lib/auth"

/**
 * POST /api/communities/[id]/join - Join a community
 */

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if user is already a member
    const isMember = community.members.some(
      (member: any) => member.userId.toString() === session.user.id
    )

    if (isMember) {
      return NextResponse.json({ error: "You are already a member of this community" }, { status: 400 })
    }

    // Add user to members
    community.members.push({
      userId: session.user.id,
      name: session.user.name || session.user.email,
      joinedAt: new Date(),
    })

    await community.save()

    return NextResponse.json({
      success: true,
      message: "Successfully joined the community",
      community,
    })
  } catch (error) {
    console.error("Join community error:", error)
    return NextResponse.json({ error: "Failed to join community" }, { status: 500 })
  }
}
