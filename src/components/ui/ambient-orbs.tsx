"use client";

import { motion } from "framer-motion";

export default function AmbientOrbs() {
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Orb 1: top-right */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], y: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "fixed", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,92,106,0.28), transparent 70%)",
          top: -150, right: -120, filter: "blur(80px)",
          pointerEvents: "none", zIndex: 0,
        }}
      />
      {/* Orb 2: bottom-left */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          position: "fixed", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,55,69,0.55), transparent 70%)",
          bottom: -100, left: -100, filter: "blur(70px)",
          pointerEvents: "none", zIndex: 0,
        }}
      />
      {/* Orb 3: center-right */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [10, -10, 10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "fixed", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(17,33,45,0.75), transparent 70%)",
          top: "45%", right: "22%", filter: "blur(55px)",
          pointerEvents: "none", zIndex: 0,
        }}
      />
    </div>
  );
}
