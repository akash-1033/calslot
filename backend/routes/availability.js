import express from "express";
import { prisma } from "../prismaClient.js";

const router = express.Router();

/**
 * GET /availability
 * Get weekly availability
 */
router.get("/", async (req, res) => {
  const availability = await prisma.availability.findMany({
    orderBy: { weekday: "asc" },
  });
  res.json(availability);
});

/**
 * POST /availability
 * Set weekly availability (overwrite)
 */
router.post("/", async (req, res) => {
  const { availability } = req.body;
  // availability = [{ weekday, startTime, endTime, timezone }]

  await prisma.availability.deleteMany();

  await prisma.availability.createMany({
    data: availability,
  });

  res.json({ success: true });
});

export default router;
