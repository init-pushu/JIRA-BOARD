import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [userEmail, setUserEmail] = useState("Unknown User");
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) setUserEmail(user.email);
    if (user?.role) setRole(user.role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="navbar bg-primary text-white px-6">
      <div className="flex-1 text-xl font-bold">JIRA BOARD</div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-300">
          <div className="text-white font-semibold">{userEmail}</div>
          {role && (
            <div className="badge badge-secondary mt-1 capitalize">
              {role}
            </div>
          )}
        </div>
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
            <span>{userEmail[0]?.toUpperCase() || "U"}</span>
          </div>
        </div>
        <button className="btn btn-sm btn-accent ml-2" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
