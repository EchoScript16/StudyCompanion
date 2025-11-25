import React from "react";

export default function Logo({ size = 44, compact = false }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0" stopColor="#6b7bff" />
            <stop offset="1" stopColor="#5ad0c6" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="12" fill="url(#g)" />
        <circle cx="24" cy="26" r="4" fill="#0f1113" />
        <circle cx="40" cy="26" r="4" fill="#0f1113" />
        <path d="M22 40c4 4 16 4 20 0" stroke="#0f1113" strokeWidth="3" strokeLinecap="round" />
      </svg>

      {!compact && (
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>StudyAI</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>notes • flashcards • mindmaps • tutor</div>
        </div>
      )}
    </div>
  );
}
