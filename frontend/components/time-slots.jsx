"use client"

import { DateTime } from "luxon"
import { Button } from "@/components/ui/button"

export function TimeSlots({ slots, selectedSlot, onSlotSelect, loading }) {
  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading slots...</div>
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No available slots for this date
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Available Times
      </h3>

      <div className="grid gap-2 max-h-80 overflow-y-auto">
        {slots.map((slot) => {
          const start = DateTime.fromISO(slot.start)
          const end = DateTime.fromISO(slot.end)
          const time = `${start.toFormat("HH:mm")} - ${end.toFormat("HH:mm")}`

          return (
            <Button
              key={slot.start} // ✅ stable unique key
              variant={selectedSlot === time ? "default" : "outline"}
              onClick={() => onSlotSelect(time)}
              className={`w-full justify-center ${
                selectedSlot === time
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              {time}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
