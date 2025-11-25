import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { clearAllTokens } from "../utils/auth";
import StudyAILogo from "./StudyAILogo";
import useDarkMode from "../hooks/useDarkMode";

export default function Layout() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem("sa_sidebar_open") !== "false";
    } catch {
      return true;
    }
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useDarkMode();

  useEffect(() => {
    try {
      localStorage.setItem("sa_sidebar_open", open ? "true" : "false");
    } catch {}
  }, [open]);

  const menu = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/notes", label: "Notes", icon: "📝" },
    { to: "/flashcards", label: "Flashcards", icon: "🎴" },
    { to: "/quiz", label: "Quiz", icon: "❓" },
    { to: "/plan", label: "Study Plan", icon: "🧭" },
    { to: "/mindmap", label: "Mindmap", icon: "🧠" },
    { to: "/tutor", label: "Tutor", icon: "🤖" },
    { to: "/history", label: "History", icon: "📜" },
    { to: "/upload", label: "Upload", icon: "📄" },
  ];

  const publicLinks = [
    { to: "/about", label: "About" },
    { to: "/pricing", label: "Pricing" },
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Contact" },
  ];

  function handleLogout() {
    clearAllTokens();
    navigate("/login");
  }

  // framer variants
  const sidebarVariants = {
    open: { width: 260, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { width: 68, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    show: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.03 } }),
  };

  return (
    <div className={`flex min-h-screen bg-gradient-to-b ${dark ? "from-[#0f1724] to-[#0b1220]" : "from-gray-50 to-white"} text-gray-900 dark:text-gray-100`}>

      {/* ---------- SIDEBAR (Glass + Neon) ---------- */}
      <motion.aside
        className={`relative z-40 p-4 flex flex-col justify-between shadow-xl backdrop-blur-md border-r border-white/5 ${dark ? "bg-white/3" : "bg-white/10"} rounded-r-2xl`}
        animate={open ? "open" : "closed"}
        variants={sidebarVariants}
        initial={false}
        style={{
          boxShadow: "0 10px 30px rgba(2,6,23,0.45)",
          WebkitBackdropFilter: "blur(10px)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div>
          {/* Logo + Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-3">
              <StudyAILogo compact={!open} />
              <AnimatePresence>
                {open && (
                  <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}>
                    <div className="text-lg font-semibold select-none">StudyAI</div>
                    <div className="text-xs text-gray-400">Smart Study Companion</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search (visible when open) */}
          {open && (
            <div className="mb-4">
              <input
                placeholder="Search tools, topics..."
                className="w-full p-2 rounded-xl text-sm bg-white/6 border border-white/6 placeholder-gray-400 outline-none"
              />
            </div>
          )}

          {/* Menu */}
          <nav className="flex flex-col gap-1">
            {menu.map((m, i) => (
              <motion.div key={m.to} custom={i} initial="hidden" animate="show" variants={itemVariants}>
                <NavLink
                  to={m.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2 rounded-xl transition duration-150 select-none
                    ${isActive ? "bg-gradient-to-r from-indigo-500/20 via-purple-400/10 to-transparent ring-1 ring-indigo-400/20 shadow-sm" : "hover:bg-white/5"}`
                  }
                >
                  <div className="text-xl w-8 text-center opacity-95 group-hover:scale-105 transition-transform">{m.icon}</div>
                  {open && <div className="truncate">{m.label}</div>}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Public links (small) */}
          <div className="mt-5">
            {open && <div className="text-xs text-gray-400 mb-2">Public</div>}
            <div className="flex flex-col gap-1">
              {publicLinks.map((p) => (
                <NavLink key={p.to} to={p.to} className="px-3 py-2 rounded-md text-sm hover:bg-white/5">
                  {open ? p.label : "🔗"}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/8 transition"
            >
              <span className="text-sm">{open ? "Collapse" : "Open"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setDark(!dark)} className="flex-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/8">
              {dark ? "🌞 Light" : "🌙 Dark"}
            </button>
            <button onClick={handleLogout} className="px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </motion.aside>

      {/* ---------- MAIN ---------- */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Study Companion</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">AI tools to help you learn faster</p>
          </div>

          <div className="flex items-center gap-3">
            {/* small quick links */}
            <div className="hidden md:flex gap-3">
              <NavLink to="/about" className="text-sm px-3 py-2 rounded-md hover:bg-white/5">About</NavLink>
              <NavLink to="/pricing" className="text-sm px-3 py-2 rounded-md hover:bg-white/5">Pricing</NavLink>
              <NavLink to="/contact" className="text-sm px-3 py-2 rounded-md hover:bg-white/5">Contact</NavLink>
            </div>

            {/* compact profile placeholder */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">B</div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
