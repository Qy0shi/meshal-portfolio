"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const GREETINGS = ["hello.","bonjour.","hola.","ciao.","مرحبا.","salut.","hallo."];

interface Photo { id: number; url: string; title: string; category: string; }

function SkillTag({ label }: { label: string }) {
  return (
    <span style={{ fontSize: 12, padding: "5px 11px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(232,228,220,0.65)", background: "rgba(255,255,255,0.03)", fontFamily: "'Courier Prime', monospace", lineHeight: 1.4 }}>
      {label}
    </span>
  );
}

function LogEntry({ tag, year, desc }: { tag: string; year: string; desc: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, flexWrap: "wrap" as const }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#e05a4b", border: "1px solid rgba(224,90,75,0.4)", padding: "2px 9px" }}>{tag}</span>
        <span style={{ fontSize: 12, padding: "2px 9px", background: "rgba(255,255,255,0.08)", color: "rgba(232,228,220,0.5)" }}>{year}</span>
      </div>
      <div style={{ fontSize: 15, color: "rgba(232,228,220,0.65)", lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}

function DragonBg() {
  return (
    <div className="dragon-bg">
      <div className="dragon-animate">
        <img src="/dragon.jpg" alt="" aria-hidden="true" />
        <div className="dragon-eye" />
      </div>
    </div>
  );
}

function RelationshipAnim() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="13" cy="26" r="7" stroke="#e05a4b" strokeWidth="1.5" opacity="0.7">
        <animate attributeName="cx" values="13;21;13" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="39" cy="26" r="7" stroke="#e05a4b" strokeWidth="1.5" opacity="0.7">
        <animate attributeName="cx" values="39;31;39" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <line x1="20" y1="26" x2="32" y2="26" stroke="#e05a4b" strokeWidth="1.5">
        <animate attributeName="opacity" values="0;0.8;0" dur="2.2s" repeatCount="indefinite" begin="0.4s" />
      </line>
    </svg>
  );
}

