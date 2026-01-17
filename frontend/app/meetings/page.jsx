"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, User, Mail, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getBookings, deleteBooking } from "@/lib/api/bookings"
import { getEventTypes } from "@/lib/api/event-types"

export default function MeetingsPage() {
  const [bookings, setBookings] = useState([])
  const [eventTypes, setEventTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [bookingsData, eventTypesData] = await Promise.all([
        getBookings(),
        getEventTypes(),
      ])
      setBookings(bookingsData)
      setEventTypes(eventTypesData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  function getEventType(eventTypeId) {
    return eventTypes.find((et) => et.id === eventTypeId)
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  function formatTimeRange(start, end) {
    const s = new Date(start)
    const e = new Date(end)

    return `${s.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${e.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`
  }

  async function handleCancel(id) {
    if (!confirm("Are you sure you want to cancel this meeting?")) return
    try {
      await deleteBooking(id)
      fetchData()
    } catch (error) {
      console.error("Failed to cancel meeting:", error)
    }
  }

  const now = new Date()

  const upcomingBookings = bookings.filter(
  (b) =>
    b.status === "CONFIRMED" &&
    new Date(b.startTime) > now
)

const pastBookings = bookings.filter(
  (b) =>
    b.status === "CONFIRMED" &&
    new Date(b.startTime) <= now
)


  const displayBookings =
    activeTab === "upcoming" ? upcomingBookings : pastBookings

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
        <p className="text-gray-600">
          View and manage your scheduled meetings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "upcoming" ? "default" : "outline"}
          onClick={() => setActiveTab("upcoming")}
          className={activeTab === "upcoming" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          Upcoming ({upcomingBookings.length})
        </Button>

        <Button
          variant={activeTab === "past" ? "default" : "outline"}
          onClick={() => setActiveTab("past")}
          className={activeTab === "past" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          Past ({pastBookings.length})
        </Button>
      </div>

      {/* Meetings List */}
      {displayBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              {activeTab === "upcoming"
                ? "No upcoming meetings"
                : "No past meetings"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayBookings.map((booking) => {
            const eventType = getEventType(booking.eventTypeId)

            return (
              <Card
                key={booking.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-3">
                        {eventType?.name || "Unknown Event"}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking.startTime)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatTimeRange(
                              booking.startTime,
                              booking.endTime
                            )}{" "}
                            ({eventType?.duration || 0} min)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{booking.name}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{booking.email}</span>
                        </div>
                      </div>
                    </div>

                    {activeTab === "upcoming" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancel(booking.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
