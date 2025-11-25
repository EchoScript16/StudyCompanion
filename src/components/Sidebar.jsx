import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiBookOpen, FiClipboard, FiMessageSquare, FiLogOut } from "react-icons/fi";
import Logo from "../assets/logo";

export default function Sidebar({ collapsed, setCollapsed, onLogout }) {
  const items = [
    { to: "/", label: "Dashboard", icon: <FiHome /> },
    { to: "/notes", label: "Notes", icon: <FiBookOpen /> },
    { to: "/flashcards", label: "Flashcards", icon: <FiClipboard /> },
    { to: "/tutor", label: "Tutor Chat", icon: <FiMessageSquare /> }
  ];

  return (
    <aside className="w-72 bg-white/60 dark:bg-gray-800/70 backdrop-blur p-4 border-r hidden md:block">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Logo className="studyai-logo" />
          <div>
            <div className="font-semibold">StudyAI</div>
            <div className="text-xs text-gray-500">Smart study companion</div>
          </div>
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="text-sm text-gray-500">☰</button>
      </div>

      <nav className="flex flex-col gap-2">
        {items.map(i => (
          <NavLink key={i.to} to={i.to} className={({isActive}) => `flex items-center gap-3 p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-200'}`}>
            <span className="text-xl">{i.icon}</span>
            <span className="font-medium">{i.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-6">
        <button onClick={onLogout} className="w-full flex items-center gap-2 p-3 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
}
