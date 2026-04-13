"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const GREETINGS = [
  "hello.",
  "bonjour.",
  "হ্যালো.",
  "hola.",
  "ciao.",
  "こんにちは.",
  "مرحبا.",
  "salut.",
];

interface Photo {
  id: number;
  url: string;
  title: string;
  category: string;
}

export default function HomePage() {
  const [greetIndex, setGreetIndex] = useState(0);
  const [greetVisible, setGreetVisible] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Greeting cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetVisible(false);
      setTimeout(() => {
        setGreetIndex((i) => (i + 1) % GREETINGS.length);
        setGreetVisible(true);
      }, 380);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Custom cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button")) {
        cursor.classList.add("link-hover");
        cursor.classList.remove("text-hover");
      } else if (t.closest("p, h1, h2, h3, span, li")) {
        cursor.classList.add("text-hover");
        cursor.classList.remove("link-hover");
      } else {
        cursor.classList.remove("link-hover", "text-hover");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Fetch gallery thumbnails
  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setPhotos((d.photos || []).slice(0, 9)))
      .catch(() => {});
  }, []);

  const skill = (label: string) => (
    <span
      key={label}
      style={{
        fontSize: 9,
        padding: "3px 8px",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(232,228,220,0.55)",
        background: "rgba(255,255,255,0.03)",
        fontFamily: "'Courier Prime', monospace",
      }}
    >
      {label}
    </span>
  );

  const entry = (tag: string, year: string, desc: string) => (
    <div key={tag} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#e05a4b", border: "1px solid rgba(224,90,75,0.4)", padding: "1px 6px" }}>
          {tag}
        </span>
        <span style={{ fontSize: 9, padding: "1px 6px", background: "rgba(255,255,255,0.08)", color: "rgba(232,228,220,0.5)" }}>
          {year}
        </span>
      </div>
      <div style={{ fontSize: 11, color: "rgba(232,228,220,0.65)", lineHeight: 1.5 }}>{desc}</div>
    </div>
  );

  return (
    <>
      {/* Custom cursor */}
      <div id="cursor" ref={cursorRef} />

      {/* Grid lines */}
      <div
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          display: "grid", gridTemplateColumns: "repeat(8, 1fr)",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} style={{ borderRight: "1px solid rgba(255,255,255,0.045)" }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ position: "fixed", top: 24, left: 40, zIndex: 100 }}>
          <a href="#" style={{ fontSize: 12, color: "rgba(232,228,220,0.35)", textDecoration: "none", letterSpacing: "0.04em" }}>
            meshal.pf
          </a>
        </div>

        {/* ── HERO ── */}
        <section className="hero-section">
          <div
            className="greeting-text"
            style={{ fontSize: 68, fontWeight: 400, lineHeight: 1.05, marginBottom: 32 }}
          >
            <span
              style={{
                display: "block",
                opacity: greetVisible ? 1 : 0,
                transform: greetVisible ? "translateY(0)" : "translateY(-8px)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}
            >
              {GREETINGS[greetIndex]}
            </span>
            <span style={{ display: "block" }}>i'm</span>
            <span style={{ display: "block" }}>meshal.</span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(232,228,220,0.6)", maxWidth: 520, marginBottom: 40 }}>
            I'm a sales & client experience professional based in Dhaka.
            <br />
            My passion is to build relationships, close deals, and capture
            <br />
            the world through a lens.
          </p>
          
            href="#contact"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 24px",
              border: "1px solid rgba(232,228,220,0.25)",
              borderRadius: 100,
              fontSize: 13, color: "rgba(232,228,220,0.7)",
              textDecoration: "none", width: "fit-content",
            }}
          >
            → say hi
          </a>
        </section>

        {/* ── SO FAR ── */}
        <section className="reveal page-section">
          <h2 className="section-heading" style={{ fontSize: 62, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 18, lineHeight: 1 }}>
            So far.
          </h2>
          <p style={{ fontSize: 14, color: "rgba(232,228,220,0.55)", maxWidth: 560, lineHeight: 1.7 }}>
            I've spent the last couple of years building client relationships,
            hitting sales targets, and coordinating across borders. Here's a
            quick snapshot of the journey.
          </p>
        </section>

        {/* ── PROFILE ── */}
        <section className="reveal page-section">
          <h2 className="section-heading" style={{ fontSize: 62, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 28, lineHeight: 1 }}>
            Profile.
          </h2>

          <div style={{ border: "1px solid rgba(255,255,255,0.09)", borderRadius: 4, overflow: "hidden", maxWidth: 960 }}>

            {/* Header bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.025)" }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em" }}>SUBJECT PROFILE</span>
              <div style={{ fontSize: 10, color: "rgba(232,228,220,0.4)", textAlign: "right", lineHeight: 1.6 }}>
                <div>CASE FILE: MIM-01</div>
                <div>STATUS: OPEN TO WORK</div>
              </div>
            </div>

            <div className="profile-cols">

              {/* LEFT COL */}
              <div className="profile-col-left">
                <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", marginBottom: 14 }}>
                  <Image
                    src="/MIM.png"
                    alt="Meshal"
                    fill
                    style={{ objectFit: "cover", borderRadius: 2, border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", padding: "4px 6px", display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(232,228,220,0.45)" }}>
                    <span>ID_FACE: 99.9%</span>
                    <span>● REC</span>
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 14 }}>
                  MOHAIMINUL ISLAM MESHAL
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
                  {[["CLASS:", "SALES_PRO"], ["XP:", "2+ YRS"], ["LANG_1:", "BN (Native)"], ["LANG_2:", "EN (Fluent)"]].map(([k, v]) => (
                    <div key={k}>
                      <span style={{ fontSize: 9, color: "rgba(232,228,220,0.3)", letterSpacing: "0.08em", display: "block", marginBottom: 2 }}>{k}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,228,220,0.7)" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, padding: 10, border: "1px solid rgba(224,90,75,0.35)", background: "rgba(224,90,75,0.08)", borderRadius: 2 }}>
                  <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "#e05a4b", marginBottom: 4 }}>● SYSTEM_ALERT</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#e8e4dc", marginBottom: 3 }}>OPEN TO WORK</div>
                  <div style={{ fontSize: 9, color: "rgba(232,228,220,0.35)", lineHeight: 1.6 }}>
                    // CONTRACTS: ENABLED<br />[REMOTE_READY]
                  </div>
                </div>
                
                  href="/Mohaiminul_Islam_Meshal_Resume.pdf"
                  download
                  style={{ display: "block", marginTop: 10, padding: 7, border: "1px solid rgba(255,255,255,0.1)", textAlign: "center", fontSize: 10, color: "rgba(232,228,220,0.4)", textDecoration: "none" }}
                >
                  ↓ DOWNLOAD CV
                </a>
              </div>

              {/* CENTER COL */}
              <div className="profile-col-center">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(232,228,220,0.3)" }}>COMPETENCE_ANALYSIS_REPORT</span>
                  <span style={{ fontSize: 9, color: "rgba(224,90,75,0.6)" }}>[READ_ONLY]</span>
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(232,228,220,0.6)", marginBottom: 22, paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  Sales professional obsessed with the fusion of{" "}
                  <span style={{ borderBottom: "1px solid rgba(224,90,75,0.5)", color: "#e8e4dc" }}>client relationships</span>{" "}
                  and{" "}
                  <span style={{ borderBottom: "1px solid rgba(224,90,75,0.5)", color: "#e8e4dc" }}>revenue growth.</span>{" "}
                  I don't just manage pipelines — I build systems that convert. Outside the office, I explore the world through a lens.
                </p>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(232,228,220,0.3)", marginBottom: 12 }}>
                    // FIELD_OPERATIONS [EXPERIENCE]
                  </div>
                  {entry("[GOZAYAAN LIMITED]", "2024–2025", "Executive — Sales & Tour. B2C sales, CRM pipeline, 90% target achievement.")}
                  {entry("[ROEBUCK COMMS]", "2023–2024", "Intern — Client Service. 95% client satisfaction, campaign execution.")}
                  {entry("[RADIANT DATA SYS]", "2023", "Associate — Vendor Coordinator. US clients, 97.5% documentation accuracy.")}
                </div>

                <div>
                  <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(232,228,220,0.3)", marginBottom: 12 }}>
                    // ACADEMIC_LOG [EDUCATION]
                  </div>
                  {entry("[BRAC UNIVERSITY]", "2018–2022", "B.Sc. — Computer Science")}
                  {entry("[WINSOME COLLEGE]", "2014–2016", "HSC — Science")}
                </div>
              </div>

              {/* RIGHT COL */}
              <div className="profile-col-right">
                <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(232,228,220,0.3)", textAlign: "center", marginBottom: 14 }}>
                  EQUIPMENT_INVENTORY
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "#e05a4b", marginBottom: 8 }}>HARD SKILLS</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {["B2C Sales", "Lead Gen", "CRM Mgmt", "HubSpot", "Freshsales", "Figma", "MS Excel", "Google Sheets", "Trello", "Rev. Reporting"].map(skill)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "#e05a4b", marginBottom: 8 }}>SOFT SKILLS</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {["Negotiation", "Communication", "Problem Solving", "Coordination", "Curiosity"].map(skill)}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── SHOOT ── */}
        <section className="reveal page-section">
          <h2 className="section-heading" style={{ fontSize: 62, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 18, lineHeight: 1 }}>
            Shoot.
          </h2>
          <p style={{ fontSize: 14, color: "rgba(232,228,220,0.55)", maxWidth: 560, lineHeight: 1.7, marginBottom: 28 }}>
            Photography is how I see the world. Street, travel, light. A few frames from the archive.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, maxWidth: 680, marginBottom: 20 }}>
            {photos.length > 0
              ? photos.map((photo) => (
                  <div key={photo.id} style={{ aspectRatio: "1", overflow: "hidden", borderRadius: 2, border: "1px solid rgba(255,255,255,0.07)" }}>
                    <img
                      src={photo.url}
                      alt={photo.title || "photo"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease, filter 0.3s ease", display: "block" }}
                      onMouseEnter={(e) => { const el = e.currentTarget; el.style.transform = "scale(1.04)"; el.style.filter = "brightness(1.1)"; }}
                      onMouseLeave={(e) => { const el = e.currentTarget; el.style.transform = "scale(1)"; el.style.filter = "brightness(1)"; }}
                    />
                  </div>
                ))
              : Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} style={{ aspectRatio: "1", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 2 }} />
                ))}
          </div>
          <Link
            href="/gallery"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(232,228,220,0.5)", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 2, textDecoration: "none" }}
          >
            → view full gallery
          </Link>
        </section>

        {/* ── SAY HI ── */}
        <section id="contact" className="reveal page-section">
          <h2 className="section-heading" style={{ fontSize: 62, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 28, lineHeight: 1 }}>
            Say hi.
          </h2>
          
            href="mailto:mohaiminulislammeshal@gmail.com"
            style={{ fontSize: 24, fontWeight: 700, color: "#e8e4dc", marginBottom: 24, display: "block", textDecoration: "none", letterSpacing: "-0.01em", lineHeight: 1.4 }}
          >
            mohaiminulislammeshal<br />@gmail.com
          </a>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <a href="https://linkedin.com/in/mohaiminul-islam-meshal" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "rgba(232,228,220,0.45)", borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: 2, textDecoration: "none" }}>
              LinkedIn
            </a>
            <a href="#" style={{ fontSize: 12, color: "rgba(232,228,220,0.45)", borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: 2, textDecoration: "none" }}>
              Instagram
            </a>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer-bar">
          <span>© 2025 Mohaiminul Islam Meshal</span>
          <span>Dhaka, Bangladesh</span>
        </footer>

      </div>
    </>
  );
}