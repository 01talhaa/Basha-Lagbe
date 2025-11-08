/**
 * Migration script to update user roles from old values to new values
 * Run this with: npx tsx scripts/migrate-roles.ts
 * 
 * Old roles: "user", "host"
 * New roles: "renter", "owner"
 */

import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const MONGODB_URI = process.env.DATABASE_URL

if (!MONGODB_URI) {
  throw new Error("Please define DATABASE_URL in your .env.local file")
}

async function migrateRoles() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI!)

    const db = mongoose.connection.db
    const usersCollection = db!.collection("users")

    console.log("\nMigrating user roles...")

    // Update "user" to "renter"
    const userResult = await usersCollection.updateMany(
      { role: "user" },
      { $set: { role: "renter" } }
    )
    console.log(`✓ Updated ${userResult.modifiedCount} users with role "user" to "renter"`)

    // Update "host" to "owner"
    const hostResult = await usersCollection.updateMany(
      { role: "host" },
      { $set: { role: "owner" } }
    )
    console.log(`✓ Updated ${hostResult.modifiedCount} users with role "host" to "owner"`)

    // Show current role distribution
    console.log("\nCurrent role distribution:")
    const roles = await usersCollection.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray()

    roles.forEach(role => {
      console.log(`  ${role._id}: ${role.count}`)
    })

    console.log("\n✅ Migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log("\nDisconnected from MongoDB")
    process.exit(0)
  }
}

migrateRoles()
