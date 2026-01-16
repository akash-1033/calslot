import express from "express";
import { prisma } from "../prismaClient.js";
import { generateSlots } from "..utils/slotGenerator.js";

const router = express.Router();

/**
 * GET /slots?eventTypeId=&date=
 */
router.get("/", async (req, res) => {
  const { eventTypeId, date } = req.query;

  const eventType = await prisma.eventType.findUnique({
    where: { id: Number(eventTypeId) },
  });

  const availability = await prisma.availability.findMany();
  const bookings = await prisma.booking.findMany({
    where: {
      eventTypeId: Number(eventTypeId),
      startTime: {
        gte: new Date(`${date}T00:00:00`),
        lte: new Date(`${date}T23:59:59`),
      },
      status: "CONFIRMED",
    },
  });

  const slots = generateSlots({
    date,
    availability,
    duration: eventType.duration,
    bookings,
    timezone: availability[0]?.timezone || "UTC",
  });

  res.json(slots);
});

export default router;
