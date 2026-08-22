import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../EventDetails/Tablecss/Table.css";

const EventDetails = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/event");
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading events...</div>;
  }

  return (
    <div className="max-w-6xl p-4 mx-auto">
      <h2 className="mb-4 text-2xl font-bold text-center pt-10">Event List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-collapse border-gray-300 rounded-lg shadow-lg responsive-table">
          <thead className="text-black bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300">Event Name</th>
              <th className="p-2 border border-gray-300">Description</th>
              <th className="p-2 border border-gray-300">Date</th>
              <th className="p-2 border border-gray-300">Time</th>
              <th className="p-2 border border-gray-300">Venue</th>
              <th className="p-2 border border-gray-300">Ticket Price</th>
              <th className="p-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr
                  key={event.id}
                  className="transition-colors duration-200 hover:bg-gray-100"
                >
                  <td
                    className="p-4 border border-gray-300 text-center"
                    data-label="Event Name"
                  >
                    {event.event_name}
                  </td>
                  <td
                    className="p-4 border border-gray-300 text-center"
                    data-label="Description"
                  >
                    {event.description}
                  </td>
                  <td className="p-4 border border-gray-300 text-center" data-label="Date">
                    {new Date(event.event_date).toISOString().split("T")[0]}
                  </td>

                  <td className="p-4 border border-gray-300 text-center" data-label="Time">
                    {event.event_time}
                  </td>
                  <td className="p-4 border border-gray-300 text-center" data-label="Venue">
                    {event.venue}
                  </td>
                  <td
                    className="p-4 border border-gray-300 text-center"
                    data-label="Ticket Price"
                  >
                    {event.ticketprice}
                  </td>
                  <td
                    className="p-4 border border-gray-300 text-center"
                    data-label="Action"
                  >
                    <button
                      className="px-4 py-1 text-white transition bg-black rounded-md hover:bg-gray-800"
                      onClick={() => handleBuyTicket(event)}
                    >
                      Buy Ticket
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-4 text-center border border-gray-300"
                >
                  No events available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  function handleBuyTicket(event) {
    // Navigate to the BuyTicket page with event details
    navigate("/buyticket", { state: event });
  }
};

export default EventDetails;
