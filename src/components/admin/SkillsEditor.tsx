"use client";

import { useState, useEffect } from "react";

interface SkillsEditorProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

type SkillsData = Record<string, string[]>;

export function SkillsEditor({ showToast }: SkillsEditorProps) {
  const [data, setData] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/content/skills");
        const rows = await res.json();
        if (rows.length > 0) {
          setData(JSON.parse(rows[0].value));
        } else {
          setData({});
        }
      } catch {
        showToast("Failed to load skills", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [showToast]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);

    try {
      const res = await fetch("/api/content/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "all",
          value: data,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Arsenal updated successfully");
    } catch {
      showToast("Failed to save skills configuration", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !data) return;
    if (data[newCatName]) {
      showToast("Category already exists", "error");
      return;
    }
    setData({ ...data, [newCatName]: [] });
    setNewCatName("");
  };

  const handleRemoveCategory = (cat: string) => {
    if (!data) return;
    const next = { ...data };
    delete next[cat];
    setData(next);
  };

  const handleSkillsChange = (cat: string, value: string) => {
    if (!data) return;
    const list = value.split(",").map((s) => s.trim()).filter(Boolean);
    setData({ ...data, [cat]: list });
  };

  if (loading || !data) {
    return <div className="font-mono text-sm text-text-muted">Reading database...</div>;
  }

  return (
    <div className="space-y-8 bg-panel p-8 rounded-2xl border border-border shadow-md">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl">Technical Arsenal</h2>
          <p className="text-xs text-text-secondary mt-1">Manage categories and skill tags displayed on the portfolio.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-5 text-xs font-semibold">
          {saving ? "Saving..." : "Save Arsenal"}
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(data).map(([cat, list]) => (
          <div key={cat} className="p-5 bg-void/30 border border-border/80 rounded-xl relative">
            <button
              onClick={() => handleRemoveCategory(cat)}
              className="absolute top-4 right-4 text-xs font-[family-name:var(--font-mono)] text-red-400 hover:text-red-300"
            >
              DELETE CATEGORY
            </button>
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-sm mb-4 text-text-primary">
              {cat}
            </h3>

            <div>
              <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">
                SKILLS (Comma Separated)
              </label>
              <input
                type="text"
                value={list.join(", ")}
                onChange={(e) => handleSkillsChange(cat, e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-void border border-border text-text-primary focus:outline-none focus:border-blue transition-colors text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddCategory} className="border-t border-border pt-6 flex gap-4">
        <input
          type="text"
          required
          placeholder="New Category Name (e.g. Exploits)"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg bg-void border border-border text-text-primary focus:outline-none focus:border-blue transition-colors text-sm"
        />
        <button type="submit" className="btn-secondary py-2.5 text-xs">
          Add Category
        </button>
      </form>
    </div>
  );
}
