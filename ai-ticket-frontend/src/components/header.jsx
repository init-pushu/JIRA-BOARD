import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="navbar bg-primary text-white px-6 justify-between">
      <div className="flex items-center gap-6">
        <div className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          JIRA BOARD
        </div>

        {role === "admin" && (
          <Link to="/admin" className="btn btn-sm btn-outline text-white">
            Admin Panel
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex flex-col items-end text-sm">
          <div className="font-semibold">{userEmail}</div>
          {role && (
            <div className="badge badge-secondary mt-1 capitalize">
              {role}
            </div>
          )}
        </div>
         <div className="avatar">
          <div className="w-12 h-12 rounded-full bg-neutral-focus text-neutral-content flex items-center justify-center">
            <span className="semi-bold">
              {userEmail[0]?.toUpperCase() || "U"}
            </span>
          </div>
        </div>
        <button className="btn btn-sm btn-accent ml-2" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
