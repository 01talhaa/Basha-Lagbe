import mongoose, { Schema, Document, Model } from "mongoose"
import "./User"

export interface IConversation extends Document {
  listing: mongoose.Types.ObjectId
  renter: mongoose.Types.ObjectId
  owner: mongoose.Types.ObjectId
  lastMessage?: string
  lastMessageAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

const ConversationSchema = new Schema<IConversation>(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

// Index for faster queries
ConversationSchema.index({ renter: 1, owner: 1, listing: 1 })
ConversationSchema.index({ lastMessageAt: -1 })

if (mongoose.models.Conversation) {
  delete mongoose.models.Conversation
}

const Conversation: Model<IConversation> = mongoose.model<IConversation>("Conversation", ConversationSchema)

export default Conversation
