"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Users,
  Calendar,
  Settings,
  UserPlus,
  UserMinus,
  Edit,
  Trash2,
  ArrowLeft,
  Shield,
} from "lucide-react"
import CommunityPosts from "@/components/community-posts"

export default function CommunityDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const communityId = params.id

  const [community, setCommunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMembersDialog, setShowMembersDialog] = useState(false)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    category: "general",
    image: "",
    isPrivate: false,
  })

  const categories = [
    { value: "housing", label: "Housing" },
    { value: "neighborhood", label: "Neighborhood" },
    { value: "maintenance", label: "Maintenance" },
    { value: "social", label: "Social" },
    { value: "events", label: "Events" },
    { value: "general", label: "General" },
  ]

  useEffect(() => {
    if (communityId) {
      fetchCommunity()
    }
  }, [communityId])

  const fetchCommunity = async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}`)
      const data = await response.json()

      if (data.success) {
        setCommunity(data.community)
        setEditFormData({
          name: data.community.name,
          description: data.community.description,
          category: data.community.category,
          image: data.community.image || "",
          isPrivate: data.community.isPrivate || false,
        })
      }
    } catch (error) {
      console.error("Error fetching community:", error)
    } finally {
      setLoading(false)
    }
  }

  const isMember = () => {
    if (!session?.user?.id || !community?.members) return false
    return community.members.some((member) => member.userId === session.user.id)
  }

  const isCreator = () => {
    if (!session?.user?.id || !community?.creator) return false
    return community.creator._id === session.user.id
  }

  const handleJoin = async () => {
    if (status !== "authenticated") {
      toast.error("Please login to join this community")
      router.push("/login")
      return
    }

    setJoining(true)
    try {
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        fetchCommunity()
        toast.success("Successfully joined the community!")
      } else {
        toast.error(data.error || "Failed to join community")
      }
    } catch (error) {
      console.error("Error joining community:", error)
      toast.error("Failed to join community")
    } finally {
      setJoining(false)
    }
  }

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this community?")) return

    setLeaving(true)
    try {
      const response = await fetch(`/api/communities/${communityId}/leave`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        fetchCommunity()
        toast.success("Successfully left the community")
      } else {
        toast.error(data.error || "Failed to leave community")
      }
    } catch (error) {
      console.error("Error leaving community:", error)
      toast.error("Failed to leave community")
    } finally {
      setLeaving(false)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setEditing(true)

    try {
      const response = await fetch(`/api/communities/${communityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      })

      const data = await response.json()

      if (data.success) {
        setShowEditDialog(false)
        fetchCommunity()
        toast.success("Community updated successfully!")
      } else {
        toast.error(data.error || "Failed to update community")
      }
    } catch (error) {
      console.error("Error updating community:", error)
      toast.error("Failed to update community")
    } finally {
      setEditing(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const response = await fetch(`/api/communities/${communityId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Community deleted successfully")
        router.push("/community")
      } else {
        toast.error(data.error || "Failed to delete community")
      }
    } catch (error) {
      console.error("Error deleting community:", error)
      toast.error("Failed to delete community")
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading community...</p>
        </div>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Community not found</h2>
          <Link href="/community" className="text-primary hover:underline">
            Back to communities
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Communities
        </Link>

        {/* Community Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="relative h-64 bg-linear-to-br from-primary to-orange-600">
            {community.image ? (
              <img
                src={community.image}
                alt={community.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="h-24 w-24 text-white opacity-50" />
              </div>
            )}
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-neutral-900">{community.name}</h1>
                  <Badge className="capitalize">{community.category}</Badge>
                  {community.isPrivate && (
                    <Badge variant="outline" className="text-neutral-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>
                <p className="text-neutral-600 mb-4">{community.description}</p>
                <div className="flex items-center gap-6 text-sm text-neutral-500">
                  <button
                    onClick={() => setShowMembersDialog(true)}
                    className="flex items-center gap-2 hover:text-primary cursor-pointer"
                  >
                    <Users className="h-4 w-4" />
                    <span>{community.memberCount} members</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-neutral-500">
                  Created by <span className="font-semibold">{community.creatorName}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {isCreator() ? (
                  <>
                    <Button
                      onClick={() => setShowEditDialog(true)}
                      variant="outline"
                      className="w-full"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Community
                    </Button>
                    <Button
                      onClick={() => setShowDeleteDialog(true)}
                      variant="outline"
                      className="w-full text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Community
                    </Button>
                  </>
                ) : isMember() ? (
                  <Button
                    onClick={handleLeave}
                    disabled={leaving}
                    variant="outline"
                    className="w-full"
                  >
                    <UserMinus className="h-4 w-4 mr-2" />
                    {leaving ? "Leaving..." : "Leave Community"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleJoin}
                    disabled={joining}
                    className="bg-primary hover:bg-primary-dark text-white w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {joining ? "Joining..." : "Join Community"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section - Only visible to members */}
        {isMember() && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Community Posts</h2>
            <CommunityPosts communityId={communityId} />
          </div>
        )}

      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Community</DialogTitle>
            <DialogDescription>Update your community information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name">Community Name *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                  required
                  maxLength={500}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <select
                  id="edit-category"
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-image">Community Image URL (optional)</Label>
                <Input
                  id="edit-image"
                  type="url"
                  value={editFormData.image}
                  onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-isPrivate"
                  checked={editFormData.isPrivate}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, isPrivate: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="edit-isPrivate" className="cursor-pointer">
                  Make this a private community
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={editing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white"
                disabled={editing}
              >
                {editing ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Community</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this community? This action cannot be undone and all
              members will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Community"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Members Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Community Members ({community.memberCount})</DialogTitle>
            <DialogDescription>
              All members of {community.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {community.members && community.members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {community.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">{member.name}</p>
                      <p className="text-xs text-neutral-500">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">No members yet</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
