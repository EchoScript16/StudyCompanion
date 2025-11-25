import React, { useState } from "react";
import api from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await api.post("/auth/register", { email, password });

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setErrorMsg("Registration failed. Try again.");
      console.log(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-black px-4">
      <div className="backdrop-blur-xl bg-white/20 shadow-2xl border border-white/30 rounded-3xl p-10 w-[420px] animate-fadeIn">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-sm">
          Create Your <span className="text-indigo-300">StudyAI</span> Account
        </h2>

        {/* Error Box */}
        {errorMsg && (
          <div className="bg-red-200 border border-red-500 text-red-800 px-4 py-2 rounded-lg mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <div className="flex flex-col">
            <label className="text-white font-medium text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 border rounded-xl bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-medium text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="p-3 border rounded-xl bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`py-3 rounded-xl text-white font-semibold shadow-lg transition-all 
            ${loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700 hover:scale-[1.02]"}`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-200 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-300 font-semibold cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>

      </div>
    </div>
  );
}
