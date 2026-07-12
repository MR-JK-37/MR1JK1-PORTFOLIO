"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TiltCard } from "@/components/shared/TiltCard";
import { UnifiedDetailModal } from "./UnifiedDetailModal";
import type { ParticipationData } from "@/lib/content";

interface ParticipationProps {
  participations: ParticipationData[];
}

export function Participation({ participations }: ParticipationProps) {
  const [selected, setSelected] = useState<ParticipationData | null>(null);

  if (participations.length === 0) return null;

  return (
    <>
      <section
        id="participation"
        className="section-padding section-lazy"
        style={{ background: "var(--color-panel)" }}
      >
        <div className="section-max-width">
          <ScrollReveal>
            <p className="eyebrow eyebrow-violet mb-3">
              $ ls /var/log/events
            </p>
            <h2 className="section-heading mb-12">
              Event{" "}
              <span className="neon-violet">
                Participation
              </span>
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {participations.map((item, i) => (
              <ScrollReveal key={item.id || i} delay={0.05 * i}>
                <TiltCard
                  className="card cursor-pointer h-full"
                  glowColor="violet"
                >
                  <div
                    className="p-0 overflow-hidden h-full flex flex-col"
                    onClick={() => setSelected(item)}
                    style={{
                      borderRadius:
                        i % 2 === 0
                          ? "var(--radius-card)"
                          : "var(--radius-card-alt)",
                    }}
                  >
                    {/* Image */}
                    {item.imageUrl && (
                      <div className="w-full h-36 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start gap-3 mb-2">
                        <div
                          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            background: "rgba(178,115,255,0.1)",
                            border: "1px solid rgba(178,115,255,0.2)",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="var(--color-violet)"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                            />
                          </svg>
                        </div>
                        <h4
                          className="font-[family-name:var(--font-display)] font-semibold text-text-primary flex-1"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {item.title}
                        </h4>
                      </div>

                      {item.description && (
                        <p
                          className="text-text-secondary flex-1"
                          style={{ fontSize: "0.8rem", lineHeight: 1.6 }}
                        >
                          {item.description.length > 100
                            ? item.description.slice(0, 100) + "..."
                            : item.description}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-1 text-violet">
                        <span
                          className="font-[family-name:var(--font-mono)]"
                          style={{ fontSize: "0.7rem" }}
                        >
                          View Details
                        </span>
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
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <UnifiedDetailModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || ""}
        imageUrl={selected?.imageUrl || ""}
        secondaryImageUrl={selected?.certificateUrl || ""}
        secondaryImageLabel={selected?.certificateUrl ? "Certificate" : undefined}
        content={selected?.detailedContent || selected?.description || ""}
        accentColor="violet"
      />
    </>
  );
}
