import mongoose, { Schema, Document, Model } from "mongoose"
import "./User"


export interface IChat extends Document {
  
  sender: mongoose.Types.ObjectId[]
  reciever: mongoose.Types.ObjectId[]
  message: string
  seen: boolean;  
  createdAt: Date
}

const ChatSchema = new Schema<IChat>(
  {
    sender: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
},
    reciever: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
  },
     message: {
        type: String, 
    },
    seen: {
        type: Boolean,
        default: false,
    },
  },
  {
    timestamps: true,
  }
)


// Delete the old model if it exists (for hot reload in development)
if (mongoose.models.Chat) {
  delete mongoose.models.Chat
}

// Create the model
const Chat: Model<IChat> = mongoose.model<IChat>("Chat", ChatSchema)

export default Chat;