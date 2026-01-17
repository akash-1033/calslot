const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export async function getBookings() {
  const response = await fetch(`${BASE_URL}/bookings`)
  if (!response.ok) {
    throw new Error("Failed to fetch bookings")
  }
  return response.json()
}

export async function createBooking(data) {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create booking")
  }

  return response.json()
}

export async function deleteBooking(id) {
  const response = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete booking")
  }

  return response.json()
}
