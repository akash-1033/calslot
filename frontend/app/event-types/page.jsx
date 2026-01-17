"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EventTypeCard } from "@/components/event-type-card"
import { getEventTypes, createEventType, updateEventType, deleteEventType } from "@/lib/api/event-types"

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEventType, setEditingEventType] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    duration: 30,
    slug: "",
  })

  useEffect(() => {
    fetchEventTypes()
  }, [])

  async function fetchEventTypes() {
    try {
      const data = await getEventTypes()
      setEventTypes(data)
    } catch (error) {
      console.error("Failed to fetch event types:", error)
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number.parseInt(value) || 0 : value,
      // Auto-generate slug from name
      ...(name === "name" ? { slug: value.toLowerCase().replace(/\s+/g, "-") } : {}),
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (editingEventType) {
        await updateEventType(editingEventType.id, formData)
      } else {
        await createEventType(formData)
      }
      setDialogOpen(false)
      setEditingEventType(null)
      setFormData({ name: "", duration: 30, slug: "" })
      fetchEventTypes()
    } catch (error) {
      console.error("Failed to save event type:", error)
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this event type?")) return
    try {
      await deleteEventType(id)
      fetchEventTypes()
    } catch (error) {
      console.error("Failed to delete event type:", error)
    }
  }

  function handleEdit(eventType) {
    setEditingEventType(eventType)
    setFormData({
      name: eventType.name,
      duration: eventType.duration,
      slug: eventType.slug,
    })
    setDialogOpen(true)
  }

  function handleDialogClose() {
    setDialogOpen(false)
    setEditingEventType(null)
    setFormData({ name: "", duration: 30, slug: "" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
          <p className="text-gray-600">Create and manage your event types</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setEditingEventType(null)
                setFormData({ name: "", duration: 30, slug: "" })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Event Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEventType ? "Edit Event Type" : "Create Event Type"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., 30 Minute Meeting"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <Input
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min={15}
                  max={120}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="e.g., 30-minute-meeting"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingEventType ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {eventTypes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">No event types yet</p>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Event Type
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventTypes.map((eventType) => (
            <EventTypeCard key={eventType.id} eventType={eventType} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  )
}
