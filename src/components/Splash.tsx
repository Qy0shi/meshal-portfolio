"use client";
import { useEffect, useState } from "react";

const FULL_NAME = "awakening.";

export default function Splash() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const type = () => {
      if (i <= FULL_NAME.length) {
        setTyped(FULL_NAME.slice(0, i));
        i++;
        setTimeout(type, i < 3 ? 120 : 65);
      } else {
        setTimeout(() => setFading(true), 600);
        setTimeout(() => setVisible(false), 1300);
      }
    };
    const t = setTimeout(type, 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "#080808",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 28,
      opacity: fading ? 0 : 1,
      transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1)",
      pointerEvents: fading ? "none" : "all",
    }}>
      {/* top red line */}
      <div style={{
        width: fading ? "0%" : typed.length > 0 ? "260px" : "0px",
        height: "1px",
        background: "linear-gradient(90deg, transparent, #e05a4b, transparent)",
        transition: "width 0.6s ease",
        opacity: 0.7,
      }} />

      {/* text */}
      <div style={{
        fontFamily: "'Courier Prime', monospace",
        fontSize: "clamp(18px, 4vw, 32px)",
        fontWeight: 400,
        color: "#e8e4dc",
        letterSpacing: "0.04em",
        minHeight: "44px",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}>
        <span>{typed}</span>
        <span style={{
          display: "inline-block",
          width: "2px",
          height: "1.1em",
          background: "#e05a4b",
          verticalAlign: "middle",
          opacity: showCursor ? 1 : 0,
          transition: "opacity 0.1s",
        }} />
      </div>

      {/* bottom red line */}
      <div style={{
        width: fading ? "0%" : typed.length > 0 ? "260px" : "0px",
        height: "1px",
        background: "linear-gradient(90deg, transparent, #e05a4b, transparent)",
        transition: "width 0.6s ease",
        opacity: 0.7,
      }} />
    </div>
  );
}