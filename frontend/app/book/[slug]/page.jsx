"use client"

import { useState, useEffect, use } from "react"
import { Clock, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/calendar"
import { TimeSlots } from "@/components/time-slots"
import { getEventTypes } from "@/lib/api/event-types"
import { getSlots } from "@/lib/api/slots"
import { createBooking } from "@/lib/api/bookings"

export default function BookingPage({ params }) {
  const resolvedParams = use(params)
  const { slug } = resolvedParams

  const [eventType, setEventType] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [submitting, setSubmitting] = useState(false)

  // Fetch event type by slug
  useEffect(() => {
    async function fetchEventType() {
      try {
        const eventTypes = await getEventTypes()
        const found = eventTypes.find((et) => et.slug === slug)
        setEventType(found || null)
      } catch (error) {
        console.error("Failed to fetch event type:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEventType()
  }, [slug])

  // Fetch slots when date is selected
  useEffect(() => {
    if (!selectedDate || !eventType) return

    async function fetchSlots() {
      setSlotsLoading(true)
      setSlots([])
      setSelectedSlot(null)
      try {
        const dateStr = formatDate(selectedDate)
        const data = await getSlots(eventType.id, dateStr)
        setSlots(data)
        console.log("SLOTS IN TIMESLOTS:", data);

      } catch (error) {
        console.error("Failed to fetch slots:", error)
      } finally {
        setSlotsLoading(false)
      }
    }
    fetchSlots()
  }, [selectedDate, eventType])

  function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  function formatDisplayDate(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  function handleSlotSelect(time) {
    setSelectedSlot(time)
    setShowForm(true)
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Parse time slot (e.g., "09:00" or "09:00 - 10:00")
      const timeStr = selectedSlot.split(" - ")[0]
      const [hours, minutes] = timeStr.split(":").map(Number)
      
      // Create start and end times
      const startTime = new Date(selectedDate)
      startTime.setHours(hours, minutes, 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + eventType.duration)
      
      await createBooking({
        eventTypeId: eventType.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        name: formData.name,
        email: formData.email,
      })
      setBookingConfirmed(true)
    } catch (error) {
      console.error("Failed to create booking:", error)
    } finally {
      setSubmitting(false)
    }
  }

  function handleBack() {
    setShowForm(false)
    setSelectedSlot(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!eventType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Event type not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Booking Confirmed Screen
  if (bookingConfirmed) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-4">You're scheduled with {eventType.name}</p>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <p className="font-medium text-gray-900">{formatDisplayDate(selectedDate)}</p>
              <p className="text-gray-600">{selectedSlot}</p>
              <p className="text-gray-600 mt-2">{formData.name}</p>
              <p className="text-gray-500 text-sm">{formData.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {eventType.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-xl">{eventType.name}</CardTitle>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>{eventType.duration} min</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {showForm ? (
              // Booking Form
              <div className="p-6">
                <Button variant="ghost" onClick={handleBack} className="mb-4 -ml-2 text-gray-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="mb-6">
                  <p className="font-medium text-gray-900">{formatDisplayDate(selectedDate)}</p>
                  <p className="text-blue-600">{selectedSlot}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700">
                    {submitting ? "Scheduling..." : "Schedule Meeting"}
                  </Button>
                </form>
              </div>
            ) : (
              // Calendar and Time Slots
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                <div className="p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Select a Date</h3>
                  <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                </div>
                <div className="p-6">
                  {selectedDate ? (
                    <>
                      <p className="text-sm text-gray-500 mb-4">{formatDisplayDate(selectedDate)}</p>
                      <TimeSlots
                        slots={slots}
                        selectedSlot={selectedSlot}
                        onSlotSelect={handleSlotSelect}
                        loading={slotsLoading}
                      />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p>Select a date to view available times</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
