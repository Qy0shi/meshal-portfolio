"use client";
import { useEffect, useState } from "react";

export default function Splash() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1800);
    const t2 = setTimeout(() => setVisible(false), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "#080808",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 24,
      opacity: fading ? 0 : 1,
      transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1)",
      pointerEvents: fading ? "none" : "all",
    }}>
      <div style={{
        width: 180, height: "1px",
        background: "linear-gradient(90deg, transparent, #e05a4b, transparent)",
        opacity: fading ? 0 : 0.6,
        transition: "opacity 0.5s ease",
      }} />
      <div style={{
        fontFamily: "'Courier Prime', monospace",
        fontSize: 28,
        fontWeight: 400,
        color: "#e8e4dc",
        letterSpacing: "0.08em",
        opacity: fading ? 0 : 1,
        transform: fading ? "scale(0.97)" : "scale(1)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>
        awakening.
      </div>
      <div style={{
        width: 180, height: "1px",
        background: "linear-gradient(90deg, transparent, #e05a4b, transparent)",
        opacity: fading ? 0 : 0.6,
        transition: "opacity 0.5s ease",
      }} />
    </div>
  );
}