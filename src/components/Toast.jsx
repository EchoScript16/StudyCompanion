// src/components/Toast.jsx
import React, { useEffect, useState } from "react";

export function Toast({ id, message = "", type = "info", onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(id), 4000);
    return () => clearTimeout(t);
  }, [id, onClose]);

  const bg =
    type === "error" ? "bg-red-600" : type === "success" ? "bg-green-600" : "bg-gray-800";

  return (
    <div className={`${bg} text-white px-4 py-2 rounded shadow-md`}>
      {message}
    </div>
  );
}

// simple container you can mount in Layout
export function ToastContainer({ toasts = [], removeToast }) {
  return (
    <div className="fixed top-6 right-6 flex flex-col gap-3 z-50">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={removeToast} />
      ))}
    </div>
  );
}
