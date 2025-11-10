import mongoose, { Schema, Document, Model } from "mongoose"
import "./User"
import "./Post"
import "./Community"

export interface IComment extends Document {
  
  post: mongoose.Types.ObjectId[]
  user: mongoose.Types.ObjectId[]
  text: string
  likes: mongoose.Types.ObjectId[]
  createdAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    post: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Post"
    },
    user: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
  },
    text: {
        type: String, 
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
  },
  {
    timestamps: true,
  }
)


// Delete the old model if it exists (for hot reload in development)
if (mongoose.models.Comment) {
  delete mongoose.models.Comment
}

// Create the model
const Comment: Model<IComment> = mongoose.model<IComment>("Comment", CommentSchema)

export default Comment;