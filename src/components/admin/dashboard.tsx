"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Camera,
  Briefcase,
  Users,
  Settings as SettingsIcon,
  Bell,
  Plus,
  Trash2,
  Save,
  Loader2,
  Upload,
} from "lucide-react";
import { supabasePublic } from "@/lib/supabase-public";

interface CareerEntry {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  location: string;
  order: number;
}

interface Photo {
  id: number;
  url: string;
  title: string;
  category: string;
  storage_path: string | null;
}

interface DashboardProps {
  adminApiKey: string;
  sections: { id: string; label: string; icon: typeof Camera }[];
  activeSection: string;
  onSectionChange: (s: string) => void;
}

function adminHeaders(apiKey: string): HeadersInit {
  return { "x-api-key": apiKey };
}

export default function AdminDashboard({
  adminApiKey,
  sections,
  activeSection,
  onSectionChange,
}: DashboardProps) {
  const [careerEntries, setCareerEntries] = useState<CareerEntry[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [subscribers, setSubscribers] = useState<{ email: string }[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/career");
        const data = await res.json();
        setCareerEntries(data.entries || []);
      } catch {
        /* ignore */
      }
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        setPhotos(data.photos || []);
      } catch {
        /* ignore */
      }
      try {
        const res = await fetch("/api/admin/subscribers", {
          headers: adminHeaders(adminApiKey),
        });
        if (res.ok) {
          const data = await res.json();
          const list = (data.subscribers || []) as { email: string }[];
          setSubscribers(list.map((s) => ({ email: s.email })));
        }
      } catch {
        /* ignore */
      }
    }
    if (adminApiKey) load();
  }, [adminApiKey]);

  const showToast = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="min-h-screen px-4 md:px-8 lg:px-16 py-20 md:py-28 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">Admin</h1>
        {saved && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-green-400"
          >
            Saved!
          </motion.span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
              activeSection === id
                ? "bg-[var(--accent)] text-[var(--text-primary)]"
                : "text-[var(--text-hint)] hover:text-[var(--text-secondary)] border border-[var(--glass-border)]"
            }`}
          >
            <Icon size={13} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {activeSection === "photos" && (
        <AdminPhotos
          adminApiKey={adminApiKey}
          photos={photos}
          setPhotos={setPhotos}
          onSave={showToast}
        />
      )}

      {activeSection === "resume" && (
        <AdminResume adminApiKey={adminApiKey} onSave={showToast} />
      )}

      {activeSection === "career" && (
        <AdminCareer
          adminApiKey={adminApiKey}
          entries={careerEntries}
          setEntries={setCareerEntries}
          onSave={showToast}
        />
      )}

      {activeSection === "subscribers" && <AdminSubscribers subscribers={subscribers} />}

      {activeSection === "settings" && (
        <AdminSettings adminApiKey={adminApiKey} onSave={showToast} />
      )}

      {activeSection === "notify" && <AdminNotify adminApiKey={adminApiKey} />}
    </section>
  );
}

function AdminPhotos({
  adminApiKey,
  photos,
  setPhotos,
  onSave,
}: {
  adminApiKey: string;
  photos: Photo[];
  setPhotos: (p: Photo[]) => void;
  onSave: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    setFiles(picked);
    const urls = picked.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    setFiles(dropped);
    const urls = dropped.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(Math.round((i / files.length) * 100));

        const ext = file.name.split(".").pop();
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const path = `gallery/${filename}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabasePublic.storage
          .from("photos")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabasePublic.storage
          .from("photos")
          .getPublicUrl(path);

        const publicUrl = urlData.publicUrl;

        // Save metadata to DB
        const res = await fetch("/api/admin/photos", {
          method: "POST",
          headers: { ...adminHeaders(adminApiKey), "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title || file.name.replace(/\.[^.]+$/, ""),
            tag: tag || "uncategorized",
            storage_path: path,
            public_url: publicUrl,
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed");

        setPhotos([json.photo, ...photos]);
      }

      setProgress(100);
      setFiles([]);
      setPreviews([]);
      setTitle("");
      setTag("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onSave();
    } catch (err: any) {
      setError(err.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deletePhoto = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/photos?id=${id}`, {
        method: "DELETE",
        headers: adminHeaders(adminApiKey),
      });
      if (!res.ok) throw new Error("fail");
      setPhotos(photos.filter((p) => p.id !== id));
      onSave();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-5 md:p-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-5">
          Upload Photos
        </h3>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: "1.5px dashed rgba(155,168,171,0.30)",
            borderRadius: 16,
            padding: "40px 24px",
            textAlign: "center",
            cursor: "pointer",
            background: "var(--glass-bg)",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onDragEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor =
              "rgba(155,168,171,0.65)";
            (e.currentTarget as HTMLDivElement).style.background =
              "rgba(37,55,69,0.45)";
          }}
          onDragLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor =
              "rgba(155,168,171,0.30)";
            (e.currentTarget as HTMLDivElement).style.background =
              "var(--glass-bg)";
          }}
        >
          <p style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 500 }}>
            Drag photos here or click to pick from your device
          </p>
          <p style={{ color: "var(--text-hint)", fontSize: 12, marginTop: 6 }}>
            JPG, PNG, WEBP — multiple files supported
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilePick}
            style={{ display: "none" }}
          />
        </div>

        {/* Preview grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-full aspect-square object-cover rounded-lg border border-[var(--glass-border)]"
              />
            ))}
          </div>
        )}

        {/* Title input */}
        <input
          type="text"
          placeholder="Title (optional — uses filename if blank)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition mt-3 placeholder:text-[var(--text-hint)]"
        />

        {/* Tag input */}
        <input
          type="text"
          placeholder="Category tag e.g. Urban, Nature, Portrait"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition mt-2 placeholder:text-[var(--text-hint)]"
        />

        {/* Progress bar */}
        {uploading && (
          <div className="bg-[var(--glass-bg)]/40 rounded-full h-1 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent-highlight)] rounded-full"
              style={{
                width: `${progress}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mt-2">
            {error}
          </p>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className={`mt-3 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
            files.length > 0 && !uploading
              ? "bg-[var(--accent)] text-[var(--text-primary)] hover:opacity-90"
              : "bg-[var(--accent)]/30 text-[var(--text-hint)] cursor-not-allowed"
          }`}
        >
          {uploading
            ? `Uploading... ${progress}%`
            : files.length > 0
              ? `Upload ${files.length} photo${files.length > 1 ? "s" : ""}`
              : "Pick photos first"}
        </button>
      </GlassCard>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((p) => (
          <GlassCard key={p.id} className="p-3 relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.url}
              alt={p.title || ""}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {p.title || "Untitled"}
            </p>
            <p className="text-xs text-[var(--text-hint)]">{p.category}</p>
            <button
              type="button"
              onClick={() => deletePhoto(p.id)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-500/70"
            >
              <Trash2 size={13} />
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function AdminResume({ adminApiKey, onSave }: { adminApiKey: string; onSave: () => void }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/resume", {
        method: "POST",
        headers: adminHeaders(adminApiKey),
        body: fd,
      });
      if (!res.ok) throw new Error("fail");
      onSave();
    } catch {
      /* ignore */
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">Resume / CV</h3>
      <p className="text-[var(--text-hint)] text-xs mb-4">
        Upload your resume as PDF to storage path <code className="text-[var(--text-secondary)]">resume/resume.pdf</code>.
      </p>
      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--text-primary)] text-xs font-medium cursor-pointer hover:opacity-90 transition">
        <Upload size={13} />
        {uploading ? "Uploading..." : "Upload PDF"}
        <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" disabled={uploading} />
      </label>
    </GlassCard>
  );
}

function AdminCareer({
  adminApiKey,
  entries,
  setEntries,
  onSave,
}: {
  adminApiKey: string;
  entries: CareerEntry[];
  setEntries: (e: CareerEntry[]) => void;
  onSave: () => void;
}) {
  const [newEntry, setNewEntry] = useState({
    title: "",
    company: "",
    period: "",
    description: "",
    location: "",
    order: 0,
  });

  const addEntry = async () => {
    if (!newEntry.title || !newEntry.company) return;
    try {
      const res = await fetch("/api/admin/career", {
        method: "POST",
        headers: { ...adminHeaders(adminApiKey), "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEntry,
          order: entries.length + 1,
        }),
      });
      if (!res.ok) return;
      const { entry } = await res.json();
      setEntries([...entries, entry]);
      setNewEntry({
        title: "",
        company: "",
        period: "",
        description: "",
        location: "",
        order: 0,
      });
      onSave();
    } catch {
      /* ignore */
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/career?id=${id}`, {
        method: "DELETE",
        headers: adminHeaders(adminApiKey),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Failed to delete entry:", err);
        return;
      }
      setEntries(entries.filter((e) => e.id !== id));
      onSave();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-5 md:p-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-5">Add Entry</h3>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input
            value={newEntry.title}
            onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            placeholder="Title (e.g., Sales Manager)"
            className="px-3.5 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition placeholder:text-[var(--text-hint)]"
          />
          <input
            value={newEntry.company}
            onChange={(e) => setNewEntry({ ...newEntry, company: e.target.value })}
            placeholder="Company"
            className="px-3.5 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition placeholder:text-[var(--text-hint)]"
          />
          <input
            value={newEntry.period}
            onChange={(e) => setNewEntry({ ...newEntry, period: e.target.value })}
            placeholder="Period (e.g., 2022 - Present)"
            className="px-3.5 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition placeholder:text-[var(--text-hint)]"
          />
          <input
            value={newEntry.location}
            onChange={(e) => setNewEntry({ ...newEntry, location: e.target.value })}
            placeholder="Location"
            className="px-3.5 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition placeholder:text-[var(--text-hint)]"
          />
        </div>
        <textarea
          value={newEntry.description}
          onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
          placeholder="Description"
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition resize-none placeholder:text-[var(--text-hint)] mb-3"
        />
        <button
          type="button"
          onClick={addEntry}
          disabled={!newEntry.title || !newEntry.company}
          className="px-4 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--text-primary)] text-sm font-semibold disabled:opacity-50 cursor-pointer hover:opacity-90 transition flex items-center gap-1.5"
        >
          <Plus size={12} />
          Add Entry
        </button>
      </GlassCard>

      <div className="space-y-3">
        {entries.map((entry) => (
          <GlassCard key={entry.id} className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-[var(--text-primary)]">{entry.title}</h4>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {entry.company} &middot; {entry.location}
              </p>
              <p className="text-xs text-[var(--text-hint)] mt-0.5">{entry.period}</p>
            </div>
            <button
              type="button"
              onClick={() => deleteEntry(entry.id)}
              className="p-2 text-[var(--text-hint)] hover:text-red-400 transition shrink-0"
            >
              <Trash2 size={15} />
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function AdminSubscribers({ subscribers }: { subscribers: { email: string }[] }) {
  const [filter, setFilter] = useState("");
  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(filter.toLowerCase()));

  return (
    <GlassCard className="p-6">
      <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">Subscribers ({subscribers.length})</h3>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search email..."
        className="w-full px-3 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition placeholder:text-[var(--text-hint)] mb-4"
      />
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filtered.length === 0 && <p className="text-[var(--text-hint)] text-sm">No subscribers yet.</p>}
        {filtered.map((s, i) => (
          <div key={i} className="px-3 py-2 rounded-lg bg-[var(--glass-bg)]/40 text-sm text-[var(--text-secondary)]">
            {s.email}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function AdminSettings({ adminApiKey, onSave }: { adminApiKey: string; onSave: () => void }) {
  const [settings, setSettings] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/settings", { headers: adminHeaders(adminApiKey) });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.aboutJson || "");
      }
    }
    if (adminApiKey) load();
  }, [adminApiKey]);

  const saveSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { ...adminHeaders(adminApiKey), "Content-Type": "application/json" },
        body: JSON.stringify({ aboutJson: settings }),
      });
      if (res.ok) onSave();
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">Settings</h3>
      <label className="text-xs text-[var(--text-hint)] mb-1.5 block">About (JSON)</label>
      <textarea
        value={settings}
        onChange={(e) => setSettings(e.target.value)}
        rows={10}
        className="w-full px-3 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition font-mono placeholder:text-[var(--text-hint)] mb-3"
        placeholder='{"bio":"...","skills":[],"education":[]}'
      />
      <button
        type="button"
        onClick={saveSettings}
        disabled={loading}
        className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--text-primary)] text-xs font-medium disabled:opacity-50 cursor-pointer hover:opacity-90 transition flex items-center gap-1.5"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
        Save Settings
      </button>
    </GlassCard>
  );
}

function AdminNotify({ adminApiKey }: { adminApiKey: string }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");

  const sendNotification = async () => {
    setSending(true);
    setResult("");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...adminHeaders(adminApiKey),
        },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(`Sent to ${data.sent} subscribers!`);
      } else {
        setResult(data.error || "Failed");
      }
    } catch {
      setResult("Error sending notification.");
    }
    setSending(false);
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">Broadcast Email</h3>
      <p className="text-[var(--text-hint)] text-xs mb-4">Send an email to all subscribers via Resend.</p>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className="w-full px-3 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition placeholder:text-[var(--text-hint)] mb-3"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Email body (HTML)"
        rows={5}
        className="w-full px-3 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition resize-none placeholder:text-[var(--text-hint)] mb-3"
      />
      <button
        type="button"
        onClick={sendNotification}
        disabled={sending || !subject}
        className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--text-primary)] text-xs font-medium disabled:opacity-50 cursor-pointer hover:opacity-90 transition flex items-center gap-1.5"
      >
        {sending ? <Loader2 size={12} className="animate-spin" /> : <Bell size={12} />}
        Send to All Subscribers
      </button>
      {result && <p className="text-xs mt-3 text-[var(--text-secondary)]">{result}</p>}
    </GlassCard>
  );
}
