import React, { useEffect, useState } from "react";

export default function ThemeToggle(){
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(()=> {
    document.documentElement.setAttribute("data-theme", theme==="dark"?"dark":"light");
    localStorage.setItem("theme", theme);
  },[theme]);

  return (
    <div style={{display:"flex",gap:8,alignItems:"center"}}>
      <button className="btn-ghost small" onClick={()=> setTheme(t=> t==="dark"?"light":"dark")}>
        {theme==="dark" ? "Light" : "Dark"}
      </button>
    </div>
  );
}
