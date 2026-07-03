"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface HeroMediaEditorProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

export function HeroMediaEditor({ showToast }: HeroMediaEditorProps) {
  const [dayImage, setDayImage] = useState<string | null>(null);
  const [nightImage, setNightImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingDay, setUploadingDay] = useState(false);
  const [uploadingNight, setUploadingNight] = useState(false);

  useEffect(() => {
    async function loadImages() {
      try {
        const [dayRes, nightRes] = await Promise.all([
          fetch("/api/content/hero?key=dayImage"),
          fetch("/api/content/hero?key=nightImage"),
        ]);
        const dayRows = await dayRes.json();
        const nightRows = await nightRes.json();

        // Extract values from rows
        const dayRow = dayRows.find((r: { key: string }) => r.key === "dayImage");
        const nightRow = nightRows.find((r: { key: string }) => r.key === "nightImage");

        setDayImage(dayRow ? JSON.parse(dayRow.value) : "/uploads/hero-day.jpg");
        setNightImage(nightRow ? JSON.parse(nightRow.value) : "/uploads/hero-night.jpg");
      } catch {
        showToast("Failed to load hero media settings", "error");
      } finally {
        setLoading(false);
      }
    }
    loadImages();
  }, [showToast]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, mode: "day" | "night") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading = mode === "day" ? setUploadingDay : setUploadingNight;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetName", mode === "day" ? "hero-day" : "hero-night");

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      // Save to database content row
      const contentRes = await fetch("/api/content/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: mode === "day" ? "dayImage" : "nightImage",
          value: uploadData.path,
        }),
      });

      if (!contentRes.ok) throw new Error("Failed to save content configuration");

      if (mode === "day") setDayImage(uploadData.path);
      else setNightImage(uploadData.path);

      showToast(`Hero ${mode} image updated successfully`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, "error");
      } else {
        showToast("Failed to upload image", "error");
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="font-mono text-sm text-text-muted">Reading database...</div>;
  }

  return (
    <div className="space-y-8 bg-panel p-8 rounded-2xl border border-border shadow-md">
      <div>
        <h2 className="font-[family-name:var(--font-display)] font-bold text-xl">Hero Media Duality</h2>
        <p className="text-xs text-text-secondary mt-1">
          Replace the dual hero assets (Analyst vs Exploit modes).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Day Image */}
        <div className="space-y-4">
          <h3 className="text-sm font-[family-name:var(--font-display)] font-semibold text-blue">
            Analyst Mode Image (Day)
          </h3>
          <div className="relative aspect-[3/4] bg-void rounded-xl border border-border overflow-hidden flex items-center justify-center">
            {dayImage ? (
              <Image src={dayImage} alt="Analyst Mode Preview" fill className="object-cover" />
            ) : (
              <span className="text-xs text-text-muted">No Image</span>
            )}
            {uploadingDay && (
              <div className="absolute inset-0 bg-void/80 flex items-center justify-center text-xs font-[family-name:var(--font-mono)]">
                Uploading...
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            id="day-upload"
            className="hidden"
            onChange={(e) => handleUpload(e, "day")}
          />
          <label htmlFor="day-upload" className="btn-secondary w-full justify-center py-2 text-xs font-semibold block text-center cursor-pointer">
            Upload Analyst Photo
          </label>
        </div>

        {/* Night Image */}
        <div className="space-y-4">
          <h3 className="text-sm font-[family-name:var(--font-display)] font-semibold text-violet">
            Exploit Mode Image (Night)
          </h3>
          <div className="relative aspect-[3/4] bg-void rounded-xl border border-border overflow-hidden flex items-center justify-center">
            {nightImage ? (
              <Image src={nightImage} alt="Exploit Mode Preview" fill className="object-cover" />
            ) : (
              <span className="text-xs text-text-muted">No Image</span>
            )}
            {uploadingNight && (
              <div className="absolute inset-0 bg-void/80 flex items-center justify-center text-xs font-[family-name:var(--font-mono)]">
                Uploading...
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            id="night-upload"
            className="hidden"
            onChange={(e) => handleUpload(e, "night")}
          />
          <label htmlFor="night-upload" className="btn-secondary w-full justify-center py-2 text-xs font-semibold block text-center cursor-pointer">
            Upload Exploit Photo
          </label>
        </div>
      </div>
    </div>
  );
}
