"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react";

interface Photo { id: number; url: string; title: string; category: string; }

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setPhotos(d.photos || []))
      .catch(() => {});
  }, []);

  // Lock scroll when lightbox open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [lightboxIndex]);

  const filtered = filter === "all" ? photos : photos.filter((p) => p.category === filter);
  const categories = ["all", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];

  const openLightbox = (i: number) => { setLightboxIndex(i); setZoom(1); setPan({ x: 0, y: 0 }); };
  const closeLightbox = () => { setLightboxIndex(null); setZoom(1); setPan({ x: 0, y: 0 }); };

  const prev = useCallback(() => {
    if (lightboxIndex === null) return;
    setZoom(1); setPan({ x: 0, y: 0 });
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  const next = useCallback(() => {
    if (lightboxIndex === null) return;
    setZoom(1); setPan({ x: 0, y: 0 });
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  }, [lightboxIndex, filtered.length]);

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

  const onWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    setZoom((z) => Math.min(4, Math.max(0.5, z - e.deltaY * 0.002)));
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUp = () => setDragging(false);

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
        <h1 style={{ fontSize: "clamp(48px, 7.5vw, 82px)", fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1 }}>Shoot.</h1>
        <p style={{ fontSize: 18, color: "rgba(232,228,220,0.55)", marginBottom: 40, lineHeight: 1.7 }}>Capturing moments, one frame at a time.</p>

        {categories.length > 1 && (
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 32 }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} className="pill-btn"
                style={{ padding: "6px 16px", fontSize: 12, textTransform: "capitalize" as const, borderColor: filter === cat ? "rgba(224,90,75,0.5)" : undefined, background: filter === cat ? "rgba(224,90,75,0.08)" : undefined, color: filter === cat ? "#e05a4b" : undefined }}>
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
              <motion.img key={photo.id} src={photo.url} alt={photo.title || "photo"} className="gallery-grid-item"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                onClick={() => openLightbox(i)} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {currentPhoto && lightboxIndex !== null && (
          <motion.div
            style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.96)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "rgba(232,228,220,0.5)", cursor: "none", padding: 8, zIndex: 10 }}>
              <X size={22} />
            </button>
            <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", fontSize: 12, color: "rgba(232,228,220,0.3)", letterSpacing: "0.1em" }}>
              {lightboxIndex + 1} / {filtered.length}
            </div>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(232,228,220,0.7)", cursor: "none", zIndex: 10 }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(232,228,220,0.7)", cursor: "none", zIndex: 10 }}>
              <ChevronRight size={20} />
            </button>

            {/* Bottom center toolbar */}
            <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(8,8,8,0.8)", color: "rgba(232,228,220,0.6)", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ZoomOut size={16} />
              </button>
              <button onClick={() => setZoom((z) => Math.min(4, z + 0.25))} style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(8,8,8,0.8)", color: "rgba(232,228,220,0.6)", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ZoomIn size={16} />
              </button>
              <a href={currentPhoto.url} download target="_blank" rel="noopener noreferrer" style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(8,8,8,0.8)", color: "rgba(232,228,220,0.6)", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                <Download size={16} />
              </a>
            </div>

            <motion.div
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              onWheel={onWheel}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              style={{ overflow: "hidden", maxWidth: "80vw", maxHeight: "80vh", cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "none" }}
            >
              <img
                src={currentPhoto.url}
                alt={currentPhoto.title || ""}
                style={{ maxWidth: "80vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 2, display: "block", transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transition: dragging ? "none" : "transform 0.15s ease", transformOrigin: "center center", userSelect: "none" }}
                draggable={false}
              />
              {currentPhoto.title && (
                <p style={{ color: "rgba(232,228,220,0.4)", fontSize: 12, marginTop: 14, textAlign: "center" as const }}>{currentPhoto.title}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}