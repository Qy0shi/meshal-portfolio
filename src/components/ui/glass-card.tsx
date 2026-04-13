"use client";

import { motion, type TargetAndTransition } from "framer-motion";
import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className = "", delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        boxShadow: "0 0 0 1px rgba(155,168,171,0.25), 0 8px 40px rgba(0,0,0,0.12), inset 0 0 20px rgba(155,168,171,0.05)",
      }}
      transition={{
        duration: 0.45,
        delay: 0.1 + delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      style={{
        position: "relative",
        background: "var(--glass-bg)",
        backdropFilter: "blur(28px) saturate(180%) brightness(1.05)",
        WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.05)",
        border: "0.5px solid var(--glass-border)",
        borderRadius: 20,
        boxShadow: "none",
        transition: "box-shadow 0.2s ease, background 0.2s ease",
      }}
    >
      {children}
    </motion.div>
  );
}
