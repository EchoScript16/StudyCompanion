import React from "react";


export default function StudyAILogo({ size = 36 }) {
return (
<div className="flex items-center gap-2">
<svg
width={size}
height={size}
viewBox="0 0 48 48"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<defs>
<linearGradient id="g1" x1="0" x2="1">
<stop offset="0" stopColor="#7c3aed" />
<stop offset="1" stopColor="#06b6d4" />
</linearGradient>
</defs>
<rect x="4" y="4" width="40" height="40" rx="10" fill="url(#g1)" opacity="0.15" />
<g transform="translate(8,8)">
<circle cx="16" cy="8" r="6" fill="#fff" opacity="0.95" />
<rect x="2" y="20" width="28" height="8" rx="2" fill="#fff" opacity="0.95" />
<path d="M12 6 L20 6" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
</g>
</svg>
<span className="sr-only">StudyAI</span>
</div>
);
}