import mongoose, { Schema, Document, Model } from "mongoose"
import "./User"
import "./Conversation"

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId
  sender: mongoose.Types.ObjectId
  text: string
  read: boolean
  createdAt?: Date
  updatedAt?: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// Index for faster queries
MessageSchema.index({ conversation: 1, createdAt: -1 })

if (mongoose.models.Message) {
  delete mongoose.models.Message
}

const Message: Model<IMessage> = mongoose.model<IMessage>("Message", MessageSchema)

export default Message
