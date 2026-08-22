import React, { useState } from "react";
import axios from "axios";

const EventForm = () => {
  const [eventData, setEventData] = useState({
    event_name: "",
    description: "",
    event_date: "",
    event_time: "",
    venue: "",
    ticketprice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/events", eventData);
      console.log("Event saved:", response.data);

      // Clear the form after successful submission
      setEventData({
        event_name: "",
        description: "",
        event_date: "",
        event_time: "",
        venue: "",
        ticketprice: "",
      });
      alert("Event saved successfully!");
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message 
        ? error.response.data.message 
        : error.message;
      console.error("Error saving event:", errorMessage);
      alert("Failed to save event: " + errorMessage); e
    }
  };

  return (
    <div className=" mx-auto flex items-center justify-center min-h-screen bg-white lg:bg-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-hidden lg:shadow-md rounded px-8  pb-8 mb-4 w-full lg:w-[600px]  ">
      <h2 className="text-xl font-bold mb-4 text-center mt-4">Add New Event</h2>
        <div>
          <label className="block mb-1" htmlFor="event_name">Event Name</label>
          <input
            type="text"
            name="event_name"
            id="event_name"
            value={eventData.event_name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md  border-black" 
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={eventData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md  border-black"
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="event_date">Date</label>
          <input
            type="date"
            name="event_date"
            id="event_date"
            value={eventData.event_date}
            onChange={handleChange}
            required
            className="w-full p-2  border rounded-md  border-black"
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="event_time">Time</label>
          <input
            type="time"
            name="event_time"
            id="event_time"
            value={eventData.event_time}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md  border-black"
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="venue">Venue</label>
          <input
            type="text"
            name="venue"
            id="venue"
            value={eventData.venue}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md  border-black"
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="ticketprice">Ticket Price</label>
          <input
            type="number"
            name="ticketprice"
            id="ticketprice"
            value={eventData.ticketprice}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md  border-black"
          />
        </div>
        <button
          type="submit"
          className="w-[100px] bg-black text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Event
        </button>
      </form>
      </div>

  );
};

export default EventForm;
