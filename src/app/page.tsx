"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const GREETINGS = ["hello.","bonjour.","হ্যালো.","hola.","ciao.","こんにちは.","مرحبا.","salut."];

interface Photo { id: number; url: string; title: string; category: string; }

function SkillTag({ label }: { label: string }) {
  return (
    <span style={{ fontSize: 9, padding: "3px 8px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(232,228,220,0.55)", background: "rgba(255,255,255,0.03)", fontFamily: "'Courier Prime', monospace" }}>
      {label}
    </span>
  );
}

function LogEntry({ tag, year, desc }: { tag: string; year: string; desc: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" as const }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#e05a4b", border: "1px solid rgba(224,90,75,0.4)", padding: "1px 6px" }}>{tag}</span>
        <span style={{ fontSize: 9, padding: "1px 6px", background: "rgba(255,255,255,0.08)", color: "rgba(232,228,220,0.5)" }}>{year}</span>
      </div>
      <div style={{ fontSize: 11, color: "rgba(232,228,220,0.65)", lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

function RelationshipAnim() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="14" cy="28" r="6" stroke="#e05a4b" strokeWidth="1.5" opacity="0.7">
        <animate attributeName="cx" values="14;22;14" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="42" cy="28" r="6" stroke="#e05a4b" strokeWidth="1.5" opacity="0.7">
        <animate attributeName="cx" values="42;34;42" dur="2s" repeatCount="indefinite" />
      </circle>
      <line x1="20" y1="28" x2="36" y2="28" stroke="#e05a4b" strokeWidth="1">
        <animate attributeName="opacity" values="0;0.7;0" dur="2s" repeatCount="indefinite" begin="0.4s" />
      </line>
    </svg>
  );
}

