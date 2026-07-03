"use client";

import { useState, useEffect } from "react";

interface ProfileEditorProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

interface ProfileData {
  name: string;
  titles: string[];
  phone: string;
  email: string;
  location: string;
  summary: string;
  links: {
    github: string;
    linkedin: string;
    tryhackme: string;
    legacyPortfolio: string;
  };
}

export function ProfileEditor({ showToast }: ProfileEditorProps) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/content/profile");
        const rows = await res.json();
        
        // Assemble profile mapping
        const profile: Partial<ProfileData> = {};
        const links: Record<string, string> = {};

        rows.forEach((row: { key: string; value: string }) => {
          const val = JSON.parse(row.value);
          if (row.key === "links") {
            Object.assign(links, val);
          } else {
            (profile as Record<string, unknown>)[row.key] = val;
          }
        });

        setData({
          name: profile.name || "",
          titles: profile.titles || [],
          phone: profile.phone || "",
          email: profile.email || "",
          location: profile.location || "",
          summary: profile.summary || "",
          links: {
            github: links.github || "",
            linkedin: links.linkedin || "",
            tryhackme: links.tryhackme || "",
            legacyPortfolio: links.legacyPortfolio || "",
          },
        });
      } catch {
        showToast("Failed to load profile data", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [showToast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);

    try {
      const keys = ["name", "titles", "phone", "email", "location", "summary", "links"] as const;
      await Promise.all(
        keys.map((key) =>
          fetch("/api/content/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              key,
              value: data[key],
            }),
          })
        )
      );
      showToast("Profile updated successfully");
    } catch {
      showToast("Failed to save profile details", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return <div className="font-mono text-sm text-text-muted">Reading database...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 bg-panel p-8 rounded-2xl border border-border shadow-md">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl">Identity / Profile Details</h2>
          <p className="text-xs text-text-secondary mt-1">Configure your public persona and credentials.</p>
        </div>
        <button type="submit" disabled={saving} className="btn-primary py-2 px-5 text-xs font-semibold">
          {saving ? "Saving..." : "Save Identity"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">FULL NAME</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full neu-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">LOCATION</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
            className="w-full neu-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">EMAIL ADDRESS</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full neu-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">PHONE NUMBER</label>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full neu-input text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">
          TAGLINES / TITLES (Comma Separated)
        </label>
        <input
          type="text"
          value={data.titles.join(", ")}
          onChange={(e) =>
            setData({
              ...data,
              titles: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
          className="w-full neu-input text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">BIO SUMMARY</label>
        <textarea
          rows={5}
          value={data.summary}
          onChange={(e) => setData({ ...data, summary: e.target.value })}
          className="w-full neu-input text-sm"
        />
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-[family-name:var(--font-display)] font-semibold mb-4 text-text-primary">
          External Connections
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">GITHUB URL</label>
            <input
              type="text"
              value={data.links.github}
              onChange={(e) => setData({ ...data, links: { ...data.links, github: e.target.value } })}
              className="w-full neu-input text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">LINKEDIN URL</label>
            <input
              type="text"
              value={data.links.linkedin}
              onChange={(e) => setData({ ...data, links: { ...data.links, linkedin: e.target.value } })}
              className="w-full neu-input text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">TRYHACKME PROFILE</label>
            <input
              type="text"
              value={data.links.tryhackme}
              onChange={(e) => setData({ ...data, links: { ...data.links, tryhackme: e.target.value } })}
              className="w-full neu-input text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">LEGACY PORTFOLIO</label>
            <input
              type="text"
              value={data.links.legacyPortfolio}
              onChange={(e) => setData({ ...data, links: { ...data.links, legacyPortfolio: e.target.value } })}
              className="w-full neu-input text-sm"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
