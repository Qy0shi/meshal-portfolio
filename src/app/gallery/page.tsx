"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

interface Photo { id: number; url: string; title: string; category: string; }

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setPhotos(d.photos || []))
      .catch(() => {});
  }, []);

  const categories = ["all", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];
  const filtered = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  return (
    <>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, display: "grid", gridTemplateColumns: "repeat(8, 1fr)" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} style={{ borderRight: "1px solid rgba(255,255,255,0.045)" }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", maxWidth: 900, margin: "0 auto", padding: "80px 48px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(232,228,220,0.3)", textDecoration: "none", marginBottom: 56, letterSpacing: "0.04em" }}>
          ← back
        </Link>

        <h1 style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1 }}>Shoot.</h1>
        <p style={{ fontSize: 15, color: "rgba(232,228,220,0.45)", marginBottom: 40, lineHeight: 1.7 }}>
          Capturing moments, one frame at a time.
        </p>

        {categories.length > 1 && (
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 32 }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} style={{ padding: "4px 14px", fontSize: 11, fontFamily: "'Courier Prime', monospace", border: "1px solid", borderColor: filter === cat ? "rgba(224,90,75,0.5)" : "rgba(255,255,255,0.1)", background: filter === cat ? "rgba(224,90,75,0.08)" : "transparent", color: filter === cat ? "#e05a4b" : "rgba(232,228,220,0.4)", borderRadius: 2, cursor: "none", textTransform: "capitalize" as const }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh", color: "rgba(232,228,220,0.3)", fontSize: 14 }}>
            No photos yet. Coming soon.
          </div>
        ) : (
          <div className="gallery-grid">
            {filtered.map((photo, i) => (
              <motion.img
                key={photo.id}
                src={photo.url}
                alt={photo.title || "photo"}
                className="gallery-grid-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setLightbox(photo)}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.95)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "rgba(232,228,220,0.5)", cursor: "none", padding: 8 }}>
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={lightbox.url} alt={lightbox.title || ""} width={900} height={600} style={{ maxWidth: "85vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 2, display: "block" }} />
              {lightbox.title && <p style={{ color: "rgba(232,228,220,0.4)", fontSize: 12, marginTop: 12, textAlign: "center" as const }}>{lightbox.title}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}