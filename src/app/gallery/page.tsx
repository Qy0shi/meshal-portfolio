"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface Photo { id: number; url: string; title: string; category: string; }

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setPhotos(d.photos || []))
      .catch(() => {});
  }, []);

  const filtered = filter === "all" ? photos : photos.filter((p) => p.category === filter);
  const categories = ["all", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];

  const openLightbox = (index: number) => { setLightboxIndex(index); setZoom(1); };
  const closeLightbox = () => { setLightboxIndex(null); setZoom(1); };

  const prev = useCallback(() => {
    if (lightboxIndex === null) return;
    setZoom(1);
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  const next = useCallback(() => {
    if (lightboxIndex === null) return;
    setZoom(1);
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, prev, next]);

  // Zoom on scroll
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(3, Math.max(0.5, z - e.deltaY * 0.002)));
  };

  const currentPhoto = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, display: "grid", gridTemplateColumns: "repeat(8, 1fr)" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", maxWidth: 860, margin: "0 auto", padding: "80px 64px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(232,228,220,0.3)", textDecoration: "none", marginBottom: 56, letterSpacing: "0.04em" }}>
          ← back
        </Link>

        <h1 style={{ fontSize: "clamp(52px, 8vw, 88px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1 }}>Shoot.</h1>
        <p style={{ fontSize: 19, color: "rgba(232,228,220,0.55)", marginBottom: 40, lineHeight: 1.7 }}>
          Capturing moments, one frame at a time.
        </p>

        {categories.length > 1 && (
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 32 }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)}
                className="pill-btn"
                style={{
                  padding: "6px 16px", fontSize: 12,
                  borderColor: filter === cat ? "rgba(224,90,75,0.5)" : undefined,
                  background: filter === cat ? "rgba(224,90,75,0.08)" : undefined,
                  color: filter === cat ? "#e05a4b" : undefined,
                  textTransform: "capitalize" as const,
                }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh", color: "rgba(232,228,220,0.3)", fontSize: 15 }}>
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
                onClick={() => openLightbox(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {currentPhoto && lightboxIndex !== null && (
          <motion.div
            style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.95)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Close */}
            <button onClick={closeLightbox}
              style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "rgba(232,228,220,0.5)", cursor: "none", padding: 8, zIndex: 10 }}>
              <X size={22} />
            </button>

            {/* Counter */}
            <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", fontSize: 12, color: "rgba(232,228,220,0.3)", letterSpacing: "0.1em" }}>
              {lightboxIndex + 1} / {filtered.length}
            </div>

            {/* Zoom controls */}
            <div style={{ position: "absolute", bottom: 24, right: 24, display: "flex", gap: 8, zIndex: 10 }}>
              <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(3, z + 0.25)); }}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "rgba(232,228,220,0.6)", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ZoomIn size={16} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(0.5, z - 0.25)); }}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "rgba(232,228,220,0.6)", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ZoomOut size={16} />
              </button>
            </div>

            {/* Prev */}
            <button onClick={(e) => { e.stopPropagation(); prev(); }}
              style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(232,228,220,0.7)", cursor: "none", zIndex: 10, transition: "background 0.2s" }}>
              <ChevronLeft size={20} />
            </button>

            {/* Next */}
            <button onClick={(e) => { e.stopPropagation(); next(); }}
              style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(232,228,220,0.7)", cursor: "none", zIndex: 10, transition: "background 0.2s" }}>
              <ChevronRight size={20} />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              onWheel={onWheel}
              style={{ overflow: "hidden", maxWidth: "80vw", maxHeight: "80vh" }}
            >
              <img
                src={currentPhoto.url}
                alt={currentPhoto.title || ""}
                style={{
                  maxWidth: "80vw",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  borderRadius: 2,
                  display: "block",
                  transform: `scale(${zoom})`,
                  transition: "transform 0.15s ease",
                  transformOrigin: "center center",
                }}
              />
              {currentPhoto.title && (
                <p style={{ color: "rgba(232,228,220,0.4)", fontSize: 12, marginTop: 14, textAlign: "center" as const, letterSpacing: "0.04em" }}>
                  {currentPhoto.title}
                </p>
              )}
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}