import mongoose, { Schema, Document, Model } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string
  email: string
  password?: string | null
  emailVerified?: Date | null
  image?: string | null
  role: "renter" | "owner" | "admin"
  phone?: string | null
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // Index for faster email lookups
    },
    password: {
      type: String,
      default: null,
      select: false, // Don't return password by default
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["renter", "owner", "admin"],
      default: "renter",
      index: true, // Index for role-based queries
    },
    phone: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

// Compound index for faster session queries
UserSchema.index({ email: 1, role: 1 })

// Delete the old model if it exists (for hot reload in development)
if (mongoose.models.User) {
  delete mongoose.models.User
}

// Create the model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema)

export default User
