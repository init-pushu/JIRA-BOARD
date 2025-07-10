import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Header from "../components/header.jsx";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setTicket(data.ticket);
        } else {
          alert(data.message || "Failed to fetch ticket");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading ticket details...</div>;
  if (!ticket) return <div className="text-center mt-10 text-lg">Ticket not found</div>;

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">🎫 Ticket Details</h2>

        <div className="card bg-base-100 shadow-xl p-6 space-y-4">
          <h3 className="text-2xl font-semibold">{ticket.title}</h3>
          <p className="text-base text-gray-700">{ticket.description}</p>

          {ticket.status && (
            <>
              <div className="divider">Metadata</div>
              <p><strong>Status:</strong> {ticket.status}</p>

              {ticket.priority && (
                <p><strong>Priority:</strong> {ticket.priority}</p>
              )}

              {ticket.relatedSkills?.length > 0 && (
                <p><strong>Related Skills:</strong> {ticket.relatedSkills.join(", ")}</p>
              )}

              {ticket.helpfulNotes && (
                <div>
                  <strong>Helpful Notes:</strong>
                  <div className="prose bg-base-300 p-3 rounded mt-2">
                    <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
                  </div>
                </div>
              )}

              {ticket.assignedTo && (
                <p><strong>Assigned To:</strong> {ticket.assignedTo?.email}</p>
              )}

              {/* {ticket.createdBy && (
                <p>
                  <strong>Created By:</strong> {ticket.createdBy}
                </p>
              )} */}

              {ticket.createdAt && (
                <p className="text-sm text-gray-500">
                  Created At: {new Date(ticket.createdAt).toLocaleString()}
                </p>
              )}
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-outline btn-primary"
          >
            ⬅ Go Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
