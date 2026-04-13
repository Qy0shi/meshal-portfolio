"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, Send, MessageSquare, Loader2, MapPin,
  Linkedin, Instagram, Facebook,
} from "lucide-react";

const springBtn = { type: "spring" as const, stiffness: 350, damping: 22 };
const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
};

const socials = [
  { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/in/mohaiminul-islam-meshal" },
  { name: "Email", icon: Mail, url: "mailto:mohaiminulislammeshal@gmail.com" },
  { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/mohaiminulmeshal" },
  { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/qyoshi_/" },
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 16px",
  borderRadius: 16,
  background: "rgba(37,55,69,0.15)",
  border: "0.5px solid var(--glass-border)",
  color: "var(--text-primary)",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
};

function Card({ children, style, delay = 0 }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        boxShadow: "0 0 0 1px rgba(155,168,171,0.25), 0 8px 40px rgba(0,0,0,0.12), inset 0 0 20px rgba(155,168,171,0.05)",
      }}
      transition={{ duration: 0.5, delay: delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [subEmail, setSubEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [contactStatus, setContactStatus] = useState<"idle" | "success" | "error">("idle");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setContactStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setContactStatus("idle"), 4000);
      } else setContactStatus("error");
    } catch {
      setContactStatus("error");
    }
    setSending(false);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail }),
      });
      if (res.ok) {
        setSubEmail("");
        setSubscribeStatus("success");
        setTimeout(() => setSubscribeStatus("idle"), 4000);
      } else setSubscribeStatus("error");
    } catch {
      setSubscribeStatus("error");
    }
    setSubscribing(false);
  };

  return (
    <motion.section
      className="min-h-screen px-4 md:px-8 lg:px-16 py-20 md:py-28 max-w-5xl mx-auto"
      {...pageTransition}
    >
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Get in Touch
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Let&apos;s connect — whether it&apos;s work, collaborations, or just a hello.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Form */}
        <Card delay={0.1} style={glassStyle}>
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare size={18} style={{ color: "var(--accent-highlight)" }} />
            <h2 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>Send a Message</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[var(--text-hint)] mb-1.5 block">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={inputStyle}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-hint)] mb-1.5 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={inputStyle}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-hint)] mb-1.5 block">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                style={{ ...inputStyle, resize: "none" }}
                placeholder="What's on your mind?"
              />
            </div>
            <motion.button
              type="submit"
              disabled={sending}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={springBtn}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 16,
                background: "var(--btn-primary-bg)",
                color: "var(--btn-primary-text)",
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                cursor: sending ? "not-allowed" : "pointer",
                opacity: sending ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {sending ? "Sending..." : "Send Message"}
            </motion.button>

            {contactStatus === "success" && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm text-green-400">
                Message sent successfully!
              </motion.p>
            )}
            {contactStatus === "error" && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm text-red-400">
                Something went wrong. Please try again.
              </motion.p>
            )}
          </form>
        </Card>

        {/* Info + Socials + Subscribe */}
        <div className="space-y-6">
          <Card delay={0.2} style={glassStyle}>
            <div className="flex items-center gap-2 mb-4">
              <Mail size={18} style={{ color: "var(--accent-highlight)" }} />
              <h2 className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>Contact Info</h2>
            </div>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:mohaiminulislammeshal@gmail.com"
                className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Mail size={15} />
                <span>mohaiminulislammeshal@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <MapPin size={15} />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </Card>

          <Card delay={0.3} style={glassStyle}>
            <h3 className="text-sm font-medium mb-4" style={{ color: "var(--text-primary)" }}>Socials</h3>
            <div className="grid grid-cols-2 gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={springBtn}
                  className="flex items-center gap-2 text-xs"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 16,
                    background: "rgba(37,55,69,0.15)",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  <s.icon size={14} />
                  <span>{s.name}</span>
                </motion.a>
              ))}
            </div>
          </Card>

          <Card delay={0.4} style={glassStyle}>
            <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-primary)" }}>Subscribe</h3>
            <p className="text-[var(--text-hint)] text-xs mb-4">
              Get updates when new photos or projects are added.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                required
                placeholder="you@email.com"
                style={{ ...inputStyle, flex: 1 }}
              />
              <motion.button
                type="submit"
                disabled={subscribing}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={springBtn}
                style={{
                  padding: "10px 16px",
                  borderRadius: 16,
                  background: "var(--btn-primary-bg)",
                  color: "var(--btn-primary-text)",
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  cursor: subscribing ? "not-allowed" : "pointer",
                  opacity: subscribing ? 0.5 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {subscribing ? <Loader2 size={15} className="animate-spin" /> : "Join"}
              </motion.button>
            </form>
            {subscribeStatus === "success" && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-green-400 mt-3">
                You&apos;re subscribed.
              </motion.p>
            )}
            {subscribeStatus === "error" && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-3">
                Could not subscribe. Try again later.
              </motion.p>
            )}
          </Card>
        </div>
      </div>
    </motion.section>
  );
}
