import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setTickets(data.tickets || []);
        } else {
          console.error(data.message || "Failed to fetch tickets");
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">All Tickets</h2>
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className="bg-base-100 p-4 rounded border shadow mb-3"
        >
          <p><strong>Title:</strong> {ticket.title}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p>
            <strong>Assigned To:</strong>{" "}
            {ticket.assignedTo?.email || "Not assigned"}
          </p>
          <p className="text-sm text-gray-500">
            Created At: {new Date(ticket.createdAt).toLocaleString()}
          </p>
          <Link
            className="text-blue-500 underline text-sm mt-2 inline-block"
            to={`/tickets/${ticket._id}`}
          >
            View Details
          </Link>
        </div>
      ))}
      {tickets.length === 0 && <p>No tickets found.</p>}
    </div>
  );
}
