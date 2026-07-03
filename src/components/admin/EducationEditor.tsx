"use client";

import { useState, useEffect } from "react";

interface EducationEditorProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

interface EducationEntry {
  degree: string;
  institution: string;
  years: string;
}

export function EducationEditor({ showToast }: EducationEditorProps) {
  const [entries, setEntries] = useState<EducationEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/content/education");
        const rows = await res.json();
        if (rows.length > 0) {
          setEntries(JSON.parse(rows[0].value));
        } else {
          setEntries([]);
        }
      } catch {
        showToast("Failed to load education entries", "error");
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
      const res = await fetch("/api/content/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "all",
          value: updatedEntries,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Education details updated successfully");
    } catch {
      showToast("Failed to save education details", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddEntry = () => {
    if (!entries) return;
    const newList = [
      ...entries,
      {
        degree: "Undergraduate Degree",
        institution: "Institution Name",
        years: "2024 - 2028",
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

  const handleFieldChange = (index: number, field: keyof EducationEntry, value: string) => {
    if (!entries) return;
    const newList = [...entries];
    newList[index] = { ...newList[index], [field]: value };
    setEntries(newList);
  };

  if (loading || !entries) {
    return <div className="font-mono text-sm text-text-muted">Reading database...</div>;
  }

  return (
    <div className="space-y-8 bg-panel p-8 rounded-2xl border border-border shadow-md">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl">Education Details</h2>
          <p className="text-xs text-text-secondary mt-1">Configure degrees, diplomas, and high school timelines.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleAddEntry} className="btn-secondary py-2 px-4 text-xs font-semibold">
            Add Degree
          </button>
          <button onClick={() => handleSave()} disabled={saving} className="btn-primary py-2 px-5 text-xs font-semibold">
            {saving ? "Saving..." : "Save Education"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {entries.map((entry, idx) => (
          <div key={idx} className="p-6 bg-void/30 border border-border rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-mono)] text-xs text-text-muted">
                DEGREE {String(idx + 1).padStart(2, "0")}
              </span>
              <button
                onClick={() => handleRemoveEntry(idx)}
                className="text-xs font-[family-name:var(--font-mono)] text-red-400 hover:text-red-300"
              >
                DELETE
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">DEGREE / COURSE</label>
                <input
                  type="text"
                  value={entry.degree}
                  onChange={(e) => handleFieldChange(idx, "degree", e.target.value)}
                  className="w-full px-4 py-2 rounded bg-void border border-border text-text-primary focus:outline-none focus:border-blue text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">YEARS / TIMELINE</label>
                <input
                  type="text"
                  value={entry.years}
                  onChange={(e) => handleFieldChange(idx, "years", e.target.value)}
                  className="w-full px-4 py-2 rounded bg-void border border-border text-text-primary focus:outline-none focus:border-blue text-sm"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">INSTITUTION</label>
                <input
                  type="text"
                  value={entry.institution}
                  onChange={(e) => handleFieldChange(idx, "institution", e.target.value)}
                  className="w-full px-4 py-2 rounded bg-void border border-border text-text-primary focus:outline-none focus:border-blue text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
