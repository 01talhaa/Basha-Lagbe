import mongoose, { Schema, Document, Model } from "mongoose"
import "./User"
import "./Conversation"

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId
  sender: mongoose.Types.ObjectId
  text: string
  createdAt?: Date
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
    },
  },
  { timestamps: true }
)

if (mongoose.models.Message) {
  delete mongoose.models.Message
}

const Message: Model<IMessage> = mongoose.model<IMessage>("Message", MessageSchema)

export default Message
