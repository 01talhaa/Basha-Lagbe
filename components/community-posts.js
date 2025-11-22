"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Image as ImageIcon,
  Trash2,
  Send,
  X,
  Loader2,
} from "lucide-react"

export default function CommunityPosts({ communityId }) {
  const { data: session } = useSession()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostImages, setNewPostImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [expandedComments, setExpandedComments] = useState({})
  const [comments, setComments] = useState({})
  const [newComment, setNewComment] = useState({})
  const [commentImages, setCommentImages] = useState({})
  const [commentImagePreviews, setCommentImagePreviews] = useState({})
  const [replies, setReplies] = useState({})
  const [newReply, setNewReply] = useState({})
  const [replyImages, setReplyImages] = useState({})
  const [replyImagePreviews, setReplyImagePreviews] = useState({})
  const [showReplyForm, setShowReplyForm] = useState({})
  const [expandedReplies, setExpandedReplies] = useState({})

  useEffect(() => {
    fetchPosts()
  }, [communityId])

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}/posts`)
      const data = await response.json()

      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 5 images
    if (files.length + previewImages.length > 5) {
      toast.error("Maximum 5 images allowed")
      return
    }

    const newPreviews = []
    const newImageData = []

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum 5MB per image.`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        newImageData.push(reader.result)
        newPreviews.push(reader.result)
        if (newImageData.length === files.length) {
          setNewPostImages([...newPostImages, ...newImageData])
          setPreviewImages([...previewImages, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setNewPostImages(newPostImages.filter((_, i) => i !== index))
    setPreviewImages(previewImages.filter((_, i) => i !== index))
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error("Please enter post content")
      return
    }

    setPosting(true)
    try {
      const response = await fetch(`/api/communities/${communityId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newPostContent,
          images: newPostImages,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Post created successfully!")
        setNewPostContent("")
        setNewPostImages([])
        setPreviewImages([])
        // Add new post to the top of the list (optimistic update)
        setPosts([data.post, ...posts])
      } else {
        toast.error(data.error || "Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Failed to create post")
    } finally {
      setPosting(false)
    }
  }

  const handleLikePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        // Update post in the list
        setPosts(posts.map((p) => (p._id === postId ? data.post : p)))
      }
    } catch (error) {
      console.error("Error liking post:", error)
      toast.error("Failed to like post")
    }
  }

  const handleDislikePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/dislike`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setPosts(posts.map((p) => (p._id === postId ? data.post : p)))
      }
    } catch (error) {
      console.error("Error disliking post:", error)
      toast.error("Failed to dislike post")
    }
  }

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Post deleted successfully")
        setPosts(posts.filter((p) => p._id !== postId))
      } else {
        toast.error(data.error || "Failed to delete post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Failed to delete post")
    }
  }

  const fetchComments = async (postId) => {
    if (comments[postId]) {
      // Toggle comments visibility
      setExpandedComments({ ...expandedComments, [postId]: !expandedComments[postId] })
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      const data = await response.json()

      if (data.success) {
        setComments({ ...comments, [postId]: data.comments })
        setExpandedComments({ ...expandedComments, [postId]: true })
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast.error("Failed to fetch comments")
    }
  }

  const handleCommentImageSelect = (e, postId) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const currentImages = commentImagePreviews[postId] || []
    if (files.length + currentImages.length > 5) {
      toast.error("Maximum 5 images allowed")
      return
    }

    const newPreviews = []
    const newImageData = []

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum 5MB per image.`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        newImageData.push(reader.result)
        newPreviews.push(reader.result)
        if (newImageData.length === files.length) {
          setCommentImages({
            ...commentImages,
            [postId]: [...(commentImages[postId] || []), ...newImageData],
          })
          setCommentImagePreviews({
            ...commentImagePreviews,
            [postId]: [...currentImages, ...newPreviews],
          })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeCommentImage = (postId, index) => {
    setCommentImages({
      ...commentImages,
      [postId]: (commentImages[postId] || []).filter((_, i) => i !== index),
    })
    setCommentImagePreviews({
      ...commentImagePreviews,
      [postId]: (commentImagePreviews[postId] || []).filter((_, i) => i !== index),
    })
  }

  const handleAddComment = async (postId) => {
    const content = newComment[postId]
    if (!content?.trim()) {
      toast.error("Please enter comment content")
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, images: commentImages[postId] || [] }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Comment added!")
        setNewComment({ ...newComment, [postId]: "" })
        setCommentImages({ ...commentImages, [postId]: [] })
        setCommentImagePreviews({ ...commentImagePreviews, [postId]: [] })
        // Add comment to list (optimistic update)
        const currentComments = comments[postId] || []
        setComments({ ...comments, [postId]: [data.comment, ...currentComments] })
        // Update post comment count
        setPosts(
          posts.map((p) =>
            p._id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
          )
        )
      } else {
        toast.error(data.error || "Failed to add comment")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    }
  }

  const handleLikeComment = async (commentId, postId) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        // Update comment in list
        setComments({
          ...comments,
          [postId]: comments[postId].map((c) => (c._id === commentId ? data.comment : c)),
        })
      }
    } catch (error) {
      console.error("Error liking comment:", error)
    }
  }

  const handleDislikeComment = async (commentId, postId) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/dislike`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setComments({
          ...comments,
          [postId]: comments[postId].map((c) => (c._id === commentId ? data.comment : c)),
        })
      }
    } catch (error) {
      console.error("Error disliking comment:", error)
    }
  }

  const handleDeleteComment = async (commentId, postId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Comment deleted")
        // Remove comment from list
        setComments({
          ...comments,
          [postId]: comments[postId].filter((c) => c._id !== commentId),
        })
        // Update post comment count
        setPosts(
          posts.map((p) =>
            p._id === postId ? { ...p, commentCount: Math.max(0, (p.commentCount || 1) - 1) } : p
          )
        )
      } else {
        toast.error(data.error || "Failed to delete comment")
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error("Failed to delete comment")
    }
  }

  const fetchReplies = async (commentId) => {
    if (replies[commentId]) {
      setExpandedReplies({ ...expandedReplies, [commentId]: !expandedReplies[commentId] })
      return
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/replies`)
      const data = await response.json()

      if (data.success) {
        setReplies({ ...replies, [commentId]: data.replies })
        setExpandedReplies({ ...expandedReplies, [commentId]: true })
      }
    } catch (error) {
      console.error("Error fetching replies:", error)
      toast.error("Failed to fetch replies")
    }
  }

  const handleReplyImageSelect = (e, commentId) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const currentImages = replyImagePreviews[commentId] || []
    if (files.length + currentImages.length > 5) {
      toast.error("Maximum 5 images allowed")
      return
    }

    const newPreviews = []
    const newImageData = []

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum 5MB per image.`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        newImageData.push(reader.result)
        newPreviews.push(reader.result)
        if (newImageData.length === files.length) {
          setReplyImages({
            ...replyImages,
            [commentId]: [...(replyImages[commentId] || []), ...newImageData],
          })
          setReplyImagePreviews({
            ...replyImagePreviews,
            [commentId]: [...currentImages, ...newPreviews],
          })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeReplyImage = (commentId, index) => {
    setReplyImages({
      ...replyImages,
      [commentId]: (replyImages[commentId] || []).filter((_, i) => i !== index),
    })
    setReplyImagePreviews({
      ...replyImagePreviews,
      [commentId]: (replyImagePreviews[commentId] || []).filter((_, i) => i !== index),
    })
  }

  const handleAddReply = async (commentId, postId) => {
    const content = newReply[commentId]
    if (!content?.trim()) {
      toast.error("Please enter reply content")
      return
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, images: replyImages[commentId] || [] }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Reply added!")
        setNewReply({ ...newReply, [commentId]: "" })
        setReplyImages({ ...replyImages, [commentId]: [] })
        setReplyImagePreviews({ ...replyImagePreviews, [commentId]: [] })
        setShowReplyForm({ ...showReplyForm, [commentId]: false })
        // Add reply to list
        const currentReplies = replies[commentId] || []
        setReplies({ ...replies, [commentId]: [data.reply, ...currentReplies] })
        // Update comment reply count
        setComments({
          ...comments,
          [postId]: comments[postId].map((c) =>
            c._id === commentId ? { ...c, replyCount: (c.replyCount || 0) + 1 } : c
          ),
        })
      } else {
        toast.error(data.error || "Failed to add reply")
      }
    } catch (error) {
      console.error("Error adding reply:", error)
      toast.error("Failed to add reply")
    }
  }

  const handleLikeReply = async (replyId, commentId) => {
    try {
      const response = await fetch(`/api/replies/${replyId}/like`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setReplies({
          ...replies,
          [commentId]: replies[commentId].map((r) => (r._id === replyId ? data.reply : r)),
        })
      }
    } catch (error) {
      console.error("Error liking reply:", error)
    }
  }

  const handleDislikeReply = async (replyId, commentId) => {
    try {
      const response = await fetch(`/api/replies/${replyId}/dislike`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setReplies({
          ...replies,
          [commentId]: replies[commentId].map((r) => (r._id === replyId ? data.reply : r)),
        })
      }
    } catch (error) {
      console.error("Error disliking reply:", error)
    }
  }

  const handleDeleteReply = async (replyId, commentId, postId) => {
    if (!confirm("Are you sure you want to delete this reply?")) return

    try {
      const response = await fetch(`/api/replies/${replyId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Reply deleted")
        // Remove reply from list
        setReplies({
          ...replies,
          [commentId]: replies[commentId].filter((r) => r._id !== replyId),
        })
        // Update comment reply count
        setComments({
          ...comments,
          [postId]: comments[postId].map((c) =>
            c._id === commentId ? { ...c, replyCount: Math.max(0, (c.replyCount || 1) - 1) } : c
          ),
        })
      } else {
        toast.error(data.error || "Failed to delete reply")
      }
    } catch (error) {
      console.error("Error deleting reply:", error)
      toast.error("Failed to delete reply")
    }
  }

  const hasUserLiked = (item) => {
    return item.likes?.some((like) => like.userId === session?.user?.id) || false
  }

  const hasUserDisliked = (item) => {
    return item.dislikes?.some((dislike) => dislike.userId === session?.user?.id) || false
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create Post Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Create a Post</h3>
        <Textarea
          placeholder="What's on your mind?"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="mb-4"
          rows={4}
          maxLength={5000}
        />

        {/* Image Previews */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {previewImages.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} alt="Preview" className="w-full h-32 object-cover rounded" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-neutral-50">
              <ImageIcon className="h-4 w-4" />
              <span className="text-sm">Add Images</span>
            </div>
          </label>
          <Button onClick={handleCreatePost} disabled={posting || !newPostContent.trim()}>
            {posting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Post
          </Button>
        </div>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="p-8 text-center text-neutral-500">
            No posts yet. Be the first to post!
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post._id} className="p-6">
              {/* Post Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    {post.authorName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{post.authorName}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {post.author === session?.user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePost(post._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Post Content */}
              <p className="text-neutral-800 mb-4 whitespace-pre-wrap">{post.content}</p>

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {post.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="Post"
                      className="w-full h-48 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <button
                  onClick={() => handleLikePost(post._id)}
                  className={`flex items-center gap-2 ${
                    hasUserLiked(post) ? "text-primary" : "text-neutral-600"
                  } hover:text-primary`}
                >
                  <ThumbsUp className="h-4 w-4" fill={hasUserLiked(post) ? "currentColor" : "none"} />
                  <span className="text-sm">{post.likeCount || 0}</span>
                </button>
                <button
                  onClick={() => handleDislikePost(post._id)}
                  className={`flex items-center gap-2 ${
                    hasUserDisliked(post) ? "text-red-600" : "text-neutral-600"
                  } hover:text-red-600`}
                >
                  <ThumbsDown className="h-4 w-4" fill={hasUserDisliked(post) ? "currentColor" : "none"} />
                  <span className="text-sm">{post.dislikeCount || 0}</span>
                </button>
                <button
                  onClick={() => fetchComments(post._id)}
                  className="flex items-center gap-2 text-neutral-600 hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{post.commentCount || 0} Comments</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments[post._id] && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  {/* Add Comment Form */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment[post._id] || ""}
                      onChange={(e) => setNewComment({ ...newComment, [post._id]: e.target.value })}
                      className="w-full"
                      rows={2}
                    />
                    
                    {/* Comment Image Previews */}
                    {commentImagePreviews[post._id]?.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {commentImagePreviews[post._id].map((img, index) => (
                          <div key={index} className="relative">
                            <img src={img} alt="Preview" className="w-full h-20 object-cover rounded" />
                            <button
                              onClick={() => removeCommentImage(post._id, index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleCommentImageSelect(e, post._id)}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2 px-3 py-1 border rounded-lg hover:bg-neutral-50 text-sm">
                          <ImageIcon className="h-4 w-4" />
                          <span>Add Images</span>
                        </div>
                      </label>
                      <Button
                        onClick={() => handleAddComment(post._id)}
                        size="sm"
                        disabled={!newComment[post._id]?.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  {comments[post._id]?.map((comment) => (
                    <div key={comment._id} className="bg-neutral-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                          {comment.authorName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-semibold text-sm">{comment.authorName}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-neutral-500">
                                {new Date(comment.createdAt).toLocaleString()}
                              </p>
                              {comment.author === session?.user?.id && (
                                <button
                                  onClick={() => handleDeleteComment(comment._id, post._id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-neutral-700 mt-1 whitespace-pre-wrap">{comment.content}</p>

                          {/* Comment Images */}
                          {comment.images && comment.images.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {comment.images.map((img, index) => (
                                <img
                                  key={index}
                                  src={img}
                                  alt="Comment"
                                  className="w-full h-24 object-cover rounded"
                                />
                              ))}
                            </div>
                          )}

                          {/* Comment Actions */}
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => handleLikeComment(comment._id, post._id)}
                              className={`flex items-center gap-1 text-xs ${
                                hasUserLiked(comment) ? "text-primary" : "text-neutral-600"
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" fill={hasUserLiked(comment) ? "currentColor" : "none"} />
                              {comment.likeCount || 0}
                            </button>
                            <button
                              onClick={() => handleDislikeComment(comment._id, post._id)}
                              className={`flex items-center gap-1 text-xs ${
                                hasUserDisliked(comment) ? "text-red-600" : "text-neutral-600"
                              }`}
                            >
                              <ThumbsDown className="h-3 w-3" fill={hasUserDisliked(comment) ? "currentColor" : "none"} />
                              {comment.dislikeCount || 0}
                            </button>
                            <button
                              onClick={() => setShowReplyForm({ ...showReplyForm, [comment._id]: !showReplyForm[comment._id] })}
                              className="text-xs text-neutral-600 hover:text-primary"
                            >
                              Reply
                            </button>
                            {(comment.replyCount || 0) > 0 && (
                              <button
                                onClick={() => fetchReplies(comment._id)}
                                className="text-xs text-primary hover:underline"
                              >
                                {expandedReplies[comment._id] ? "Hide" : "View"} {comment.replyCount || 0} {(comment.replyCount || 0) === 1 ? "reply" : "replies"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reply Form */}
                      {showReplyForm[comment._id] && (
                        <div className="ml-11 space-y-2">
                          <Textarea
                            placeholder="Write a reply..."
                            value={newReply[comment._id] || ""}
                            onChange={(e) => setNewReply({ ...newReply, [comment._id]: e.target.value })}
                            className="w-full"
                            rows={2}
                          />
                          
                          {/* Reply Image Previews */}
                          {replyImagePreviews[comment._id]?.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {replyImagePreviews[comment._id].map((img, index) => (
                                <div key={index} className="relative">
                                  <img src={img} alt="Preview" className="w-full h-16 object-cover rounded" />
                                  <button
                                    onClick={() => removeReplyImage(comment._id, index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-between">
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleReplyImageSelect(e, comment._id)}
                                className="hidden"
                              />
                              <div className="flex items-center gap-2 px-3 py-1 border rounded-lg hover:bg-neutral-50 text-sm">
                                <ImageIcon className="h-4 w-4" />
                                <span>Add Images</span>
                              </div>
                            </label>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setShowReplyForm({ ...showReplyForm, [comment._id]: false })
                                  setNewReply({ ...newReply, [comment._id]: "" })
                                  setReplyImages({ ...replyImages, [comment._id]: [] })
                                  setReplyImagePreviews({ ...replyImagePreviews, [comment._id]: [] })
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleAddReply(comment._id, post._id)}
                                size="sm"
                                disabled={!newReply[comment._id]?.trim()}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies List */}
                      {expandedReplies[comment._id] && replies[comment._id] && (
                        <div className="ml-11 space-y-2">
                          {replies[comment._id].map((reply) => (
                            <div key={reply._id} className="bg-white p-3 rounded-lg border">
                              <div className="flex items-start gap-2">
                                <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-semibold">
                                  {reply.authorName?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <p className="font-semibold text-xs">{reply.authorName}</p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs text-neutral-500">
                                        {new Date(reply.createdAt).toLocaleString()}
                                      </p>
                                      {reply.author === session?.user?.id && (
                                        <button
                                          onClick={() => handleDeleteReply(reply._id, comment._id, post._id)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-neutral-700 text-sm mt-1 whitespace-pre-wrap">{reply.content}</p>

                                  {/* Reply Images */}
                                  {reply.images && reply.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                      {reply.images.map((img, index) => (
                                        <img
                                          key={index}
                                          src={img}
                                          alt="Reply"
                                          className="w-full h-20 object-cover rounded"
                                        />
                                      ))}
                                    </div>
                                  )}

                                  {/* Reply Actions */}
                                  <div className="flex items-center gap-3 mt-2">
                                    <button
                                      onClick={() => handleLikeReply(reply._id, comment._id)}
                                      className={`flex items-center gap-1 text-xs ${
                                        hasUserLiked(reply) ? "text-primary" : "text-neutral-600"
                                      }`}
                                    >
                                      <ThumbsUp className="h-3 w-3" fill={hasUserLiked(reply) ? "currentColor" : "none"} />
                                      {reply.likeCount || 0}
                                    </button>
                                    <button
                                      onClick={() => handleDislikeReply(reply._id, comment._id)}
                                      className={`flex items-center gap-1 text-xs ${
                                        hasUserDisliked(reply) ? "text-red-600" : "text-neutral-600"
                                      }`}
                                    >
                                      <ThumbsDown className="h-3 w-3" fill={hasUserDisliked(reply) ? "currentColor" : "none"} />
                                      {reply.dislikeCount || 0}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
