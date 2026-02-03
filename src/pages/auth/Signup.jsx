import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // guard against double submit

    try {
      setLoading(true);

      await api.post("/auth/signup", { name, email, password });

      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Account creation failed");
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

      {/* Signup Hero Section */}
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse max-w-3xl px-6">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">
              Create your workspace in minutes
            </h1>
            <p className="py-6">
              Get started with FlowBoard and bring clarity to your team's work —
              no setup complexity, no noise.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset
              disabled={loading}
              className="fieldset bg-base-100 shadow-2xl border-base-300 rounded-box shrink-0 w-xs max-w-sm border p-4"
            >
              <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-white">
                Welcome to FlowBoard
              </h2>

              <label className="label">Name</label>
              <input
                type="text"
                className="input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

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
                    Creating account..
                  </>
                ) : (
                  "Create your account"
                )}
              </button>

              <p className="py-3">
                Already have an account?{" "}
                <a href="/login" className="link link-primary link-hover">
                  Log in
                </a>
              </p>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
