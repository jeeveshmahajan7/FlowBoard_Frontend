import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return; // guard against double submit

    try {
      setLoading(true);

      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.token);

      toast.success("Welcome back 👋");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      if (error.status === 401) {
        toast.error("Invalid email or password");
      } else if (error.status === 404) {
        toast.error("User not found");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-base-200">
      {/* Brand */}
      <header className="absolute top-6 left-6">
        <h1 className="text-2xl font-bold tracking-wide text-primary">
          <Link to="/">FlowBoard</Link>
        </h1>
      </header>

      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse max-w-3xl px-6">
          {/* Hero Text */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">
              Turn plans into progress. Without the chaos.
            </h1>
            <p className="py-6">
              FlowBoard brings all your team's work into one place — so everyone
              knows what to do, who owns it, and what's moving forward next.
            </p>
          </div>

          {/* Form boundary */}
          <form onSubmit={handleLogin}>
            <fieldset
              disabled={loading}
              className="fieldset bg-base-100 shadow-2xl border-base-300 rounded-box shrink-0 w-xs max-w-sm border p-4"
            >
              <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-white">
                Welcome back
              </h2>

              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" className="btn btn-neutral mt-4">
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              <p className="py-3">
                No account?{" "}
                <a href="/signup" className="link link-primary link-hover">
                  Create one
                </a>
              </p>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
