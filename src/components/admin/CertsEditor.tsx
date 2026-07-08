"use client";

import { useState, useEffect } from "react";
import { MediaUploader } from "./MediaUploader";

interface CertsEditorProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

interface CertItem {
  id?: string;
  title: string;
  issuer: string;
  description: string;
  detailedContent: string;
  imageUrl: string;
  order: number;
}

interface AchItem {
  id?: string;
  title: string;
  org: string;
  description: string;
  detailedContent: string;
  imageUrl: string;
  order: number;
}

export function CertsEditor({ showToast }: CertsEditorProps) {
  const [certs, setCerts] = useState<CertItem[] | null>(null);
  const [achievements, setAchievements] = useState<AchItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, aRes] = await Promise.all([
          fetch("/api/certifications"),
          fetch("/api/achievements"),
        ]);
        const cRows = await cRes.json();
        const aRows = await aRes.json();

        setCerts(cRows);
        setAchievements(aRows);
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
        fetch("/api/certifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: certs.map((c, i) => ({ ...c, order: i })),
          }),
        }),
        fetch("/api/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: achievements.map((a, i) => ({ ...a, order: i })),
          }),
        }),
      ]);
      showToast("Credentials saved successfully");
    } catch {
      showToast("Failed to save credentials", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCert = () => {
    if (!certs) return;
    setCerts([
      ...certs,
      { title: "New Certification", issuer: "", description: "", detailedContent: "", imageUrl: "", order: certs.length },
    ]);
  };

  const handleAddAch = () => {
    if (!achievements) return;
    setAchievements([
      ...achievements,
      { title: "New Achievement", org: "", description: "", detailedContent: "", imageUrl: "", order: achievements.length },
    ]);
  };

  const handleRemoveCert = (idx: number) => {
    if (!certs) return;
    setCerts(certs.filter((_, i) => i !== idx));
  };

  const handleRemoveAch = (idx: number) => {
    if (!achievements) return;
    setAchievements(achievements.filter((_, i) => i !== idx));
  };

  const updateCert = (idx: number, field: keyof CertItem, value: string) => {
    if (!certs) return;
    const next = [...certs];
    next[idx] = { ...next[idx], [field]: value };
    setCerts(next);
  };

  const updateAch = (idx: number, field: keyof AchItem, value: string) => {
    if (!achievements) return;
    const next = [...achievements];
    next[idx] = { ...next[idx], [field]: value };
    setAchievements(next);
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
            <button onClick={handleAddCert} className="btn-secondary py-1 px-3 text-xs">
              + Add
            </button>
          </div>
          <div className="space-y-4">
            {certs.map((item, idx) => (
              <div key={idx} className="p-4 bg-void/30 border border-border rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-text-muted">CERT {idx + 1}</span>
                  <button onClick={() => handleRemoveCert(idx)} className="text-[10px] font-mono text-red-400 hover:text-red-300">
                    REMOVE
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateCert(idx, "title", e.target.value)}
                  placeholder="Certification title"
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
                />
                <input
                  type="text"
                  value={item.issuer}
                  onChange={(e) => updateCert(idx, "issuer", e.target.value)}
                  placeholder="Issuer (e.g. Oracle, APIsec)"
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateCert(idx, "description", e.target.value)}
                  placeholder="Short description"
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
                />
                <textarea
                  value={item.detailedContent}
                  onChange={(e) => updateCert(idx, "detailedContent", e.target.value)}
                  placeholder="Detailed content (shown in detail modal)"
                  rows={3}
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs resize-y"
                />
                <MediaUploader
                  ownerType="certification"
                  ownerId={item.id || `new-cert-${idx}`}
                  assets={[]}
                  onAssetsChange={(assets) => {
                    if (assets.length > 0) {
                      updateCert(idx, "imageUrl", assets[assets.length - 1].compressedUrl || assets[assets.length - 1].originalUrl);
                    }
                  }}
                  showToast={showToast}
                  label="Certificate Image"
                />
                {item.imageUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-text-muted">Image:</span>
                    <span className="text-[10px] font-mono text-blue truncate">{item.imageUrl}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Achievements column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-[family-name:var(--font-display)] font-semibold text-text-primary">Achievements</h3>
            <button onClick={handleAddAch} className="btn-secondary py-1 px-3 text-xs">
              + Add
            </button>
          </div>
          <div className="space-y-4">
            {achievements.map((item, idx) => (
              <div key={idx} className="p-4 bg-void/30 border border-border rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-text-muted">ACHIEVEMENT {idx + 1}</span>
                  <button onClick={() => handleRemoveAch(idx)} className="text-[10px] font-mono text-red-400 hover:text-red-300">
                    REMOVE
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateAch(idx, "title", e.target.value)}
                  placeholder="Achievement title"
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
                />
                <input
                  type="text"
                  value={item.org}
                  onChange={(e) => updateAch(idx, "org", e.target.value)}
                  placeholder="Organization"
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateAch(idx, "description", e.target.value)}
                  placeholder="Short description"
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
                />
                <textarea
                  value={item.detailedContent}
                  onChange={(e) => updateAch(idx, "detailedContent", e.target.value)}
                  placeholder="Detailed content (shown in detail modal)"
                  rows={3}
                  className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs resize-y"
                />
                <MediaUploader
                  ownerType="achievement"
                  ownerId={item.id || `new-ach-${idx}`}
                  assets={[]}
                  onAssetsChange={(assets) => {
                    if (assets.length > 0) {
                      updateAch(idx, "imageUrl", assets[assets.length - 1].compressedUrl || assets[assets.length - 1].originalUrl);
                    }
                  }}
                  showToast={showToast}
                  label="Achievement Image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
