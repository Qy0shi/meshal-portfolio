"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Camera } from "lucide-react";

interface Photo {
  id: number;
  url: string;
  title: string;
  category: string;
  width?: number;
  height?: number;
}

const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
};

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function loadPhotos() {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        setPhotos(data.photos || []);
      } catch {}
    }
    loadPhotos();
  }, []);

  const categories = ["all", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];
  const filtered = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  // ISSUE 4 — Always render, never blank
  if (filtered.length === 0) {
    return (
      <motion.section
        className="min-h-screen px-4 md:px-8 lg:px-16 py-20 md:py-28"
        {...pageTransition}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 20,
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "rgba(37,55,69,0.40)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "0.5px solid rgba(155,168,171,0.15)",
              borderRadius: 28,
              padding: "48px 56px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Camera size={52} color="#4A5C6A" strokeWidth={1} />
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#9BA8AB",
                letterSpacing: "-0.5px",
              }}
            >
              Photos coming soon
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "rgba(204,208,207,0.40)",
                maxWidth: 260,
                lineHeight: 1.6,
              }}
            >
              New photography uploads are on the way. Subscribe below to be
              notified.
            </p>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="min-h-screen px-4 md:px-8 lg:px-16 py-20 md:py-28 max-w-7xl mx-auto"
      {...pageTransition}
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Gallery
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Capturing moments, one frame at a time
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilter(cat)}
            className={`capitalize px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
              filter === cat
                ? "bg-[#4A5C6A] text-[#CCD0CF]"
                : "border text-[var(--text-hint)] hover:text-[var(--text-secondary)]"
            }`}
            style={
              filter !== cat
                ? { borderColor: "var(--glass-border)" }
                : undefined
            }
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="masonry-grid">
        {filtered.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 24 }}
            className="relative group cursor-pointer overflow-hidden"
            style={{ borderRadius: 14 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setLightbox(photo)}
          >
            <div className="aspect-square overflow-hidden">
              <Image
                src={photo.url}
                alt={photo.title || "Gallery photo"}
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            {photo.title && (
              <div
                className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}
              >
                <p className="text-white text-sm">{photo.title}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.9)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.button
              className="absolute top-4 right-4 p-2 z-10 transition cursor-pointer"
              style={{ color: "white" }}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
              onClick={() => setLightbox(null)}
              type="button"
            >
              <X size={24} />
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightbox.url}
                alt={lightbox.title || ""}
                width={900}
                height={600}
                className="w-auto h-auto max-w-[85vw] md:max-w-[75vw] max-h-[80vh] md:max-h-[70vh] object-contain"
                style={{ borderRadius: 16 }}
              />
              {lightbox.title && (
                <p className="text-white/80 text-sm mt-3 text-center">{lightbox.title}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
