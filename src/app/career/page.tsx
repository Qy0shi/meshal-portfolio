"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Download, Calendar } from "lucide-react";

const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
};

const experiences = [
  {
    title: "Executive — Sales & Tour",
    company: "Gozayaan Limited",
    location: "Gulshan-1, Dhaka",
    period: "April 2024 — October 2025",
    description:
      "B2C sales role achieving 90% of monthly targets. Team lead. Delivered presentations of travel technology to corporate and international clients. Managed CRM pipeline and revenue forecasting.",
  },
  {
    title: "Intern — Client Service",
    company: "Roebuck Communications",
    location: "Gulshan-1, Dhaka",
    period: "October 2023 — January 2024",
    description:
      "Market research and competitor analysis. Campaign execution support. Maintained 95% client satisfaction through proactive engagement.",
  },
  {
    title: "Associate — Vendor Coordinator",
    company: "Radiant Data Systems Ltd",
    location: "Kawran Bazar, Dhaka",
    period: "June 2023 — October 2023",
    description:
      "Liaison between US-based clients and internal stakeholders. 90% on-time delivery, 97.5% documentation accuracy.",
  },
];

const education = [
  {
    degree: "B.Sc. in Computer Science",
    institution: "BRAC University",
    location: "Mohakhali, Dhaka",
    period: "December 2022",
  },
  {
    degree: "HSC — Science",
    institution: "Winsome College",
    location: "Dhaka",
    period: "August 2016",
  },
];

const glassCard = (extra = "") =>
  `relative bg-[var(--glass-bg)] backdrop-blur-[28px] backdrop-saturate-[180%] backdrop-brightness-[1.05] border border-[var(--glass-border)] rounded-[20px] p-6 ${extra}`;

function ExpCard({
  item,
  i,
}: {
  item: (typeof experiences)[number];
  i: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={glassCard()}
      whileHover={{
        boxShadow:
          "0 0 0 1px rgba(155,168,171,0.25), 0 8px 40px rgba(0,0,0,0.12), inset 0 0 20px rgba(155,168,171,0.05)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Briefcase size={14} style={{ color: "var(--accent-highlight)" }} />
        <h3 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
          {item.title}
        </h3>
      </div>
      <p className="text-[var(--text-secondary)] text-sm mb-0.5">
        {item.company} &middot; {item.location}
      </p>
      <div className="flex items-center gap-1.5 text-[var(--text-hint)] text-xs mb-3">
        <Calendar size={12} />
        <span>{item.period}</span>
      </div>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{item.description}</p>
    </motion.div>
  );
}

function EduCard({
  item,
  i,
}: {
  item: (typeof education)[number];
  i: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={glassCard()}
      whileHover={{
        boxShadow:
          "0 0 0 1px rgba(155,168,171,0.25), 0 8px 40px rgba(0,0,0,0.12)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap size={14} style={{ color: "var(--accent-highlight)" }} />
        <h3 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
          {item.degree}
        </h3>
      </div>
      <p className="text-[var(--text-secondary)] text-sm mb-0.5">
        {item.institution} &middot; {item.location}
      </p>
      <p className="text-[var(--text-hint)] text-xs">{item.period}</p>
    </motion.div>
  );
}

export default function CareerPage() {
  const handleDownloadCV = async () => {
    try {
      const res = await fetch("/api/resume");
      const { url } = await res.json();
      if (url) window.open(url, "_blank");
    } catch {}
  };

  return (
    <motion.section
      className="min-h-screen px-4 md:px-8 lg:px-16 py-20 md:py-28 max-w-5xl mx-auto"
      {...pageTransition}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)]">
            Career &amp; Experience
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">Professional journey</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleDownloadCV}
          className="flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(28px) saturate(180%) brightness(1.05)",
            WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.05)",
            border: "0.5px solid var(--glass-border)",
            borderRadius: 20,
            color: "var(--text-primary)",
          }}
        >
          <Download size={15} />
          Download CV
        </motion.button>
      </div>

      {/* Experience Section */}
      <div className="mb-14">
        <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
          Experience
        </h2>
        <div className="space-y-5">
          {experiences.map((item, i) => (
            <ExpCard key={i} item={item} i={i} />
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div>
        <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
          Education
        </h2>
        <div className="space-y-5">
          {education.map((item, i) => (
            <EduCard key={i} item={item} i={i} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
