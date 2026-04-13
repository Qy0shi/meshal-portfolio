"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  Camera,
  FileText,
  Briefcase,
  Users,
  Settings as SettingsIcon,
  Bell,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import AdminDashboard from "@/components/admin/dashboard";

const sections = [
  { id: "photos", label: "Photos", icon: Camera },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "subscribers", label: "Subscribers", icon: Users },
  { id: "settings", label: "Settings", icon: SettingsIcon },
  { id: "notify", label: "Notify", icon: Bell },
];

const STORAGE_KEY = "meshal-admin-api-key";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminApiKey, setAdminApiKey] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [activeSection, setActiveSection] = useState("photos");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAdminApiKey(stored);
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: apiKeyInput }),
    });
    if (res.ok) {
      sessionStorage.setItem(STORAGE_KEY, apiKeyInput);
      setAdminApiKey(apiKeyInput);
      setAuthenticated(true);
    } else {
      setError("Invalid API key");
    }
  };

  if (!authenticated) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-8 w-full max-w-sm">
          <div className="flex justify-center mb-5">
            <Lock size={32} className="text-[var(--accent-highlight)]" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)] text-center mb-1">Admin Panel</h1>
          <p className="text-[var(--text-hint)] text-sm text-center mb-6">Enter your API key to continue</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value);
                setError("");
              }}
              placeholder="Enter admin password"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--c3)]/30 border border-[var(--glass-border)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)] transition placeholder:text-[var(--text-hint)]"
            />
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-[var(--c6)] text-sm font-medium hover:opacity-90 transition cursor-pointer"
            >
              Login
            </button>
          </form>
        </GlassCard>
      </section>
    );
  }

  return (
    <AdminDashboard
      adminApiKey={adminApiKey}
      sections={sections}
      onSectionChange={setActiveSection}
      activeSection={activeSection}
    />
  );
}
