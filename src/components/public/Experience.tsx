import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TiltCard } from "@/components/shared/TiltCard";

interface ExperienceEntry {
  role: string;
  org: string;
  dates: string;
  bullets: string[];
}

interface ExperienceProps {
  entries: ExperienceEntry[];
}

export function Experience({ entries }: ExperienceProps) {
  return (
    <section
      id="experience"
      className="section-padding section-lazy"
      style={{ background: "var(--color-panel)" }}
    >
      <div className="section-max-width">
        <ScrollReveal>
          <p className="eyebrow mb-3">$ history | grep work</p>
          <h2
            className="font-[family-name:var(--font-display)] font-bold mb-12"
            style={{
              fontSize: "clamp(1.75rem, 1.2rem + 2.5vw, 3rem)",
            }}
          >
            Experience{" "}
            <span style={{ color: "var(--color-blue)" }}>Log</span>
          </h2>
        </ScrollReveal>

        <div className="relative pl-8 md:pl-12">
          {/* Timeline line */}
          <div
            aria-hidden="true"
            className="absolute left-3 md:left-5 top-0 bottom-0 w-[2px]"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-blue), var(--color-violet), transparent)",
            }}
          />

          {entries.map((entry, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div className="relative mb-12 last:mb-0">
                {/* Timeline dot */}
                <div
                  aria-hidden="true"
                  className="absolute -left-5 md:-left-7 top-1 w-4 h-4 rounded-full border-2"
                  style={{
                    borderColor: i % 2 === 0 ? "var(--color-blue)" : "var(--color-violet)",
                    background: "var(--color-void)",
                    boxShadow: i % 2 === 0 ? "0 0 12px rgba(69,211,255,0.4)" : "0 0 12px rgba(178,115,255,0.4)",
                  }}
                />

                <TiltCard
                  className={`cyber-card-wrapper ${
                    i % 2 === 0 ? "cyber-card-wrapper-blue" : "cyber-card-wrapper-violet"
                  }`}
                  glowColor={i % 2 === 0 ? "blue" : "violet"}
                >
                  <div className="cyber-card-inner p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <div>
                        <h3
                          className="font-[family-name:var(--font-display)] font-semibold text-text-primary"
                          style={{ fontSize: "1.15rem" }}
                        >
                          {entry.role}
                        </h3>
                        <p
                          className="font-[family-name:var(--font-mono)] mt-1"
                          style={{
                            fontSize: "0.8rem",
                            color: i % 2 === 0 ? "var(--color-blue)" : "var(--color-violet)",
                          }}
                        >
                          {entry.org}
                        </p>
                      </div>
                      <span
                        className="chip shrink-0"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {entry.dates}
                      </span>
                    </div>

                    <ul className="space-y-3">
                      {entry.bullets.map((bullet, j) => (
                        <li
                          key={j}
                          className="flex gap-3 text-text-secondary"
                          style={{ fontSize: "0.9rem", lineHeight: 1.6 }}
                        >
                          <span
                            className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full"
                            style={{ background: i % 2 === 0 ? "var(--color-violet)" : "var(--color-blue)" }}
                            aria-hidden="true"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
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
