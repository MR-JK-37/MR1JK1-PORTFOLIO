"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TiltCard } from "@/components/shared/TiltCard";
import { UnifiedDetailModal } from "./UnifiedDetailModal";
import type { CertificationData, AchievementData } from "@/lib/content";

interface CertificationsProps {
  certifications: CertificationData[];
  achievements: AchievementData[];
}

const VISIBLE_COUNT = 5;

export function Certifications({
  certifications,
  achievements,
}: CertificationsProps) {
  const [showAllCerts, setShowAllCerts] = useState(false);
  const [showAllAch, setShowAllAch] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificationData | null>(null);
  const [selectedAch, setSelectedAch] = useState<AchievementData | null>(null);

  const visibleCerts = showAllCerts
    ? certifications
    : certifications.slice(0, VISIBLE_COUNT);
  const visibleAch = showAllAch
    ? achievements
    : achievements.slice(0, VISIBLE_COUNT);

  const hasMoreCerts = certifications.length > VISIBLE_COUNT;
  const hasMoreAch = achievements.length > VISIBLE_COUNT;

  return (
    <>
      <section
        id="certifications"
        className="section-padding section-lazy"
        style={{ background: "var(--color-panel)" }}
      >
        <div className="section-max-width">
          <ScrollReveal>
            <p className="eyebrow mb-3">$ cat /var/log/achievements</p>
            <h2 className="section-heading mb-12">
              Certifications &{" "}
              <span className="neon-violet">Achievements</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Certifications */}
            <ScrollReveal delay={0.1}>
              <h3
                className="font-[family-name:var(--font-mono)] mb-6 flex items-center gap-2 tracking-wider"
                style={{ fontSize: "0.85rem", color: "var(--color-blue)" }}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
                Certifications
              </h3>

              <div className="space-y-4">
                {visibleCerts.map((cert, i) => (
                  <div
                    key={cert.id || i}
                    onClick={() => setSelectedCert(cert)}
                    className="cursor-pointer group"
                  >
                    <TiltCard
                      className="cyber-card-wrapper cyber-card-wrapper-blue"
                      glowColor="blue"
                    >
                      <div className="cyber-card-inner p-5 flex gap-4 items-start">
                        <div
                          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mt-0.5 bg-void/60 border border-border/60 p-1 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)]"
                        >
                          {cert.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={cert.imageUrl}
                              alt=""
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="var(--color-blue)"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className="font-[family-name:var(--font-display)] font-semibold text-text-primary group-hover:text-blue transition-colors"
                              style={{ fontSize: "0.95rem" }}
                            >
                              {cert.title}
                            </h4>
                            <span className="text-[8px] font-mono text-blue bg-blue/10 border border-blue/20 px-1.5 py-0.5 rounded tracking-wide shrink-0">
                              SECURE
                            </span>
                          </div>
                          {cert.issuer && (
                            <p
                              className="text-blue/80 font-[family-name:var(--font-mono)] mt-0.5"
                              style={{ fontSize: "0.7rem" }}
                            >
                              $ {cert.issuer}
                            </p>
                          )}
                          {cert.description && (
                            <p
                              className="text-text-secondary mt-1.5"
                              style={{ fontSize: "0.8rem", lineHeight: 1.5 }}
                            >
                              {cert.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                ))}

                {hasMoreCerts && (
                  <button
                    onClick={() => setShowAllCerts(!showAllCerts)}
                    className="w-full py-3 rounded-xl border border-dashed border-blue/20 text-blue text-xs font-[family-name:var(--font-mono)] hover:bg-blue/5 hover:border-blue/40 transition-all"
                  >
                    {showAllCerts
                      ? "Show Less"
                      : `View ${certifications.length - VISIBLE_COUNT} More →`}
                  </button>
                )}
              </div>
            </ScrollReveal>

            {/* Achievements */}
            <ScrollReveal delay={0.2}>
              <h3
                className="font-[family-name:var(--font-mono)] mb-6 flex items-center gap-2 tracking-wider"
                style={{ fontSize: "0.85rem", color: "var(--color-amber)" }}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-5.54 0m5.54 0c.727-.586 1.32-1.317 1.73-2.132M7.73 9.728a6.02 6.02 0 01-1.73-2.132"
                  />
                </svg>
                Achievements
              </h3>

              <div className="space-y-4">
                {visibleAch.map((ach, i) => (
                  <div
                    key={ach.id || i}
                    onClick={() => setSelectedAch(ach)}
                    className="cursor-pointer group"
                  >
                    <TiltCard
                      className="cyber-card-wrapper cyber-card-wrapper-violet"
                      glowColor="violet"
                    >
                      <div className="cyber-card-inner p-5 flex gap-4 items-start">
                        <div
                          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mt-0.5 bg-void/60 border border-border/60 p-1 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)]"
                        >
                          {ach.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={ach.imageUrl}
                              alt=""
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="var(--color-violet)"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className="font-[family-name:var(--font-display)] font-semibold text-text-primary group-hover:text-violet transition-colors"
                              style={{ fontSize: "0.95rem" }}
                            >
                              {ach.title}
                            </h4>
                            <span className="text-[8px] font-mono text-violet bg-violet/10 border border-violet/20 px-1.5 py-0.5 rounded tracking-wide shrink-0">
                              ELITE
                            </span>
                          </div>
                          {ach.org && (
                            <p
                              className="text-violet/85 font-[family-name:var(--font-mono)] mt-0.5"
                              style={{ fontSize: "0.7rem" }}
                            >
                              $ {ach.org}
                            </p>
                          )}
                          {ach.description && (
                            <p
                              className="text-text-secondary mt-1.5"
                              style={{ fontSize: "0.8rem", lineHeight: 1.5 }}
                            >
                              {ach.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                ))}

                {hasMoreAch && (
                  <button
                    onClick={() => setShowAllAch(!showAllAch)}
                    className="w-full py-3 rounded-xl border border-dashed border-violet/20 text-violet text-xs font-[family-name:var(--font-mono)] hover:bg-violet/5 hover:border-violet/40 transition-all"
                  >
                    {showAllAch
                      ? "Show Less"
                      : `View ${achievements.length - VISIBLE_COUNT} More →`}
                  </button>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Unified Detail Modals */}
      <UnifiedDetailModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        title={selectedCert?.title || ""}
        subtitle={selectedCert?.issuer || ""}
        imageUrl={selectedCert?.imageUrl || ""}
        content={selectedCert?.detailedContent || selectedCert?.description || ""}
        accentColor="blue"
      />

      <UnifiedDetailModal
        isOpen={!!selectedAch}
        onClose={() => setSelectedAch(null)}
        title={selectedAch?.title || ""}
        subtitle={selectedAch?.org || ""}
        imageUrl={selectedAch?.imageUrl || ""}
        content={selectedAch?.detailedContent || selectedAch?.description || ""}
        accentColor="violet"
      />
    </>
  );
}
