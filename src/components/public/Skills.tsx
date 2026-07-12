"use client";

import { useState, useEffect } from "react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TiltCard } from "@/components/shared/TiltCard";

interface SkillsProps {
  skills: Record<string, string[]>;
}

const categoryMeta: Record<
  string,
  { prefix: string; icon: React.ReactNode; color: "blue" | "violet" | "amber" }
> = {
  "Security Tools":  {
    prefix: "security_tools",
    color: "blue",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    )
  },
  Programming:       {
    prefix: "programming",
    color: "violet",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
        <line x1="14" y1="4" x2="10" y2="20"/>
      </svg>
    )
  },
  "OS / Platforms":  {
    prefix: "os_platforms",
    color: "blue",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="2" y1="20" x2="22" y2="20"/>
        <line x1="12" y1="17" x2="12" y2="20"/>
      </svg>
    )
  },
  "Focus Areas":     {
    prefix: "focus_areas",
    color: "violet",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    )
  },
};

const colorMap = {
  blue:   { text: "var(--color-blue)",   bg: "rgba(69,211,255,0.08)",   border: "rgba(69,211,255,0.22)",   hoverBorder: "rgba(69,211,255,0.55)",   glow: "rgba(69,211,255,0.18)"   },
  violet: { text: "var(--color-violet)", bg: "rgba(178,115,255,0.08)",  border: "rgba(178,115,255,0.22)",  hoverBorder: "rgba(178,115,255,0.55)",  glow: "rgba(178,115,255,0.18)"  },
  amber:  { text: "var(--color-amber)",  bg: "rgba(240,166,58,0.08)",   border: "rgba(240,166,58,0.22)",   hoverBorder: "rgba(240,166,58,0.55)",   glow: "rgba(240,166,58,0.18)"   },
};

export function Skills({ skills }: SkillsProps) {
  const categories = Object.entries(skills);

  return (
    <section id="skills" className="section-padding section-lazy">
      <div className="section-max-width">
        <ScrollReveal>
          <p className="eyebrow mb-4">$ cat skills.conf</p>
          <h2 className="section-heading mb-3">
            Technical{" "}
            <span className="neon-violet">Arsenal</span>
          </h2>
          <p className="text-text-secondary mb-12" style={{ fontSize: "0.95rem", maxWidth: "520px" }}>
            Tools and technologies I wield in the field.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(([category, items], catIdx) => {
            const meta = categoryMeta[category] ?? {
              prefix: category.toLowerCase().replace(/\s+/g, "_"),
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                  <polyline points="2 17 12 22 22 17"/>
                  <polyline points="2 12 12 17 22 12"/>
                </svg>
              ),
              color: catIdx % 2 === 0 ? "blue" : "violet",
            };
            const isFeatured = category === "Security Tools";
            const col = colorMap[meta.color];
            const wrapperClass = `cyber-card-wrapper cyber-card-wrapper-${meta.color}${
              isFeatured ? " shadow-[0_0_40px_rgba(69,211,255,0.06)]" : ""
            }`;

            return (
              <div
                key={category}
                className={isFeatured ? "md:col-span-2" : "col-span-1"}
              >
                <ScrollReveal delay={catIdx * 0.1}>
                  <TiltCard className={wrapperClass} glowColor={meta.color} tiltAmount={6}>
                    <div className="cyber-card-inner p-6 md:p-8">
                      {/* Bottom-left corner accent */}
                      <div className="cyber-card-corner-bl" />

                      {/* Header */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30">
                        <div className="flex items-center gap-3">
                          <span
                            className="flex items-center justify-center w-9 h-9 rounded-lg border backdrop-blur-md"
                            aria-hidden="true"
                            style={{
                              borderColor: col.border,
                              background: col.bg,
                              color: col.text,
                              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 8px ${col.glow}`,
                            }}
                          >
                            {meta.icon}
                          </span>
                          <div>
                            <h3
                              className="font-[family-name:var(--font-mono)] font-bold tracking-wider uppercase text-xs"
                              style={{ color: col.text }}
                            >
                              $ {meta.prefix}
                            </h3>
                            <p
                              className="text-text-muted font-[family-name:var(--font-mono)]"
                              style={{ fontSize: "0.6rem", marginTop: "2px" }}
                            >
                              {items.length} modules loaded
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isFeatured && (
                            <span className="backlit-indicator backlit-indicator-active text-[8px] tracking-wider uppercase">
                              ACTIVE
                            </span>
                          )}
                          <span
                            className="font-mono text-[9px] px-2 py-0.5 rounded border"
                            style={{
                              color: "var(--color-text-muted)",
                              borderColor: "var(--color-border)",
                              background: "rgba(255,255,255,0.02)",
                            }}
                          >
                            SEC_CONF
                          </span>
                        </div>
                      </div>

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill, idx) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-250 cursor-default group/skill"
                            style={{
                              background: col.bg,
                              border: `1px solid ${col.border}`,
                              color: "var(--color-text-secondary)",
                              transform: `translateY(${idx % 2 === 0 ? "1px" : "-1px"})`,
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.borderColor = col.hoverBorder;
                              (e.currentTarget as HTMLElement).style.color = col.text;
                              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 14px ${col.glow}`;
                              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.borderColor = col.border;
                              (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                              (e.currentTarget as HTMLElement).style.boxShadow = "none";
                              (e.currentTarget as HTMLElement).style.transform = `translateY(${idx % 2 === 0 ? "1px" : "-1px"})`;
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
