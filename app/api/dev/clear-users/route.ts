import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

/**
 * Development endpoint to clear all users
 * DELETE /api/dev/clear-users
 * 
 * WARNING: This will delete ALL users from the database!
 * Only use in development.
 */
export async function DELETE(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 }
    )
  }

  try {
    await dbConnect()

    const result = await User.deleteMany({})

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} users`,
      deletedCount: result.deletedCount,
    })
  } catch (error: any) {
    console.error("Clear users error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to clear users",
      },
      { status: 500 }
    )
  }
}
