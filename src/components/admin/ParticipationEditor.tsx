"use client";

import { useState, useEffect } from "react";
import { MediaUploader } from "./MediaUploader";

interface ParticipationEditorProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

interface ParticipationItem {
  id?: string;
  title: string;
  description: string;
  detailedContent: string;
  imageUrl: string;
  certificateUrl: string;
  order: number;
}

export function ParticipationEditor({ showToast }: ParticipationEditorProps) {
  const [items, setItems] = useState<ParticipationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/participation");
        const data = await res.json();
        setItems(data);
      } catch {
        showToast("Failed to load participation data", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showToast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/participation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((item, i) => ({ ...item, order: i })) }),
      });
      showToast("Participation entries saved");
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    setItems([
      ...items,
      {
        title: "New Event",
        description: "",
        detailedContent: "",
        imageUrl: "",
        certificateUrl: "",
        order: items.length,
      },
    ]);
  };

  const handleRemove = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateField = (idx: number, field: keyof ParticipationItem, value: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    setItems(next);
  };

  if (loading) {
    return <div className="font-mono text-sm text-text-muted">Loading...</div>;
  }

  return (
    <div className="space-y-8 bg-panel p-8 rounded-2xl border border-border shadow-md">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl">
            Participation
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Events, competitions, and hackathons you&apos;ve participated in.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAdd} className="btn-secondary py-2 px-4 text-xs">
            + Add Entry
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary py-2 px-5 text-xs font-semibold"
          >
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-5 bg-void/30 border border-border rounded-xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-text-muted">
                ENTRY {idx + 1}
              </span>
              <button
                onClick={() => handleRemove(idx)}
                className="text-[10px] font-mono text-red-400 hover:text-red-300"
              >
                REMOVE
              </button>
            </div>

            <input
              type="text"
              value={item.title}
              onChange={(e) => updateField(idx, "title", e.target.value)}
              placeholder="Event title"
              className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
            />

            <input
              type="text"
              value={item.description}
              onChange={(e) => updateField(idx, "description", e.target.value)}
              placeholder="Short description"
              className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
            />

            <textarea
              value={item.detailedContent}
              onChange={(e) => updateField(idx, "detailedContent", e.target.value)}
              placeholder="Detailed content (shown in detail view)"
              rows={4}
              className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs resize-y"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-text-muted block mb-1">
                  Event Image URL
                </label>
                <input
                  type="text"
                  value={item.imageUrl}
                  onChange={(e) => updateField(idx, "imageUrl", e.target.value)}
                  placeholder="/uploads/media/..."
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-text-muted block mb-1">
                  Certificate Image URL
                </label>
                <input
                  type="text"
                  value={item.certificateUrl}
                  onChange={(e) => updateField(idx, "certificateUrl", e.target.value)}
                  placeholder="/uploads/media/..."
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
                />
              </div>
            </div>

            <MediaUploader
              ownerType="participation"
              ownerId={item.id || `new-${idx}`}
              assets={[]}
              onAssetsChange={(assets) => {
                if (assets.length > 0) {
                  const lastAsset = assets[assets.length - 1];
                  updateField(idx, "imageUrl", lastAsset.compressedUrl || lastAsset.originalUrl);
                }
              }}
              showToast={showToast}
              label="Upload Event Image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
