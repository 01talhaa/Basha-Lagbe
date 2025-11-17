import mongoose, { Schema, Document, Model } from "mongoose"
import "./User"
import "./Community"

export interface IPost extends Document {
  text?: string
  image?: string[]
  members?: mongoose.Types.ObjectId[]
  Post?: mongoose.Types.ObjectId[]
  author: mongoose.Types.ObjectId
  likes?: mongoose.Types.ObjectId[]
  community: mongoose.Types.ObjectId
  createdAt?: Date
}

const PostSchema = new Schema<IPost>(
  {
    text: {
      type: String,
    },
    image: {
      type: [String],
      default: [],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Post: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Delete the old model if it exists (for hot reload in development)
if (mongoose.models.Post) {
  delete mongoose.models.Post
}

// Create the model
const Post: Model<IPost> = mongoose.model<IPost>("Post", PostSchema)

export default Post