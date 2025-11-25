import React from "react";

export default function Logo(props) {
  return (
    <svg viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="120" height="30" rx="6" fill="#6C5CE7"/>
      <text x="16" y="19" fill="#fff" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="700">StudyAI</text>
    </svg>
  );
}
