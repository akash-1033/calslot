"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Calendar, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEventTypes } from "@/lib/api/event-types"
import { getBookings } from "@/lib/api/bookings"

export default function Dashboard() {
  const [eventTypes, setEventTypes] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventTypesData, bookingsData] = await Promise.all([getEventTypes(), getBookings()])
        setEventTypes(eventTypesData)
        setBookings(bookingsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const upcomingBookings = bookings.filter((b) => new Date(b.date + " " + b.time) > new Date())

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your scheduling dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Event Types</CardTitle>
            <Calendar className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{eventTypes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming Meetings</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
            <Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Link href="/event-types">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Event Type
              </Button>
            </Link>
            <Link href="/availability">
              <Button variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                Set Availability
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Event Types List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Event Types</CardTitle>
        </CardHeader>
        <CardContent>
          {eventTypes.length === 0 ? (
            <p className="text-gray-500">No event types yet. Create one to get started!</p>
          ) : (
            <div className="space-y-3">
              {eventTypes.slice(0, 5).map((eventType) => (
                <div key={eventType.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{eventType.name}</p>
                    <p className="text-sm text-gray-500">{eventType.duration} minutes</p>
                  </div>
                  <Link href={`/book/${eventType.slug}`}>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      View Booking Page
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
