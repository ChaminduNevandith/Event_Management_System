const { db, FieldValue } = require("../config/firebase");

// Create a new event
const createEvent = async (req, res) => {
  const { event_name, description, event_date, event_time, venue, ticketprice } = req.body;

  if (!event_name || !description || !event_date || !event_time || !venue || ticketprice === undefined || ticketprice === "") {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newEvent = {
      event_name,
      description,
      event_date,
      event_time,
      venue,
      ticketprice: Number(ticketprice),
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("events").add(newEvent);
    res.status(201).json({ id: docRef.id, ...newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to save event", error: error.message });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const snapshot = await db.collection("events").get();
    const events = [];
    snapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};

// Get single event by ID
const getEventById = async (req, res) => {
  try {
    const docRef = db.collection("events").doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Failed to fetch event", error: error.message });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  const { event_name, description, event_date, event_time, venue, ticketprice } = req.body;

  try {
    const docRef = db.collection("events").doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedData = {
      event_name,
      description,
      event_date,
      event_time,
      venue,
      ticketprice: Number(ticketprice),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await docRef.update(updatedData);
    res.json({ id: req.params.id, ...updatedData, message: "Event updated successfully" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Failed to update event", error: error.message });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const docRef = db.collection("events").doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    await docRef.delete();
    res.json({ message: "Event deleted successfully", id: req.params.id });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event", error: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
