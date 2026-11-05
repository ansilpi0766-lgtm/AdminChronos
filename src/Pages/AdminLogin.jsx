import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (user.role !== "admin") {
        setError("Access denied. Admin account required.");
        return;
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));

      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-10 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl tracking-[5px] text-[#421713]">CHRONOS</h1>

          <p className="text-[10px] tracking-[4px] text-gray-400 mt-2">
            ADMINISTRATION
          </p>

          <h2 className="text-xl font-serif mt-8 text-[#421713]">
            Admin Login
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Welcome back! Please login to your account.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs text-[#421713]">Email Address</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full mt-2 border border-gray-200 p-3 text-sm outline-none focus:border-[#421713]"
            />
          </div>

          <div>
            <label className="text-xs text-[#421713]">Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full mt-2 border border-gray-200 p-3 text-sm outline-none focus:border-[#421713]"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#421713] text-[#FFEDD0] py-3 text-sm hover:bg-[#5b261e] disabled:opacity-50"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
