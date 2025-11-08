import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import mongoose from "mongoose"

/**
 * Migration endpoint to update user roles
 * GET /api/migrate/roles
 * 
 * Migrates old role values to new ones:
 * - "user" -> "renter"
 * - "host" -> "owner"
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const db = mongoose.connection.db
    if (!db) {
      throw new Error("Database connection not established")
    }

    const usersCollection = db.collection("users")

    // Update "user" to "renter"
    const userResult = await usersCollection.updateMany(
      { role: "user" },
      { $set: { role: "renter" } }
    )

    // Update "host" to "owner"
    const hostResult = await usersCollection.updateMany(
      { role: "host" },
      { $set: { role: "owner" } }
    )

    // Get current role distribution
    const roles = await usersCollection
      .aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .toArray()

    return NextResponse.json({
      success: true,
      message: "Migration completed",
      results: {
        usersUpdated: userResult.modifiedCount,
        hostsUpdated: hostResult.modifiedCount,
        currentRoleDistribution: roles,
      },
    })
  } catch (error: any) {
    console.error("Migration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Migration failed",
      },
      { status: 500 }
    )
  }
}
