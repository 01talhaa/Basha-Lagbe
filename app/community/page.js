"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Filter } from "lucide-react"

export default function CommunityPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [creating, setCreating] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "general",
    image: "",
    isPrivate: false,
    rules: [],
    tags: [],
  })

  const categories = [
    { value: "all", label: "All Communities" },
    { value: "housing", label: "Housing" },
    { value: "neighborhood", label: "Neighborhood" },
    { value: "maintenance", label: "Maintenance" },
    { value: "social", label: "Social" },
    { value: "events", label: "Events" },
    { value: "general", label: "General" },
  ]

  useEffect(() => {
    fetchCommunities()
  }, [searchTerm, selectedCategory])

  const fetchCommunities = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory !== "all") params.append("category", selectedCategory)

      const response = await fetch(`/api/communities?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setCommunities(data.communities)
      }
    } catch (error) {
      console.error("Error fetching communities:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCommunity = async (e) => {
    e.preventDefault()

    if (status !== "authenticated") {
      toast.error("Please login to create a community")
      router.push("/login")
      return
    }

    setCreating(true)
    try {
      const response = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setShowCreateDialog(false)
        setFormData({
          name: "",
          description: "",
          category: "general",
          image: "",
          isPrivate: false,
          rules: [],
          tags: [],
        })
        fetchCommunities()
        toast.success("Community created successfully!")
      } else {
        toast.error(data.error || "Failed to create community")
      }
    } catch (error) {
      console.error("Error creating community:", error)
      toast.error("Failed to create community")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">Communities</h1>
          <p className="text-neutral-600">Connect with neighbors and fellow residents</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => {
                  if (status !== "authenticated") {
                    toast.error("Please login to create a community")
                    router.push("/login")
                    return
                  }
                  setShowCreateDialog(true)
                }}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Community
              </Button>
            </div>
          </div>
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-40 bg-neutral-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : communities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link
                key={community._id}
                href={`/community/${community._id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary to-orange-600">
                  {community.image ? (
                    <img
                      src={community.image}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="h-16 w-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white text-neutral-900 capitalize">
                      {community.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                    {community.name}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                    {community.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Users className="h-4 w-4" />
                      <span>{community.memberCount} members</span>
                    </div>
                    <span className="text-xs text-neutral-400">
                      By {community.creatorName}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No communities found</h3>
            <p className="text-neutral-600 mb-6">Be the first to create a community!</p>
            <Button
              onClick={() => {
                if (status !== "authenticated") {
                  toast.error("Please login to create a community")
                  router.push("/login")
                  return
                }
                setShowCreateDialog(true)
              }}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </div>
        )}
      </div>

      {/* Create Community Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create a New Community</DialogTitle>
            <DialogDescription>
              Build a space for people to connect and share experiences
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCommunity}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Community Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Downtown Residents"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Tell people what this community is about..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  maxLength={500}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  {categories.filter((c) => c.value !== "all").map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="image">Community Image URL (optional)</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isPrivate" className="cursor-pointer">
                  Make this a private community
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Community"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}