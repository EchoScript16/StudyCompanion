import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ dark, setDark }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 shadow-sm" style={{ background: "var(--panel)" }}>
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>StudyAI</div>
        <div className="text-sm opacity-70">AI study companion</div>
      </div>
      <div className="flex items-center gap-4">
        <button className="px-3 py-2 rounded-md" onClick={() => setDark(!dark)}>
          {dark ? "🌙 Dark" : "🌞 Light"}
        </button>
        <Link to="/tutor" className="btn px-3 py-2 rounded-md">Tutor</Link>
        <button onClick={logout} className="px-3 py-2 rounded-md bg-red-600 text-white">Logout</button>
      </div>
    </nav>
  );
}
