import express from "express";
import { prisma } from "../prismaClient.js";

const router = express.Router();

/**
 * GET /event-types
 * List all event types
 */
router.get("/", async (req, res) => {
  const events = await prisma.eventType.findMany({
    orderBy: { id: "desc" },
  });
  res.json(events);
});

/**
 * POST /event-types
 * Create event type
 */
router.post("/", async (req, res) => {
  const { name, duration } = req.body;

  if (!name || !duration) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const event = await prisma.eventType.create({
    data: { name, duration: Number(duration), slug },
  });

  res.json(event);
});

/**
 * PUT /event-types/:id
 */
router.put("/:id", async (req, res) => {
  const { name, duration } = req.body;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const event = await prisma.eventType.update({
    where: { id: Number(req.params.id) },
    data: { name, duration: Number(duration), slug },
  });

  res.json(event);
});

/**
 * DELETE /event-types/:id
 */
router.delete("/:id", async (req, res) => {
  await prisma.eventType.delete({
    where: { id: Number(req.params.id) },
  });

  res.json({ success: true });
});

export default router;
