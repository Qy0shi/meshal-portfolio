"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const glassStyle: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(28px) saturate(180%) brightness(1.05)",
  WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.05)",
  border: "0.5px solid var(--glass-border)",
  borderRadius: 20,
};

export default function HomePage() {
  return (
    <section className="relative min-h-screen px-6 md:px-16 lg:px-24 py-20 flex items-center">
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between w-full max-w-6xl mx-auto gap-8 md:gap-12"
        style={{ zIndex: 10 }}
      >
        {/* Text content */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-[var(--text-hint)] text-sm tracking-[0.15em] uppercase mb-3"
          >
            Dhaka, Bangladesh
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Mohaiminul
            <br />
            Islam Meshal
          </h1>
          <p
            className="text-base md:text-lg text-[var(--text-secondary)] mt-4 max-w-md leading-relaxed"
          >
            Sales &amp; client experience professional. Skilled in B2C sales,
            CRM, and international coordination. Photography enthusiast.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/about">
              <motion.button
                type="button"
                className="cursor-pointer px-5 py-3 text-sm"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                style={glassStyle}
              >
                About
              </motion.button>
            </Link>
            <Link href="/gallery">
              <motion.button
                type="button"
                className="cursor-pointer px-5 py-3 text-sm"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                style={glassStyle}
              >
                Gallery
              </motion.button>
            </Link>
            <Link href="/career">
              <motion.button
                type="button"
                className="cursor-pointer px-5 py-3 text-sm"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                style={glassStyle}
              >
                Career
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                type="button"
                className="cursor-pointer px-5 py-3 text-sm"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                style={glassStyle}
              >
                Contact
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Profile card — stacks below on mobile, floats right on desktop */}
        <motion.div
          className="mx-auto md:mx-0 md:flex-shrink-0"
          style={{
            width: 200,
            marginTop: 32,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="flex items-center justify-center"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              ...glassStyle,
              width: 200,
              minHeight: 240,
              overflow: "hidden",
            }}
            whileHover={{
              boxShadow:
                "0 0 0 1px rgba(155,168,171,0.25), 0 8px 40px rgba(0,0,0,0.12), inset 0 0 20px rgba(155,168,171,0.05)",
            }}
          >
            <img
              src="/MIM.png"
              alt="Mohaiminul Islam Meshal"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
