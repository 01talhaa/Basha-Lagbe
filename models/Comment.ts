import mongoose from "mongoose"
import { Schema, Document, Model } from "mongoose"
import "./User"
import "./Post"

export interface IComment extends Document {
  post: mongoose.Types.ObjectId
  author: mongoose.Types.ObjectId
  text: string
  createdAt?: Date
}

const CommentSchemaObj = new Schema<IComment>(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

if (mongoose.models.Comment) {
  delete mongoose.models.Comment
}

const Comment: Model<IComment> = mongoose.model<IComment>("Comment", CommentSchemaObj)

export default Comment