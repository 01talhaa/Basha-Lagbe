import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Community from "@/models/Community"
import { auth } from "@/lib/auth"

/**
 * POST /api/communities/[id]/leave - Leave a community
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

    // Check if user is the creator
    if (community.creator.toString() === session.user.id) {
      return NextResponse.json(
        { error: "Community creator cannot leave. Delete the community instead." },
        { status: 400 }
      )
    }

    // Remove user from members
    community.members = community.members.filter(
      (member: any) => member.userId.toString() !== session.user.id
    )

    await community.save()

    return NextResponse.json({
      success: true,
      message: "Successfully left the community",
    })
  } catch (error) {
    console.error("Leave community error:", error)
    return NextResponse.json({ error: "Failed to leave community" }, { status: 500 })
  }
}
