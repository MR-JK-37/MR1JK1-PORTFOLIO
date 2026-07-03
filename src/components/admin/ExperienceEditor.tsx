"use client";

import { useState, useEffect } from "react";

interface ExperienceEditorProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

interface ExperienceEntry {
  role: string;
  org: string;
  dates: string;
  bullets: string[];
}

export function ExperienceEditor({ showToast }: ExperienceEditorProps) {
  const [entries, setEntries] = useState<ExperienceEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/content/experience");
        const rows = await res.json();
        if (rows.length > 0) {
          setEntries(JSON.parse(rows[0].value));
        } else {
          setEntries([]);
        }
      } catch {
        showToast("Failed to load experience entries", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [showToast]);

  const handleSave = async (updatedEntries = entries) => {
    if (!updatedEntries) return;
    setSaving(true);

    try {
      const res = await fetch("/api/content/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "all",
          value: updatedEntries,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Experience timeline saved successfully");
    } catch {
      showToast("Failed to save experience details", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddEntry = () => {
    if (!entries) return;
    const newList = [
      ...entries,
      {
        role: "Security Analyst",
        org: "Independent Practice",
        dates: "2025 - Present",
        bullets: ["Participated in vulnerability disclosure programs.", "Conducted static code analysis."],
      },
    ];
    setEntries(newList);
    handleSave(newList);
  };

  const handleRemoveEntry = (index: number) => {
    if (!entries) return;
    const newList = entries.filter((_, i) => i !== index);
    setEntries(newList);
    handleSave(newList);
  };

  const handleFieldChange = (index: number, field: keyof ExperienceEntry, value: unknown) => {
    if (!entries) return;
    const newList = [...entries];
    newList[index] = { ...newList[index], [field]: value };
    setEntries(newList);
  };

  return (
    <div className="space-y-8 bg-panel p-8 rounded-2xl border border-border shadow-md">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl">Experience Timeline</h2>
          <p className="text-xs text-text-secondary mt-1">Configure your internship and work logging history.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleAddEntry} className="btn-secondary py-2 px-4 text-xs font-semibold">
            Add Timeline Entry
          </button>
          <button onClick={() => handleSave()} disabled={saving} className="btn-primary py-2 px-5 text-xs font-semibold">
            {saving ? "Saving..." : "Save Timeline"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {entries?.map((entry, idx) => (
          <div key={idx} className="p-6 bg-void/30 border border-border rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-mono)] text-xs text-text-muted">
                ENTRY {String(idx + 1).padStart(2, "0")}
              </span>
              <button
                onClick={() => handleRemoveEntry(idx)}
                className="text-xs font-[family-name:var(--font-mono)] text-red-400 hover:text-red-300"
              >
                DELETE ENTRY
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">ROLE/TITLE</label>
                <input
                  type="text"
                  value={entry.role}
                  onChange={(e) => handleFieldChange(idx, "role", e.target.value)}
                  className="w-full px-4 py-2 rounded bg-void border border-border text-text-primary focus:outline-none focus:border-blue text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">ORGANIZATION</label>
                <input
                  type="text"
                  value={entry.org}
                  onChange={(e) => handleFieldChange(idx, "org", e.target.value)}
                  className="w-full px-4 py-2 rounded bg-void border border-border text-text-primary focus:outline-none focus:border-blue text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">DATES</label>
                <input
                  type="text"
                  value={entry.dates}
                  onChange={(e) => handleFieldChange(idx, "dates", e.target.value)}
                  className="w-full px-4 py-2 rounded bg-void border border-border text-text-primary focus:outline-none focus:border-blue text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">
                BULLETS / RESPONSIBILITIES (One per line)
              </label>
              <textarea
                rows={4}
                value={entry.bullets.join("\n")}
                onChange={(e) =>
                  handleFieldChange(
                    idx,
                    "bullets",
                    e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                  )
                }
                className="w-full px-4 py-2 rounded bg-void border border-border text-text-primary focus:outline-none focus:border-blue text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