function TargetAnim() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="26" cy="26" r="20" stroke="rgba(224,90,75,0.12)" strokeWidth="1.5" />
      <circle cx="26" cy="26" r="20" stroke="#e05a4b" strokeWidth="1.5" strokeDasharray="125.6" strokeLinecap="round" transform="rotate(-90 26 26)">
        <animate attributeName="stroke-dashoffset" values="125.6;10;125.6" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="26" cy="26" r="4" fill="#e05a4b">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function GlobeAnim() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="26" cy="26" r="18" stroke="rgba(224,90,75,0.2)" strokeWidth="1.5" />
      <ellipse cx="26" cy="26" rx="9" ry="18" stroke="rgba(224,90,75,0.3)" strokeWidth="1" />
      <line x1="8" y1="26" x2="44" y2="26" stroke="rgba(224,90,75,0.2)" strokeWidth="1" />
      <circle cx="26" cy="8" r="3" fill="#e05a4b" opacity="0.8">
        <animateTransform attributeName="transform" type="rotate" from="0 26 26" to="360 26 26" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function HomePage() {
  const [greetIndex, setGreetIndex] = useState(0);
  const [greetVisible, setGreetVisible] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetVisible(false);
      setTimeout(() => { setGreetIndex((i) => (i + 1) % GREETINGS.length); setGreetVisible(true); }, 350);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".morph").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setPhotos((d.photos || []).slice(0, 9)))
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

  const openLightbox = (i: number) => { setLightboxIndex(i); setZoom(1); setPan({ x: 0, y: 0 }); };
  const closeLightbox = () => { setLightboxIndex(null); setZoom(1); setPan({ x: 0, y: 0 }); };

  const prev = () => { if (lightboxIndex === null) return; setZoom(1); setPan({ x: 0, y: 0 }); setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length); };
  const next = () => { if (lightboxIndex === null) return; setZoom(1); setPan({ x: 0, y: 0 }); setLightboxIndex((lightboxIndex + 1) % photos.length); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

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

  const currentPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  const hardSkills = ["B2C Sales","Lead Gen","CRM Mgmt","HubSpot","Freshsales","Figma","MS Excel","Google Sheets","Trello","Rev. Reporting"];
  const softSkills = ["Negotiation","Communication","Problem Solving","Coordination","Curiosity"];
  const soFarItems = [
    { Anim: RelationshipAnim, label: "Relationship building", text: "Building relationships that convert — not just contacts, but long-term partners." },
    { Anim: TargetAnim, label: "Hitting sales targets", text: "Consistently hitting 90% of monthly targets through structured pipeline management." },
    { Anim: GlobeAnim, label: "Coordinating across borders", text: "Coordinating across US, BD and international clients with 97.5% accuracy." },
  ];

  return (
    <>
      {/* Dragon */}
      <DragonBg />

      {/* Say hi overlay */}
      {showMessage && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "#080808", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, maxWidth: 860, margin: "0 auto", width: "100%", padding: "120px 64px 40px", display: "flex", flexDirection: "column" }}>
            <textarea autoFocus value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e8e4dc", fontSize: 22, fontFamily: "'Courier Prime', monospace", resize: "none", lineHeight: 1.8, caretColor: "#e05a4b" }} />
          </div>
          <div style={{ maxWidth: 860, margin: "0 auto", width: "100%", padding: "20px 64px 48px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => { setShowMessage(false); setMessage(""); }} className="pill-btn">← go back</button>
            {message.trim() && (
              <a href={`mailto:mohaiminulislammeshal@gmail.com?subject=Hey Meshal!&body=${encodeURIComponent(message)}`} className="pill-btn" style={{ color: "#e05a4b", borderColor: "rgba(224,90,75,0.4)", background: "rgba(224,90,75,0.08)" }}>
                send →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Grid lines */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, display: "grid", gridTemplateColumns: "repeat(8, 1fr)" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }} />
        ))}
      </div>

      {/* Back to top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ position: "fixed", bottom: 36, right: 36, zIndex: 100, width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(224,90,75,0.3)", background: "rgba(224,90,75,0.07)", color: "#e05a4b", fontSize: 18, cursor: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          ↑
        </button>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HERO */}
        <div className="site-wrap">
          <section className="hero-section">
            <div className="hero-text" style={{ marginBottom: 40 }}>
              <span style={{ fontWeight: 400, opacity: greetVisible ? 1 : 0, transform: greetVisible ? "translateY(0)" : "translateY(-12px)", transition: "opacity 0.35s ease, transform 0.35s ease", whiteSpace: "nowrap" }}>
                {GREETINGS[greetIndex]}
              </span>
              <span style={{ fontWeight: 400 }}>i&apos;m</span>
              <span style={{ fontWeight: 400 }}>meshal.</span>
            </div>
            <p className="body-text" style={{ marginBottom: 52 }}>
              I&apos;m a sales &amp; client experience professional based in Dhaka.
              My passion is to build relationships, close deals, and capture the world through a lens.
            </p>
            <button onClick={() => setShowMessage(true)} className="pill-btn" style={{ gap: 10, display: "inline-flex", width: "fit-content" }}>
  → say hi
