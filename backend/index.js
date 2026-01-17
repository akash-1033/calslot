import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import eventTypesRouter from "./routes/eventTypes.js";
import availabilityRouter from "./routes/availability.js";
import slotsRouter from "./routes/slots.js";
import bookingsRouter from "./routes/bookings.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/event-types", eventTypesRouter);

app.use("/availability", availabilityRouter);

app.use("/slots", slotsRouter);

app.use("/bookings", bookingsRouter);

app.listen(PORT, () => {
  console.log("Server running on PORT: " + PORT);
});