function TargetAnim() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="28" cy="28" r="20" stroke="rgba(224,90,75,0.15)" strokeWidth="1.5" />
      <circle cx="28" cy="28" r="20" stroke="#e05a4b" strokeWidth="1.5"
        strokeDasharray="125.6" strokeLinecap="round" transform="rotate(-90 28 28)">
        <animate attributeName="stroke-dashoffset" values="125.6;12;125.6" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="28" cy="28" r="4" fill="#e05a4b">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function GlobeAnim() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="28" cy="28" r="18" stroke="rgba(224,90,75,0.2)" strokeWidth="1.5" />
      <ellipse cx="28" cy="28" rx="9" ry="18" stroke="rgba(224,90,75,0.35)" strokeWidth="1" />
      <line x1="10" y1="28" x2="46" y2="28" stroke="rgba(224,90,75,0.25)" strokeWidth="1" />
      <circle cx="28" cy="10" r="3" fill="#e05a4b" opacity="0.85">
        <animateTransform attributeName="transform" type="rotate" from="0 28 28" to="360 28 28" dur="3s" repeatCount="indefinite" />
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

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetVisible(false);
      setTimeout(() => { setGreetIndex((i) => (i + 1) % GREETINGS.length); setGreetVisible(true); }, 380);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setPhotos((d.photos || []).slice(0, 9)))
      .catch(() => {});
  }, []);

  const hardSkills = ["B2C Sales","Lead Gen","CRM Mgmt","HubSpot","Freshsales","Figma","MS Excel","Google Sheets","Trello","Rev. Reporting"];
  const softSkills = ["Negotiation","Communication","Problem Solving","Coordination","Curiosity"];

  const soFarItems = [
    { Anim: RelationshipAnim, label: "Relationship building", text: "Building relationships that convert — not just contacts, but long-term partners." },
    { Anim: TargetAnim, label: "Hitting sales targets", text: "Consistently hitting 90% of monthly targets through structured pipeline management." },
    { Anim: GlobeAnim, label: "Coordinating across borders", text: "Coordinating across US, BD and international clients with 97.5% accuracy." },
  ];

  return (
    <>
      {/* Say hi fullscreen overlay */}
      {showMessage && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#080808", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, maxWidth: 900, margin: "0 auto", width: "100%", padding: "100px 48px 40px", display: "flex", flexDirection: "column" }}>
            <textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e8e4dc", fontSize: 22, fontFamily: "'Courier Prime', monospace", resize: "none", lineHeight: 1.7, caretColor: "#e05a4b" }}
            />
          </div>
          <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "20px 48px 40px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => { setShowMessage(false); setMessage(""); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", border: "1px solid rgba(232,228,220,0.15)", borderRadius: 100, fontSize: 14, color: "rgba(232,228,220,0.5)", background: "none", fontFamily: "'Courier Prime', monospace", cursor: "none" }}>
              ← go back
            </button>
            {message.trim() && (
              <a href={`mailto:mohaiminulislammeshal@gmail.com?subject=Hey Meshal!&body=${encodeURIComponent(message)}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", border: "1px solid rgba(224,90,75,0.4)", borderRadius: 100, fontSize: 14, color: "#e05a4b", background: "rgba(224,90,75,0.08)", textDecoration: "none", fontFamily: "'Courier Prime', monospace" }}>
                send →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Grid lines */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, display: "grid", gridTemplateColumns: "repeat(8, 1fr)" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} style={{ borderRight: "1px solid rgba(255,255,255,0.045)" }} />
        ))}
      </div>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ position: "fixed", bottom: 32, right: 32, zIndex: 100, width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(224,90,75,0.35)", background: "rgba(224,90,75,0.08)", color: "#e05a4b", fontSize: 18, cursor: "none", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.3s" }}
        >
          ↑
        </button>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ position: "fixed", top: 28, left: 0, right: 0, zIndex: 100, pointerEvents: "none" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 48px" }}>
            <a href="#" style={{ fontSize: 12, color: "rgba(232,228,220,0.3)", textDecoration: "none", letterSpacing: "0.04em", pointerEvents: "all" }}>
              meshal.pf
            </a>
          </div>
        </div>

        {/* HERO */}
        <div className="site-wrap">
          <section className="hero-section">
            <div style={{ fontSize: 88, fontWeight: 400, lineHeight: 1.0, marginBottom: 36, letterSpacing: "-0.01em" }}>
              <span style={{ display: "block", opacity: greetVisible ? 1 : 0, transform: greetVisible ? "translateY(0)" : "translateY(-10px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>
                {GREETINGS[greetIndex]}
              </span>
              <span style={{ display: "block" }}>i&apos;m</span>
              <span style={{ display: "block" }}>meshal.</span>
            </div>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(232,228,220,0.55)", maxWidth: 520, marginBottom: 48 }}>
              I&apos;m a sales &amp; client experience professional based in Dhaka.
              My passion is to build relationships, close deals, and capture the world through a lens.
            </p>
            <button
              onClick={() => setShowMessage(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", border: "1px solid rgba(232,228,220,0.2)", borderRadius: 100, fontSize: 14, color: "rgba(232,228,220,0.65)", background: "transparent", fontFamily: "'Courier Prime', monospace", cursor: "none", width: "fit-content" }}
            >
              → say hi
            </button>
          </section>
        </div>

        {/* SO FAR */}
        <div className="site-wrap">
          <section className="reveal page-section">
            <h2 style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24, lineHeight: 1 }}>So far.</h2>
            <p style={{ fontSize: 16, color: "rgba(232,228,220,0.5)", maxWidth: 540, lineHeight: 1.7, marginBottom: 52 }}>
              I&apos;ve spent the last couple of years building client relationships,
              hitting sales targets, and coordinating across borders. Here&apos;s a quick snapshot of the journey.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 36 }}>
              {soFarItems.map(({ Anim, label, text }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
                  <Anim />
                  <div style={{ paddingTop: 8 }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "#e05a4b", marginBottom: 8, textTransform: "uppercase" as const }}>{label}</div>
                    <p style={{ fontSize: 13, color: "rgba(232,228,220,0.5)", lineHeight: 1.7, maxWidth: 400 }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* PROFILE */}
        <div className="site-wrap">
          <section className="reveal page-section">
            <h2 style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 28, lineHeight: 1 }}>Profile.</h2>
            <div style={{ border: "1px solid rgba(255,255,255,0.09)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.025)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em" }}>SUBJECT PROFILE</span>
                <div style={{ fontSize: 10, color: "rgba(232,228,220,0.4)", textAlign: "right" as const, lineHeight: 1.6 }}>
                  <div>CASE FILE: MIM-01</div><div>STATUS: OPEN TO WORK</div>
                </div>
              </div>
              <div className="profile-cols">
                {/* LEFT */}
                <div className="profile-col-left">
                  <div style={{ position: "relative" as const, width: "100%", aspectRatio: "3/4", marginBottom: 14 }}>
                    <Image src="/MIM.png" alt="Meshal" fill style={{ objectFit: "cover", borderRadius: 2, border: "1px solid rgba(255,255,255,0.1)" }} />
                    <div style={{ position: "absolute" as const, bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", padding: "4px 6px", display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(232,228,220,0.45)" }}>
                      <span>ID_FACE: 99.9%</span><span>● REC</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 14 }}>MOHAIMINUL ISLAM MESHAL</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
                    {([["CLASS:", "SALES_PRO"], ["XP:", "2+ YRS"], ["LANG_1:", "BN (Native)"], ["LANG_2:", "EN (Fluent)"]] as string[][]).map(([k, v]) => (
                      <div key={k}>
                        <span style={{ fontSize: 9, color: "rgba(232,228,220,0.3)", letterSpacing: "0.08em", display: "block", marginBottom: 2 }}>{k}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,228,220,0.7)" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, padding: 10, border: "1px solid rgba(224,90,75,0.35)", background: "rgba(224,90,75,0.08)", borderRadius: 2 }}>
                    <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "#e05a4b", marginBottom: 4 }}>● SYSTEM_ALERT</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#e8e4dc", marginBottom: 3 }}>OPEN TO WORK</div>
                    <div style={{ fontSize: 9, color: "rgba(232,228,220,0.35)", lineHeight: 1.6 }}>// CONTRACTS: ENABLED<br />[REMOTE_READY]</div>
                  </div>
                  <a href="/Mohaiminul_Islam_Meshal_Resume.pdf" download style={{ display: "block", marginTop: 10, padding: 7, border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" as const, fontSize: 10, color: "rgba(232,228,220,0.4)", textDecoration: "none" }}>↓ DOWNLOAD CV</a>
                </div>
                {/* CENTER */}
                <div className="profile-col-center">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(232,228,220,0.3)" }}>COMPETENCE_ANALYSIS_REPORT</span>
                    <span style={{ fontSize: 9, color: "rgba(224,90,75,0.6)" }}>[READ_ONLY]</span>
                  </div>
                  <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(232,228,220,0.6)", marginBottom: 22, paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    Sales professional obsessed with the fusion of{" "}
                    <span style={{ borderBottom: "1px solid rgba(224,90,75,0.5)", color: "#e8e4dc" }}>client relationships</span>{" "}
                    and <span style={{ borderBottom: "1px solid rgba(224,90,75,0.5)", color: "#e8e4dc" }}>revenue growth.</span>{" "}
                    I don&apos;t just manage pipelines — I build systems that convert.
                  </p>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(232,228,220,0.3)", marginBottom: 12 }}>// FIELD_OPERATIONS [EXPERIENCE]</div>
                    <LogEntry tag="[GOZAYAAN LIMITED]" year="2024–2025" desc="Executive — Sales & Tour. B2C sales, CRM pipeline, 90% target achievement." />
                    <LogEntry tag="[ROEBUCK COMMS]" year="2023–2024" desc="Intern — Client Service. 95% client satisfaction, campaign execution." />
                    <LogEntry tag="[RADIANT DATA SYS]" year="2023" desc="Associate — Vendor Coordinator. US clients, 97.5% documentation accuracy." />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(232,228,220,0.3)", marginBottom: 12 }}>// ACADEMIC_LOG [EDUCATION]</div>
                    <LogEntry tag="[BRAC UNIVERSITY]" year="2018–2022" desc="B.Sc. — Computer Science" />
                    <LogEntry tag="[WINSOME COLLEGE]" year="2014–2016" desc="HSC — Science" />
                  </div>
                </div>
                {/* RIGHT */}
                <div className="profile-col-right">
                  <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(232,228,220,0.3)", textAlign: "center" as const, marginBottom: 14 }}>EQUIPMENT_INVENTORY</div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "#e05a4b", marginBottom: 8 }}>HARD SKILLS</div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5 }}>
                      {hardSkills.map((s) => <SkillTag key={s} label={s} />)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "#e05a4b", marginBottom: 8 }}>SOFT SKILLS</div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5 }}>
                      {softSkills.map((s) => <SkillTag key={s} label={s} />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* SHOOT */}
        <div className="site-wrap">
          <section className="reveal page-section">
            <h2 style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 18, lineHeight: 1 }}>Shoot.</h2>
            <p style={{ fontSize: 16, color: "rgba(232,228,220,0.5)", maxWidth: 520, lineHeight: 1.7, marginBottom: 32 }}>
              Photography is how I see the world. Street, travel, light.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 24 }}>
              {photos.length > 0
                ? photos.map((photo) => (
                    <div key={photo.id} style={{ height: 180, overflow: "hidden", borderRadius: 2, border: "1px solid rgba(255,255,255,0.07)" }}>
                      <img src={photo.url} alt={photo.title || "photo"} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease, filter 0.3s ease", display: "block" }}
                        onMouseEnter={(e) => { const el = e.currentTarget; el.style.transform = "scale(1.05)"; el.style.filter = "brightness(1.1)"; }}
                        onMouseLeave={(e) => { const el = e.currentTarget; el.style.transform = "scale(1)"; el.style.filter = "brightness(1)"; }}
                      />
                    </div>
                  ))
                : Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} style={{ height: 180, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 2 }} />
                  ))}
            </div>
            <Link href="/gallery" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(232,228,220,0.4)", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 2, textDecoration: "none" }}>
              → view full gallery
            </Link>
          </section>
        </div>

        {/* SAY HI */}
        <div className="site-wrap">
          <section id="contact" className="reveal page-section">
            <h2 style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 32, lineHeight: 1 }}>Say hi.</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
              {[
                { label: "Gmail", href: "mailto:mohaiminulislammeshal@gmail.com" },
                { label: "LinkedIn", href: "https://linkedin.com/in/mohaiminul-islam-meshal" },
                { label: "Instagram", href: "#" },
              ].map(({ label, href }) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", padding: "9px 20px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, fontSize: 13, color: "rgba(232,228,220,0.5)", textDecoration: "none", fontFamily: "'Courier Prime', monospace" }}>
                  {label}
                </a>
              ))}
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
    </>
  );
}