</button>
          </section>
        </div>

        {/* SO FAR */}
        <div className="site-wrap">
          <section className="page-section">
            <div className="morph">
              <h2 className="section-heading">So far.</h2>
              <p className="body-text" style={{ marginBottom: 56 }}>
                I&apos;ve spent the last couple of years building client relationships, hitting sales targets, and coordinating across borders.
              </p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 48 }}>
                {soFarItems.map(({ Anim, label, text }) => (
                  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 28 }}>
                    <Anim />
                    <div style={{ paddingTop: 4 }}>
                      <div className="red-label">{label}</div>
                      <p style={{ fontSize: 17, color: "rgba(232,228,220,0.55)", lineHeight: 1.75, maxWidth: 460 }}>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* PROFILE */}
        <div className="site-wrap">
          <section className="page-section">
            <div className="morph">
              <h2 className="section-heading">Profile.</h2>
              <div style={{ border: "1px solid rgba(255,255,255,0.09)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.025)" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.12em" }}>SUBJECT PROFILE</span>
                  <div style={{ fontSize: 11, color: "rgba(232,228,220,0.4)", textAlign: "right" as const, lineHeight: 1.6 }}>
                    <div>CASE FILE: MIM-01</div><div>STATUS: OPEN TO WORK</div>
                  </div>
                </div>
                <div className="profile-cols">
                  <div className="profile-col-left">
                    <div style={{ position: "relative" as const, width: "100%", aspectRatio: "3/4", marginBottom: 16 }}>
                      <Image src="/MIM.png" alt="Meshal" fill style={{ objectFit: "cover", borderRadius: 2, border: "1px solid rgba(255,255,255,0.1)" }} />
                      <div style={{ position: "absolute" as const, bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", padding: "5px 8px", display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(232,228,220,0.45)" }}>
                        <span>ID_FACE: 99.9%</span><span>● REC</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 16 }}>MOHAIMINUL ISLAM MESHAL</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 4 }}>
                      {([["CLASS:", "SALES_PRO"], ["XP:", "2+ YRS"], ["LANG_1:", "BN (Native)"], ["LANG_2:", "EN (Fluent)"]] as string[][]).map(([k, v]) => (
                        <div key={k}>
                          <span style={{ fontSize: 10, color: "rgba(232,228,220,0.3)", letterSpacing: "0.08em", display: "block", marginBottom: 3 }}>{k}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(232,228,220,0.75)" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, padding: 12, border: "1px solid rgba(224,90,75,0.35)", background: "rgba(224,90,75,0.08)", borderRadius: 2 }}>
                      <div style={{ fontSize: 10, letterSpacing: "0.1em", color: "#e05a4b", marginBottom: 5 }}>● SYSTEM_ALERT</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e8e4dc", marginBottom: 4 }}>OPEN TO WORK</div>
                      <div style={{ fontSize: 11, color: "rgba(232,228,220,0.4)", lineHeight: 1.6 }}>// CONTRACTS: ENABLED<br />[REMOTE_READY]</div>
                    </div>
                    <a href="/Mohaiminul_Islam_Meshal_Resume.pdf" download style={{ display: "block", marginTop: 12, padding: 9, border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" as const, fontSize: 12, color: "rgba(232,228,220,0.45)", textDecoration: "none" }}>
                      ↓ DOWNLOAD CV
                    </a>
                  </div>
                  <div className="profile-col-center">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                      <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(232,228,220,0.3)" }}>COMPETENCE_ANALYSIS_REPORT</span>
                      <span style={{ fontSize: 11, color: "rgba(224,90,75,0.6)" }}>[READ_ONLY]</span>
                    </div>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(232,228,220,0.65)", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      Sales professional obsessed with the fusion of{" "}
                      <span style={{ borderBottom: "1px solid rgba(224,90,75,0.5)", color: "#e8e4dc" }}>client relationships</span>{" "}
                      and{" "}
                      <span style={{ borderBottom: "1px solid rgba(224,90,75,0.5)", color: "#e8e4dc" }}>revenue growth.</span>{" "}
                      I don&apos;t just manage pipelines — I build systems that convert.
                    </p>
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(232,228,220,0.3)", marginBottom: 14 }}>// FIELD_OPERATIONS [EXPERIENCE]</div>
                      <LogEntry tag="[GOZAYAAN LIMITED]" year="2024–2025" desc="Executive — Sales & Tour. B2C sales, CRM pipeline, 90% target achievement." />
                      <LogEntry tag="[ROEBUCK COMMS]" year="2023–2024" desc="Intern — Client Service. 95% client satisfaction, campaign execution." />
                      <LogEntry tag="[RADIANT DATA SYS]" year="2023" desc="Associate — Vendor Coordinator. US clients, 97.5% documentation accuracy." />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(232,228,220,0.3)", marginBottom: 14 }}>// ACADEMIC_LOG [EDUCATION]</div>
                      <LogEntry tag="[BRAC UNIVERSITY]" year="2016–2022" desc="B.Sc. — Computer Science" />
                      <LogEntry tag="[WINSOME COLLEGE]" year="2014–2016" desc="HSC — Science" />
                    </div>
                  </div>
                  <div className="profile-col-right">
                    <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(232,228,220,0.3)", textAlign: "center" as const, marginBottom: 16 }}>EQUIPMENT_INVENTORY</div>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 10, letterSpacing: "0.1em", color: "#e05a4b", marginBottom: 10 }}>HARD SKILLS</div>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>{hardSkills.map((s) => <SkillTag key={s} label={s} />)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: "0.1em", color: "#e05a4b", marginBottom: 10 }}>SOFT SKILLS</div>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>{softSkills.map((s) => <SkillTag key={s} label={s} />)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* SHOOT */}
        <div className="site-wrap">
          <section className="page-section">
            <div className="morph">
              <h2 className="section-heading">Shoot.</h2>
              <p className="body-text" style={{ marginBottom: 36 }}>Photography is how I see the world. Street, travel, light.</p>
              <div className="thumb-grid" style={{ marginBottom: 28 }}>
                {photos.length > 0
                  ? photos.map((photo, i) => (
                      <div key={photo.id} className="thumb-item" onClick={() => openLightbox(i)}>
                        <img src={photo.url} alt={photo.title || "photo"} />
                      </div>
                    ))
                  : Array.from({ length: 9 }).map((_, i) => <div key={i} className="thumb-item" />)}
              </div>
              <Link href="/gallery" className="pill-btn" style={{ fontSize: 15 }}>→ view full gallery</Link>
            </div>
          </section>
        </div>

        {/* SAY HI */}
        <div className="site-wrap">
          <section className="page-section" id="contact">
            <div className="morph">
              <h2 className="section-heading">Say hi.</h2>
              <p className="body-text" style={{ marginBottom: 44 }}>Always happy to connect — whether it&apos;s work, photography, or just a conversation.</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
                {[
                  { label: "Email", href: "mailto:mohaiminulislammeshal@gmail.com" },
                  { label: "LinkedIn", href: "https://linkedin.com/in/mohaiminul-islam-meshal" },
                  { label: "Instagram", href: "#" },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="pill-btn">{label}</a>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="site-wrap">
          <footer className="footer-bar">
            <span>© 2025 Mohaiminul Islam Meshal</span>
            <span>Dhaka, Bangladesh</span>
          </footer>
        </div>

      </div>

      {/* Homepage lightbox */}
      <AnimatePresence>
        {currentPhoto && lightboxIndex !== null && (
          <motion.div
            style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.96)", display: "flex", alignItems: "center", justifyContent: "center" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "rgba(232,228,220,0.5)", cursor: "none", padding: 8, zIndex: 10 }}>
              <X size={22} />
            </button>
            <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", fontSize: 12, color: "rgba(232,228,220,0.3)", letterSpacing: "0.1em" }}>
              {lightboxIndex + 1} / {photos.length}
            </div>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(232,228,220,0.7)", cursor: "none", zIndex: 10 }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(232,228,220,0.7)", cursor: "none", zIndex: 10 }}>
              <ChevronRight size={20} />
            </button>
            {/* Bottom toolbar */}
            <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "rgba(232,228,220,0.6)", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ZoomOut size={16} />
              </button>
              <button onClick={() => setZoom((z) => Math.min(4, z + 0.25))} style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "rgba(232,228,220,0.6)", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ZoomIn size={16} />
              </button>
              <a href={currentPhoto.url} download target="_blank" rel="noopener noreferrer" style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "rgba(232,228,220,0.6)", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}