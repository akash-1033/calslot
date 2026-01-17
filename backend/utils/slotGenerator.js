import { DateTime } from "luxon";

export function generateSlots({
  date,
  availability,
  duration,
  bookings,
  timezone,
}) {
  const day = DateTime.fromISO(date, { zone: timezone });
  const weekday = day.weekday - 1; // Luxon: 1–7, convert to 0–6

  const dayAvailability = availability.find(
    (a) => a.weekday === weekday
  );

  if (!dayAvailability) return [];

  const start = DateTime.fromISO(
    `${date}T${dayAvailability.startTime}`,
    { zone: timezone }
  );

  const end = DateTime.fromISO(
    `${date}T${dayAvailability.endTime}`,
    { zone: timezone }
  );

  const slots = [];
  let cursor = start;

  while (cursor.plus({ minutes: duration }) <= end) {
    const slotStart = cursor;
    const slotEnd = cursor.plus({ minutes: duration });

    const conflict = bookings.some((b) => {
      const bStart = DateTime.fromJSDate(b.startTime);
      const bEnd = DateTime.fromJSDate(b.endTime);
      return slotStart < bEnd && slotEnd > bStart;
    });

    if (!conflict) {
      slots.push({
        start: slotStart.toISO(),
        end: slotEnd.toISO(),
      });
    }

    cursor = cursor.plus({ minutes: duration });
  }

  return slots;
}
