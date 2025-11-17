import mongoose, { Schema, Document, Model } from "mongoose"
import "./User"

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[]
  title?: string
  lastMessage?: mongoose.Types.ObjectId
  createdAt?: Date
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    title: {
      type: String,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
)

if (mongoose.models.Conversation) {
  delete mongoose.models.Conversation
}

const Conversation: Model<IConversation> = mongoose.model<IConversation>("Conversation", ConversationSchema)

export default Conversation
