import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { auth } from "@/lib/auth"

/**
 * Update user role after Google OAuth signup
 * POST /api/auth/update-role
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { role } = body

    // Validate role
    if (!role || !["renter", "owner"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    await dbConnect()

    // Update user role
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { role },
      { new: true }
    )

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      role: user.role,
    })
  } catch (error: any) {
    console.error("Update role error:", error)
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    )
  }
}
