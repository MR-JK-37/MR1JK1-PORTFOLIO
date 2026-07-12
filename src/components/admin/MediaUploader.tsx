"use client";

import { useState, useCallback, useRef } from "react";

interface MediaAsset {
  id: string;
  type: string;
  originalUrl: string;
  compressedUrl: string;
  thumbnailUrl: string;
  isCover: boolean;
  sizeBytes: number;
}

interface MediaUploaderProps {
  ownerType: string;
  ownerId: string;
  assets: MediaAsset[];
  onAssetsChange: (assets: MediaAsset[]) => void;
  showToast: (message: string, type?: "success" | "error") => void;
  multiple?: boolean;
  acceptVideo?: boolean;
  label?: string;
}

export function MediaUploader({
  ownerType,
  ownerId,
  assets,
  onAssetsChange,
  showToast,
  multiple = false,
  acceptVideo = false,
  label = "Upload Media",
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = acceptVideo
    ? "image/*,video/mp4,video/webm,video/quicktime"
    : "image/*";

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);

      const newAssets: MediaAsset[] = [...assets];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`Uploading ${i + 1}/${files.length}: ${file.name}...`);

        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("ownerType", ownerType);
          formData.append("ownerId", ownerId);
          formData.append("isCover", newAssets.length === 0 ? "true" : "false");

          const res = await fetch("/api/media/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Upload failed");
          }

          const data = await res.json();
          newAssets.push(data.asset);

          const originalKB = Math.round((data.originalSize || 0) / 1024);
          const compressedKB = Math.round(
            (data.asset.sizeBytes || 0) / 1024
          );
          showToast(
            `Uploaded ${file.name} (${originalKB}KB → stored, provider: ${data.provider})`
          );
        } catch (err) {
          showToast(
            `Failed to upload ${file.name}: ${
              err instanceof Error ? err.message : "Unknown error"
            }`,
            "error"
          );
        }
      }

      onAssetsChange(newAssets);
      setUploading(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    },
    [assets, ownerType, ownerId, onAssetsChange, showToast]
  );

  const handleDelete = useCallback(
    async (assetId: string) => {
      try {
        if (!assetId.startsWith("http") && !assetId.startsWith("/")) {
          await fetch(`/api/media/${assetId}`, { method: "DELETE" });
        }
        const filtered = assets.filter((a) => a.id !== assetId);
        onAssetsChange(filtered);
        showToast("Media removed");
      } catch {
        showToast("Failed to remove media", "error");
      }
    },
    [assets, onAssetsChange, showToast]
  );

  const toggleCover = useCallback(
    (assetId: string) => {
      const updated = assets.map((a) => ({
        ...a,
        isCover: a.id === assetId ? !a.isCover : a.isCover,
      }));
      onAssetsChange(updated);
    },
    [assets, onAssetsChange]
  );

  return (
    <div className="space-y-3">
      <label className="text-xs font-[family-name:var(--font-mono)] text-text-secondary block">
        {label}
      </label>

      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          dragOver
            ? "border-blue/50 bg-blue/5"
            : "border-border hover:border-blue/30"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />

        {uploading ? (
          <div className="text-xs text-blue font-mono">
            {progress || "Uploading..."}
            <div className="mt-2 w-full h-1 bg-void rounded-full overflow-hidden">
              <div className="h-full bg-blue/50 rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        ) : (
          <div className="text-xs text-text-muted font-mono">
            <span className="text-blue">Click</span> or drag files here
            <br />
            <span className="text-[10px] mt-1 block">
              {acceptVideo ? "Images & Videos" : "Images only"} •{" "}
              {multiple ? "Multiple files" : "Single file"}
            </span>
          </div>
        )}
      </div>

      {/* Preview grid */}
      {assets.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="relative group rounded-lg overflow-hidden border border-border bg-void/30"
            >
              {asset.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.thumbnailUrl || asset.compressedUrl || asset.originalUrl}
                  alt="Upload preview"
                  className="w-full h-20 object-cover"
                />
              ) : (
                <div className="w-full h-20 flex items-center justify-center bg-void text-text-muted">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </div>
              )}

              {/* Cover badge */}
              {asset.isCover && (
                <span className="absolute top-1 left-1 text-[8px] font-mono px-1.5 py-0.5 bg-amber/20 text-amber rounded border border-amber/30">
                  COVER
                </span>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-void/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCover(asset.id);
                  }}
                  className="text-[9px] font-mono px-2 py-1 bg-blue/10 text-blue border border-blue/20 rounded hover:bg-blue/20"
                  title="Toggle cover"
                >
                  ★
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(asset.id);
                  }}
                  className="text-[9px] font-mono px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20"
                  title="Remove"
                >
                  ✕
                </button>
              </div>

              {/* Size info */}
              <div className="text-[8px] font-mono text-text-muted text-center py-0.5 bg-void/50">
                {Math.round(asset.sizeBytes / 1024)}KB
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
