import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/header";
import JiraBoardIntro from "../components/jiraboardintro";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("OK")
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-base-200 py-10 px-4 flex flex-col items-center">
        <JiraBoardIntro />
        <div className="card w-full max-w-sm mt-6 shadow-2xl bg-base-100">
          <form onSubmit={handleLogin} className="card-body">
            <h2 className="text-2xl font-bold text-center">Login</h2>

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={form.password}
              onChange={handleChange}
              required
            />

            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <p className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
