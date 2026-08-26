const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// Compatibility for existing frontend routes (/events and /event)
router.post("/events", createEvent);
router.get("/events", getEvents);

router.post("/event", createEvent);
router.get("/event", getEvents);
router.get("/event/:id", getEventById);
router.put("/event/:id", updateEvent);
router.delete("/event/:id", deleteEvent);

module.exports = router;
