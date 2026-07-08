"use client";

import { useState, useEffect } from "react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TiltCard } from "@/components/shared/TiltCard";

interface SkillsProps {
  skills: Record<string, string[]>;
}

const categoryPrefixes: Record<string, string> = {
  "Security Tools": "security_tools",
  Programming: "programming",
  "OS / Platforms": "os_platforms",
  "Focus Areas": "focus_areas",
};

export function Skills({ skills }: SkillsProps) {
  const categories = Object.entries(skills);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="skills" className="section-padding section-lazy">
      <div className="section-max-width">
        <ScrollReveal>
          <p className="eyebrow mb-3">$ cat skills.conf</p>
          <h2
            className="font-[family-name:var(--font-display)] font-bold mb-12"
            style={{
              fontSize: "clamp(1.75rem, 1.2rem + 2.5vw, 3rem)",
            }}
          >
            Technical{" "}
            <span style={{ color: "var(--color-violet)" }}>Arsenal</span>
          </h2>
        </ScrollReveal>

        {/* Asymmetric hacker terminal style layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map(([category, items], catIdx) => {
            const isFeatured = category === "Security Tools";
            const glowColor = isFeatured ? "blue" : catIdx % 2 === 0 ? "blue" : "violet";

            return (
              <div
                key={category}
                className={isFeatured ? "md:col-span-2" : "col-span-1"}
              >
                <ScrollReveal delay={catIdx * 0.1}>
                  <TiltCard
                    className={`cyber-card-wrapper ${
                      isFeatured
                        ? "cyber-card-wrapper-blue shadow-[0_0_30px_rgba(69,211,255,0.05)]"
                        : catIdx % 2 === 0
                        ? "cyber-card-wrapper-blue"
                        : "cyber-card-wrapper-violet"
                    }`}
                    glowColor={glowColor}
                  >
                    <div className="cyber-card-inner p-6 md:p-8">
                      {/* Header with terminal line */}
                      <div className="flex items-center justify-between mb-6 border-b border-border/40 pb-3">
                        <div className="flex items-center gap-2">
                          {isFeatured ? (
                            <svg
                              width="16"
                              height="16"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="var(--color-blue)"
                              strokeWidth="2"
                              className="animate-pulse"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z"
                              />
                            </svg>
                          ) : (
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor:
                                  catIdx % 2 === 0
                                    ? "var(--color-blue)"
                                    : "var(--color-violet)",
                              }}
                            />
                          )}
                          <h3
                            className="font-[family-name:var(--font-mono)] font-bold tracking-wider uppercase text-xs"
                            style={{
                              color: isFeatured
                                ? "var(--color-blue)"
                                : catIdx % 2 === 0
                                ? "var(--color-blue)"
                                : "var(--color-violet)",
                            }}
                          >
                            $ {categoryPrefixes[category] || category.toLowerCase().replace(/\s+/g, "_")}
                          </h3>
                        </div>

                        {isFeatured ? (
                          <span className="text-[8px] font-mono text-blue bg-blue/15 px-2 py-0.5 border border-blue/20 rounded">
                            SYSTEM_CORE_LEVEL_1
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono text-text-muted">
                            SEC_CONF
                          </span>
                        )}
                      </div>

                      {/* Tactile staggered pill list */}
                      <div className="flex flex-wrap gap-2.5">
                        {items.map((skill, idx) => (
                          <span
                            key={skill}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 ${
                              isFeatured
                                ? "bg-gradient-to-r from-blue/10 to-blue/5 border border-blue/20 text-text-primary hover:border-blue hover:text-white hover:shadow-[0_0_15px_rgba(69,211,255,0.2)]"
                                : catIdx % 2 === 0
                                ? "bg-panel-light/60 border border-border/80 text-text-secondary hover:border-blue/40 hover:text-blue hover:shadow-[0_0_10px_rgba(69,211,255,0.1)]"
                                : "bg-panel-light/60 border border-border/80 text-text-secondary hover:border-violet/40 hover:text-violet hover:shadow-[0_0_10px_rgba(178,115,255,0.1)]"
                            } cursor-default`}
                            style={{
                              transform: `translateY(${idx % 2 === 0 ? "1px" : "-1px"})`,
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
