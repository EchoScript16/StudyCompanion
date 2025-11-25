import React from "react";
import "../components/Loader.css";

export default function Loader() {
  return (
    <div className="loader-wrapper" aria-hidden>
      <div className="loader" />
    </div>
  );
}
