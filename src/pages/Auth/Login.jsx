import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const resp = await login({ email, password, remember });
      console.log("Login success:", resp);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMsg("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 px-4">
      <div className="backdrop-blur-xl bg-white/30 shadow-2xl border border-white/50 rounded-3xl p-10 w-[420px] animate-fadeIn">

        {/* App Title */}
        <h2 className="text-3xl font-bold text-center mb-6 text-black drop-shadow-sm">
          Welcome to <span className="text-indigo-800">StudyAI</span>
        </h2>

        {/* Error Box */}
        {errorMsg && (
          <div className="bg-red-200 border border-red-500 text-red-800 px-4 py-2 rounded-lg mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col">
            <label className="text-black font-medium text-sm mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 border rounded-xl bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-black font-medium text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="p-3 border rounded-xl bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-2 text-sm text-black">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="accent-indigo-700"
            />
            Remember me
          </label>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`py-3 rounded-xl text-white font-semibold shadow-lg transition-all 
              ${loading ? "bg-indigo-300" : "bg-indigo-700 hover:bg-indigo-800 hover:scale-[1.02]"}`}
          >
            {loading ? "Signing you in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-black mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-800 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}
