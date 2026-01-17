const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL

export async function getSlots(eventTypeId, date) {
  const response = await fetch(`${BASE_URL}/slots?eventTypeId=${eventTypeId}&date=${date}`)
  if (!response.ok) throw new Error("Failed to fetch slots")
  return response.json()
}
