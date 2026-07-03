"use client";

import { useState, useEffect } from "react";

interface ExtraEditorProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

export function ExtraEditor({ showToast }: ExtraEditorProps) {
  const [items, setItems] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/content/extraCurricular");
        const rows = await res.json();
        if (rows.length > 0) {
          setItems(JSON.parse(rows[0].value));
        } else {
          setItems([]);
        }
      } catch {
        showToast("Failed to load extra-curricular items", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [showToast]);

  const handleSave = async (updatedItems = items) => {
    if (!updatedItems) return;
    setSaving(true);

    try {
      const res = await fetch("/api/content/extraCurricular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "all",
          value: updatedItems,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Extra-curricular items saved successfully");
    } catch {
      showToast("Failed to save activities list", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !items) {
    return <div className="font-mono text-sm text-text-muted">Reading database...</div>;
  }

  return (
    <div className="space-y-8 bg-panel p-8 rounded-2xl border border-border shadow-md">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl">Extra-Curricular Activities</h2>
          <p className="text-xs text-text-secondary mt-1">Configure community, singing competitions, or content creation activities.</p>
        </div>
        <button onClick={() => handleSave()} disabled={saving} className="btn-primary py-2 px-5 text-xs font-semibold">
          {saving ? "Saving..." : "Save List"}
        </button>
      </div>

      <div>
        <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">
          ACTIVITIES (One item per line)
        </label>
        <textarea
          rows={10}
          value={items.join("\n")}
          onChange={(e) =>
            setItems(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
          }
          className="w-full px-4 py-3 rounded-lg bg-void border border-border text-text-primary focus:outline-none focus:border-blue transition-colors text-sm font-sans"
          placeholder="Singing Competition 1st Place..."
        />
      </div>
    </div>
  );
}
