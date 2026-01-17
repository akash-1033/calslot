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
  try {
    const { schedule, timezone } = req.body;
    
    console.log("Received data:", { schedule, timezone });
    
    // Map day names to numbers (0 = Monday, 4 = Friday)
    const dayMap = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
    };
    
    // Convert schedule object to array format for Prisma
    const availabilityData = Object.entries(schedule)
      .filter(([_, settings]) => settings.enabled) // Only include enabled days
      .map(([day, settings]) => ({
        weekday: dayMap[day],
        startTime: settings.start,
        endTime: settings.end,
        timezone: timezone,
      }));

    console.log("Availability data to save:", availabilityData);

    await prisma.availability.deleteMany();

    if (availabilityData.length > 0) {
      await prisma.availability.createMany({
        data: availabilityData,
        skipDuplicates: true,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error saving availability:", error);
    res.status(500).json({ error: error.message, details: error.toString() });
  }
});

export default router;
