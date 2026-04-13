"use client";

import { motion } from "framer-motion";
import { Sparkles, GraduationCap, MapPin } from "lucide-react";

const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
};

const bio =
  "Sales and client experience professional with B2C sales experience, CRM-driven pipeline management, and international client coordination. Outside of work, I explore the world through a lens.";

const skills = [
  "B2C Sales",
  "Lead Generation",
  "CRM & Pipeline Management",
  "Client Relationship Management",
  "Revenue Reporting",
  "Stakeholder Coordination",
  "HubSpot",
  "Freshsales",
  "Figma",
  "MS Excel",
  "Google Sheets",
  "Trello",
];

const education = [
  {
    degree: "B.Sc. in Computer Science",
    institution: "BRAC University",
    year: "December 2022",
  },
  {
    degree: "HSC — Science",
    institution: "Winsome College",
    year: "August 2016",
  },
];

const glassStyle: React.CSSProperties = {
  position: "relative",
  background: "var(--glass-bg)",
  backdropFilter: "blur(28px) saturate(180%) brightness(1.05)",
  WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.05)",
  border: "0.5px solid var(--glass-border)",
  borderRadius: 20,
  padding: "24px",
};

export default function AboutPage() {
  return (
    <motion.section
      className="min-h-screen px-4 md:px-8 lg:px-16 py-20 md:py-28 max-w-5xl mx-auto"
      {...pageTransition}
    >
      {/* Avatar + Bio */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ ...glassStyle, padding: "32px", marginBottom: 24 }}
      >
        <div className="flex items-center gap-6 mb-5">
          {/* Avatar circle */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              overflow: "hidden",
              border: "0.5px solid var(--glass-border)",
              flexShrink: 0,
            }}
          >
            <img
              src="/MIM.png"
              alt="Meshal"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
          <div>
            <h1
              className="text-2xl md:text-3xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Mohaiminul Islam Meshal
            </h1>
            <p
              className="text-sm mt-0.5"
              style={{ color: "var(--accent-highlight)" }}
            >
              Sales & Client Experience Professional
            </p>
          </div>
        </div>
        <p className="text-[var(--text-secondary)] leading-relaxed text-base md:text-lg">
          {bio}
        </p>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ ...glassStyle, padding: "32px", marginBottom: 24 }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} style={{ color: "var(--accent-highlight)" }} />
          <h3
            className="text-lg font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Skills
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.3 + i * 0.04,
                type: "spring",
                stiffness: 300,
                damping: 24,
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                background: "rgba(37,55,69,0.25)",
                border: "0.5px solid var(--glass-border)",
                fontSize: 13,
                color: "var(--text-primary)",
              }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ ...glassStyle, padding: "32px" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <GraduationCap
            size={18}
            style={{ color: "var(--accent-highlight)" }}
          />
          <h3
            className="text-lg font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Education
          </h3>
        </div>
        {education.map((edu, i) => (
          <motion.div
            key={`${edu.institution}-${edu.degree}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex items-start gap-4 py-4"
            style={{
              borderBottom:
                i < education.length - 1
                  ? "1px solid var(--glass-border)"
                  : "none",
            }}
          >
            <MapPin size={16} className="text-[var(--text-hint)] mt-1 flex-shrink-0" />
            <div>
              <p
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {edu.degree}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {edu.institution} &middot; {edu.year}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
