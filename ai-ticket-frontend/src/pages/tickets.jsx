import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header.jsx";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTickets = async (pageNum = 1) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/tickets?page=${pageNum}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        }
      );
      const data = await res.json();
      setTickets(data.tickets || []);
      setPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets(page);
  }, [page]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets(page); // Reload current page
      } else {
        alert(data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <div className="p-4 max-w-3xl mx-auto">
        {user.role === "user" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Create Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-3 mb-8">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ticket Title"
                className="input input-bordered w-full"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Ticket Description"
                className="textarea textarea-bordered w-full"
                required
              ></textarea>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>
            </form>
          </>
        )}

        <h2 className="text-xl font-semibold mb-2">
          {user.role === "admin"
            ? "All Tickets (Admin View)"
            : "Your Tickets"}
        </h2>

        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Link
              key={ticket._id}
              className="card shadow-md p-4 bg-gray-800 text-white hover:bg-gray-700 transition"
              to={`/tickets/${ticket._id}`}
            >
              <h3 className="font-bold text-lg">{ticket.title}</h3>
              <p className="text-sm mb-1">{ticket.description}</p>
              <p className="text-sm text-gray-400">
                Created At: {new Date(ticket.createdAt).toLocaleString()}
              </p>
              {ticket.status && (
                <p className="text-sm text-yellow-400">
                  Status: {ticket.status}
                </p>
              )}
              {user.role === "moderator" && (
                <p className="text-sm text-green-400">
                  Created By: {ticket.createdBy.email}
                </p>
              )}
              {user.role === "user" &&
                ticket.assignedTo?.email && (
                  <p className="text-sm text-green-400">
                    Assigned To: {ticket.assignedTo.email}
                  </p>
                )}
              {user.role === "admin" && (
                <>
                  {ticket.assignedTo?.email && (
                    <p className="text-sm text-green-400">
                      Assigned To: {ticket.assignedTo.email}
                    </p>
                  )}
                  {ticket.createdBy?.email && (
                    <p className="text-sm text-purple-400">
                      Created By: {ticket.createdBy.email}
                    </p>
                  )}
                </>
              )}
            </Link>
          ))}
          {tickets.length === 0 && (
            <p className="text-center text-gray-500">No tickets found.</p>
          )}
        </div>

        <div className="flex justify-center mt-8 gap-6">
          <button
            className="px-5 py-2 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/80 transition disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <span className="px-4 py-2 text-lg font-semibold text-gray-700 bg-white rounded-lg shadow">
            Page {page} of {totalPages}
          </span>

          <button
            className="px-5 py-2 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/80 transition disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next 
          </button>
        </div>
      </div>
    </div>
  );
}
