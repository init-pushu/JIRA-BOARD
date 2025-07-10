import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/header";
import JiraBoardIntro from "../components/jiraboardintro";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "", skills: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: form.email,
          password: form.password,
          role: form.role,
          skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");
      } else alert(data.message || "Signup failed");
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <JiraBoardIntro />
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-md shadow-xl bg-base-100">
          <form onSubmit={handleSignup} className="card-body">
            <h2 className="card-title justify-center">Sign Up</h2>

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              className="input input-bordered"
              value={form.skills}
              onChange={handleChange}
            />
            <select
              name="role"
              className="select select-bordered"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
            </select>

            <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="text-sm text-center mt-2">
              Already have an account? <Link to="/" className="link">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
