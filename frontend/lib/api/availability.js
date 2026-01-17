const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL

export async function getAvailability() {
  const response = await fetch(`${BASE_URL}/availability`)
  if (!response.ok) throw new Error("Failed to fetch availability")
  return response.json()
}

export async function saveAvailability(data) {
  const response = await fetch(`${BASE_URL}/availability`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("Backend error:", response.status, errorData)
    throw new Error(`Failed to save availability: ${response.status} - ${errorData.error || response.statusText}`)
  }
  return response.json()
}
