import express from "express";
import cors from "cors";
import eventTypesRouter from "./routes/eventTypes.js";
import availabilityRouter from "./routes/availability.js";
import slotsRouter from "./routes/slots.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/event-types", eventTypesRouter);

app.use("/availability", availabilityRouter);

app.use("/slots", slotsRouter);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});