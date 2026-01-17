import express from "express";
import { prisma } from "../prismaClient.js";

const router = express.Router();

/**
 * GET /bookings
 * List all meetings
 */
router.get("/", async (req, res) => {
  const bookings = await prisma.booking.findMany({
    orderBy: { startTime: "asc" },
    include: { eventType: true },
  });

  res.json(bookings);
});

/**
 * POST /bookings
 * Create booking (prevent double booking)
 */
router.post("/", async (req, res) => {
  const { eventTypeId, name, email, startTime, endTime } = req.body;

  if (!eventTypeId || !name || !email || !startTime || !endTime) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Check conflict
  const conflict = await prisma.booking.findFirst({
    where: {
      eventTypeId: Number(eventTypeId),
      status: "CONFIRMED",
      startTime: { lt: new Date(endTime) },
      endTime: { gt: new Date(startTime) },
    },
  });

  if (conflict) {
    return res.status(409).json({ error: "Slot already booked" });
  }

  const booking = await prisma.booking.create({
    data: {
      eventTypeId: Number(eventTypeId),
      name,
      email,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: "CONFIRMED",
    },
  });

  res.json(booking);
});

/**
 * DELETE /bookings/:id
 * Cancel meeting
 */
router.delete("/:id", async (req, res) => {
  await prisma.booking.update({
    where: { id: Number(req.params.id) },
    data: { status: "CANCELLED" },
  });

  res.json({ success: true });
});

export default router;
