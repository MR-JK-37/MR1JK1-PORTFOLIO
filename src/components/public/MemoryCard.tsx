"use client";

import { useState, useEffect, useRef } from "react";
import type { MediaAssetData } from "@/lib/content";
import { TiltCard } from "@/components/shared/TiltCard";

interface MemoryEvent {
  id: string;
  title: string;
  shortDescription: string;
  media: MediaAssetData[];
}

interface MemoryCardProps {
  event: MemoryEvent;
  onClick: () => void;
  isLarge?: boolean;
}

export function MemoryCard({ event, onClick, isLarge = false }: MemoryCardProps) {
  const coverImages = event.media.filter(
    (m) => m.type === "image" && m.isCover
  );
  const fallbackImage = event.media.find((m) => m.type === "image");
  const images =
    coverImages.length > 0 ? coverImages : fallbackImage ? [fallbackImage] : [];

  const [currentIdx, setCurrentIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  // Auto-cycle between cover images every 1.5 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  return (
    <div onClick={onClick} className="cursor-pointer group h-full">
      <TiltCard
        className="cyber-card-wrapper cyber-card-wrapper-amber h-full flex flex-col justify-between"
        glowColor="amber"
      >
        <div className="cyber-card-inner p-0 overflow-hidden flex flex-col justify-between h-full">
          {/* Image area with crossfade */}
          <div
            className={`relative w-full overflow-hidden bg-void ${
              isLarge ? "h-64" : "h-44"
            }`}
          >
            {images.length > 0 ? (
              images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.thumbnailUrl || img.compressedUrl || img.originalUrl}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                  style={{ opacity: i === currentIdx ? 1 : 0 }}
                />
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted bg-void/50">
                <svg
                  width="32"
                  height="32"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>
            )}

            {/* Gradient overlay */}
            <div
              className="absolute inset-x-0 bottom-0 h-16"
              style={{
                background:
                  "linear-gradient(to top, var(--color-panel), transparent)",
              }}
            />

            {/* Image count indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 flex gap-1 bg-void/70 px-1.5 py-1 rounded backdrop-blur">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background:
                        i === currentIdx
                          ? "var(--color-amber)"
                          : "rgba(255,255,255,0.3)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3
                  className="font-[family-name:var(--font-display)] font-semibold text-text-primary group-hover:text-amber transition-colors"
                  style={{ fontSize: "0.95rem" }}
                >
                  {event.title}
                </h3>
                <span className="text-[8px] font-mono text-amber bg-amber/10 border border-amber/20 px-1.5 py-0.5 rounded tracking-wide shrink-0">
                  MEM_LOG
                </span>
              </div>
              {event.shortDescription && (
                <p
                  className="text-text-secondary mt-1.5 line-clamp-3"
                  style={{ fontSize: "0.8rem", lineHeight: 1.5 }}
                >
                  {event.shortDescription}
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-amber">
              <span
                className="font-[family-name:var(--font-mono)]"
                style={{ fontSize: "0.75rem" }}
              >
                $ read_archive --id={event.id.slice(0, 8)}
              </span>
              <span className="animate-ping w-1 h-1 rounded-full bg-amber" />
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
