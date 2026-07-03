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

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map(([category, items], catIdx) => (
            <ScrollReveal key={category} delay={catIdx * 0.1}>
              <div>
                <TiltCard
                  className={catIdx % 2 === 0 ? "card" : "card card-violet"}
                  glowColor={catIdx % 2 === 0 ? "blue" : "violet"}
                >
                <div
                  className="p-6"
                  style={{
                    borderRadius:
                      catIdx % 2 === 0
                        ? "var(--radius-card)"
                        : "var(--radius-card-alt)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <h3
                      className="font-[family-name:var(--font-mono)] font-medium"
                      style={{
                        fontSize: "0.8rem",
                        color:
                          catIdx % 2 === 0
                            ? "var(--color-blue)"
                            : "var(--color-violet)",
                      }}
                    >
                      $ {categoryPrefixes[category] || category.toLowerCase().replace(/\s+/g, "_")}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className={
                          catIdx % 2 === 0 ? "chip" : "chip chip-violet"
                        }
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                </TiltCard>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
