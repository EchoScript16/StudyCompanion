import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function Topbar({ setCollapsed }) {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={() => setCollapsed(c => !c)} className="md:hidden p-2 rounded bg-gray-100 dark:bg-gray-800">
          ☰
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Welcome</h1>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="p-2 rounded bg-gray-100 dark:bg-gray-800">
          <FiMoon className="dark:hidden" />
          <FiSun className="hidden dark:block" />
        </button>
      </div>
    </div>
  );
}
