const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL

export async function getEventTypes() {
  const response = await fetch(`${BASE_URL}/event-types`)
  if (!response.ok) throw new Error("Failed to fetch event types")
  return response.json()
}

export async function createEventType(data) {
  const response = await fetch(`${BASE_URL}/event-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create event type")
  return response.json()
}

export async function updateEventType(id, data) {
  const response = await fetch(`${BASE_URL}/event-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update event type")
  return response.json()
}

export async function deleteEventType(id) {
  const response = await fetch(`${BASE_URL}/event-types/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete event type")
  return response.json()
}
