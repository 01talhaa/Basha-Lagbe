import mongoose, { Schema, Document, Model } from "mongoose"
import "./User"

export interface ICommunity extends Document {
  name: string
  description: string
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  createdAt: Date
}

const CommunitySchema = new Schema<ICommunity>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    description: {
      type: String, // Index for faster email lookups
    },
  },
  {
    timestamps: true,
  }
)


// Delete the old model if it exists (for hot reload in development)
if (mongoose.models.Community) {
  delete mongoose.models.Community
}

// Create the model
const Community: Model<ICommunity> = mongoose.model<ICommunity>("Community", CommunitySchema)

export default Community;