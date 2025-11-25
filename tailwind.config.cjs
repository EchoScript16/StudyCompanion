/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C5CE7",
        accent: "#00B894",
        panel: "rgba(255,255,255,0.04)"
      }
    }
  },
  plugins: [],
};
