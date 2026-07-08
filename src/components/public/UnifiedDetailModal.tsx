"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export interface MediaAsset {
  id: string;
  type: string;
  originalUrl: string;
  compressedUrl?: string;
  thumbnailUrl?: string;
  isCover?: boolean;
}

interface UnifiedDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  content: string;
  accentColor?: "blue" | "violet" | "amber";
  imageUrl?: string;
  secondaryImageUrl?: string;
  secondaryImageLabel?: string;
  media?: MediaAsset[];
}

export function UnifiedDetailModal({
  isOpen,
  onClose,
  title,
  subtitle,
  content,
  accentColor = "blue",
  imageUrl,
  secondaryImageUrl,
  secondaryImageLabel,
  media = [],
}: UnifiedDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
      // Small timeout to allow mount before transition starts
      const t = setTimeout(() => {
        setAnimate(true);
        try {
          dialogRef.current?.showModal();
        } catch (e) {
          // ignore double open errors
        }
      }, 50);
      return () => clearTimeout(t);
    } else {
      setAnimate(false);
      const t = setTimeout(() => {
        setShouldRender(false);
        try {
          dialogRef.current?.close();
        } catch (e) {}
        document.body.style.overflow = "";
      }, 300); // matches animation duration
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  const colors = {
    blue: {
      border: "rgba(69, 211, 255, 0.25)",
      borderHover: "rgba(69, 211, 255, 0.5)",
      glow: "rgba(69, 211, 255, 0.1)",
      text: "var(--color-blue)",
      bgLight: "rgba(69, 211, 255, 0.05)",
    },
    violet: {
      border: "rgba(178, 115, 255, 0.25)",
      borderHover: "rgba(178, 115, 255, 0.5)",
      glow: "rgba(178, 115, 255, 0.1)",
      text: "var(--color-violet)",
      bgLight: "rgba(178, 115, 255, 0.05)",
    },
    amber: {
      border: "rgba(240, 166, 58, 0.25)",
      borderHover: "rgba(240, 166, 58, 0.5)",
      glow: "rgba(240, 166, 58, 0.1)",
      text: "var(--color-amber)",
      bgLight: "rgba(240, 166, 58, 0.05)",
    },
  }[accentColor];

  if (!shouldRender) return null;

  // Gather all media assets to show
  const allImages: MediaAsset[] = [...media.filter((m) => m.type === "image")];
  const allVideos: MediaAsset[] = [...media.filter((m) => m.type === "video")];

  if (imageUrl) {
    allImages.unshift({
      id: "main-image",
      type: "image",
      originalUrl: imageUrl,
    });
  }
  if (secondaryImageUrl) {
    allImages.push({
      id: "secondary-image",
      type: "image",
      originalUrl: secondaryImageUrl,
      isCover: false,
    });
  }

  const hasMedia = allImages.length > 0 || allVideos.length > 0;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[250] w-[92%] max-w-4xl mx-auto my-auto p-0 rounded-2xl border bg-transparent backdrop:bg-void/85 backdrop:backdrop-blur-md transition-all duration-300 ${
        animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      style={{
        borderColor: colors.border,
        boxShadow: `0 0 40px ${colors.glow}, 0 25px 50px rgba(0,0,0,0.6)`,
      }}
    >
      <div
        className="bg-panel relative overflow-hidden rounded-2xl max-h-[85vh] overflow-y-auto"
        style={{ scrollbarColor: "var(--color-panel-light) var(--color-void)" }}
      >
        {/* Custom close button styled like site buttons */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-void/80 border border-border text-[10px] font-mono text-text-muted hover:text-text-primary transition-all flex items-center gap-1.5"
          style={{ borderColor: colors.border }}
          aria-label="Close modal"
        >
          <span>ESC</span>
          <span>✕</span>
        </button>

        {/* Dynamic Layout: Two Column on Desktop if media exists, else Single Column */}
        <div className={`grid ${hasMedia ? "lg:grid-cols-12" : "grid-cols-1"} gap-0`}>
          {/* Media Column (Left) */}
          {hasMedia && (
            <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-border/40 p-6 flex flex-col justify-center bg-void/20">
              <div className="space-y-4">
                {/* Images */}
                {allImages.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-mono text-text-muted tracking-wider uppercase flex items-center gap-1.5">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                      Media Gallery ({allImages.length})
                    </p>
                    <div className={`grid ${allImages.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                      {allImages.map((img, idx) => (
                        <div
                          key={img.id || idx}
                          className="relative group rounded-xl overflow-hidden border border-border/40 bg-void/50 aspect-video transition-all hover:border-blue/30"
                          style={{
                            boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.originalUrl}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Download Button */}
                          <a
                            href={img.originalUrl}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-void/90 border border-border/50 flex items-center justify-center text-text-muted hover:text-text-primary transition-all opacity-0 group-hover:opacity-100"
                            title="Download Image"
                          >
                            <svg
                              width="12"
                              height="12"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                              />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {allVideos.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-mono text-text-muted tracking-wider uppercase flex items-center gap-1.5">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 2.25-4.5 2.25V9.75z" /></svg>
                      Videos ({allVideos.length})
                    </p>
                    <div className="space-y-3">
                      {allVideos.map((vid, idx) => (
                        <div
                          key={vid.id || idx}
                          className="relative rounded-xl overflow-hidden border border-border/40 bg-void/50 aspect-video"
                        >
                          <video
                            src={vid.originalUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                          <a
                            href={vid.originalUrl}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-void/80 border border-border/50 text-[9px] font-mono text-text-muted hover:text-text-primary transition-all flex items-center gap-1"
                            title="Download Video"
                          >
                            <svg
                              width="10"
                              height="10"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                              />
                            </svg>
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Column (Right) */}
          <div className={`${hasMedia ? "lg:col-span-6" : "col-span-1"} p-6 md:p-8 flex flex-col justify-between`}>
            <div className="space-y-6">
              {/* Eyebrow Label */}
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: colors.text }}
                />
                <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase">
                  System Detail Log
                </span>
              </div>

              <div>
                <h3 className="font-[family-name:var(--font-display)] font-bold text-xl md:text-2xl text-text-primary tracking-tight">
                  {title}
                </h3>
                {subtitle && (
                  <p
                    className="font-[family-name:var(--font-mono)] text-xs mt-1.5 font-medium tracking-wide"
                    style={{ color: colors.text }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              <div
                className="text-text-secondary text-sm leading-relaxed whitespace-pre-line border-t border-border/20 pt-4"
                style={{ lineHeight: 1.8 }}
              >
                {content}
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="mt-8 pt-4 border-t border-border/20 flex items-center justify-between text-[10px] font-mono text-text-muted">
              <span>STATUS: VERIFIED</span>
              <span>PROVIDER: CLOUDINARY</span>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
