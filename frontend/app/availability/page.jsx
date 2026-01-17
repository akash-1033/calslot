"use client"

import { useState, useEffect } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAvailability, saveAvailability } from "@/lib/api/availability"

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
]

const TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland",
]

const DEFAULT_AVAILABILITY = {
  monday: { enabled: true, start: "09:00", end: "18:00" },
  tuesday: { enabled: true, start: "09:00", end: "18:00" },
  wednesday: { enabled: true, start: "09:00", end: "18:00" },
  thursday: { enabled: true, start: "09:00", end: "18:00" },
  friday: { enabled: true, start: "09:00", end: "18:00" },
}

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState(DEFAULT_AVAILABILITY)
  const [timezone, setTimezone] = useState("Asia/Kolkata")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const data = await getAvailability()
        if (data && data.schedule) {
          setAvailability(data.schedule)
        }
        if (data && data.timezone) {
          setTimezone(data.timezone)
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAvailability()
  }, [])

  function handleDayToggle(day) {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }))
  }

  function handleTimeChange(day, field, value) {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }))
  }

  async function handleSave() {
    setSaving(true)
    setSaveSuccess(false)
    try {
      await saveAvailability({
        schedule: availability,
        timezone: timezone,
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to save availability:", error)
    } finally {
      setSaving(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="text-gray-600">Set your weekly available hours</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          Availability saved successfully!
        </div>
      )}

      {/* Timezone Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Timezone</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DAYS.map((day) => (
              <div key={day.key} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-3 w-32">
                  <input
                    type="checkbox"
                    checked={availability[day.key].enabled}
                    onChange={() => handleDayToggle(day.key)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">{day.label}</span>
                </label>
                {availability[day.key].enabled ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={availability[day.key].start}
                      onChange={(e) => handleTimeChange(day.key, "start", e.target.value)}
                      className="w-32"
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      type="time"
                      value={availability[day.key].end}
                      onChange={(e) => handleTimeChange(day.key, "end", e.target.value)}
                      className="w-32"
                    />
                  </div>
                ) : (
                  <span className="text-gray-400">Unavailable</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
