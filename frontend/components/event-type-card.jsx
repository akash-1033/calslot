"use client"

import { Clock, LinkIcon, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EventTypeCard({ eventType, onDelete, onEdit }) {
  const bookingUrl = `/book/${eventType.slug}`

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">{eventType.name}</CardTitle>
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(eventType)}
                className="h-8 w-8 text-gray-500 hover:text-blue-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(eventType.id)}
              className="h-8 w-8 text-gray-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{eventType.duration} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-blue-600">
          <LinkIcon className="w-4 h-4" />
          <a href={bookingUrl} className="text-sm hover:underline" target="_blank" rel="noopener noreferrer">
            {typeof window !== "undefined" ? window.location.origin : ""}
            {bookingUrl}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
