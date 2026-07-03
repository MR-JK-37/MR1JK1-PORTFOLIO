"use client";

import { useState, useEffect } from "react";

interface CertsEditorProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

interface Item {
  title: string;
  detail: string;
}

export function CertsEditor({ showToast }: CertsEditorProps) {
  const [certs, setCerts] = useState<Item[] | null>(null);
  const [achievements, setAchievements] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, aRes] = await Promise.all([
          fetch("/api/content/certifications"),
          fetch("/api/content/achievements"),
        ]);
        const cRows = await cRes.json();
        const aRows = await aRes.json();

        setCerts(cRows.length > 0 ? JSON.parse(cRows[0].value) : []);
        setAchievements(aRows.length > 0 ? JSON.parse(aRows[0].value) : []);
      } catch {
        showToast("Failed to load certifications or achievements", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [showToast]);

  const handleSave = async () => {
    if (!certs || !achievements) return;
    setSaving(true);

    try {
      await Promise.all([
        fetch("/api/content/certifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "all", value: certs }),
        }),
        fetch("/api/content/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "all", value: achievements }),
        }),
      ]);
      showToast("Credentials saved successfully");
    } catch {
      showToast("Failed to save credentials", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = (type: "certs" | "ach") => {
    const list = type === "certs" ? certs : achievements;
    if (!list) return;
    const next = [...list, { title: "New entry", detail: "Short description / authority" }];
    if (type === "certs") setCerts(next);
    else setAchievements(next);
  };

  const handleRemoveItem = (type: "certs" | "ach", index: number) => {
    const list = type === "certs" ? certs : achievements;
    if (!list) return;
    const next = list.filter((_, i) => i !== index);
    if (type === "certs") setCerts(next);
    else setAchievements(next);
  };

  const handleFieldChange = (type: "certs" | "ach", index: number, field: keyof Item, value: string) => {
    const list = type === "certs" ? certs : achievements;
    if (!list) return;
    const next = [...list];
    next[index] = { ...next[index], [field]: value };
    if (type === "certs") setCerts(next);
    else setAchievements(next);
  };

  if (loading || !certs || !achievements) {
    return <div className="font-mono text-sm text-text-muted">Reading database...</div>;
  }

  return (
    <div className="space-y-8 bg-panel p-8 rounded-2xl border border-border shadow-md">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl">Certifications & Achievements</h2>
          <p className="text-xs text-text-secondary mt-1">Configure credentials and competitive hacking accomplishments.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-5 text-xs font-semibold">
          {saving ? "Saving..." : "Save Credentials"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Certifications column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-[family-name:var(--font-display)] font-semibold text-text-primary">Certifications</h3>
            <button onClick={() => handleAddItem("certs")} className="btn-secondary py-1 px-3 text-xs">
              + Add
            </button>
          </div>
          <div className="space-y-4">
            {certs.map((item, idx) => (
              <div key={idx} className="p-4 bg-void/30 border border-border rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-text-muted">CERT {idx + 1}</span>
                  <button onClick={() => handleRemoveItem("certs", idx)} className="text-[10px] font-mono text-red-400 hover:text-red-300">
                    REMOVE
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleFieldChange("certs", idx, "title", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
                />
                <input
                  type="text"
                  value={item.detail}
                  placeholder="Detail / Authority"
                  onChange={(e) => handleFieldChange("certs", idx, "detail", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Achievements column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-[family-name:var(--font-display)] font-semibold text-text-primary">Achievements</h3>
            <button onClick={() => handleAddItem("ach")} className="btn-secondary py-1 px-3 text-xs">
              + Add
            </button>
          </div>
          <div className="space-y-4">
            {achievements.map((item, idx) => (
              <div key={idx} className="p-4 bg-void/30 border border-border rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-text-muted">ACHIEVEMENT {idx + 1}</span>
                  <button onClick={() => handleRemoveItem("ach", idx)} className="text-[10px] font-mono text-red-400 hover:text-red-300">
                    REMOVE
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleFieldChange("ach", idx, "title", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
                />
                <input
                  type="text"
                  value={item.detail}
                  placeholder="Detail / Context"
                  onChange={(e) => handleFieldChange("ach", idx, "detail", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
