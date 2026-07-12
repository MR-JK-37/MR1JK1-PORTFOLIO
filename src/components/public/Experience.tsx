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
      {/* Top edge accent */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(69,211,255,0.25), rgba(178,115,255,0.25), transparent)",
          pointerEvents: "none",
        }}
      />

      <div className="section-max-width">
        <ScrollReveal>
          <p className="eyebrow mb-4">$ history | grep work</p>
          <h2 className="section-heading mb-3">
            Experience{" "}
            <span className="neon-violet">Log</span>
          </h2>
          <p className="text-text-secondary mb-12" style={{ fontSize: "0.95rem", maxWidth: "480px" }}>
            A chronological record of professional engagements.
          </p>
        </ScrollReveal>

        <div className="relative pl-8 md:pl-14">
          {/* Gradient timeline line */}
          <div
            aria-hidden="true"
            className="absolute left-3 md:left-5 top-2 bottom-2 w-[2px] timeline-line rounded-full"
          />

          {entries.map((entry, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div className="relative mb-10 last:mb-0">
                {/* Timeline node */}
                <div
                  aria-hidden="true"
                  className="absolute -left-5 md:-left-9 top-5 flex items-center justify-center"
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 z-10"
                    style={{
                      borderColor: i % 2 === 0 ? "var(--color-blue)" : "var(--color-violet)",
                      background: "var(--color-void)",
                      boxShadow: i % 2 === 0
                        ? "0 0 0 4px rgba(69,211,255,0.08), 0 0 14px rgba(69,211,255,0.5)"
                        : "0 0 0 4px rgba(178,115,255,0.08), 0 0 14px rgba(178,115,255,0.5)",
                    }}
                  />
                </div>

                <TiltCard
                  className={`cyber-card-wrapper ${
                    i % 2 === 0 ? "cyber-card-wrapper-blue" : "cyber-card-wrapper-violet"
                  }`}
                  glowColor={i % 2 === 0 ? "blue" : "violet"}
                  tiltAmount={5}
                >
                  <div className="cyber-card-inner p-6 md:p-8">
                    <div className="cyber-card-corner-bl" />

                    {/* Index label */}
                    <span
                      className="font-[family-name:var(--font-mono)] block mb-3"
                      style={{
                        fontSize: "0.65rem",
                        color: i % 2 === 0 ? "var(--color-blue-dim)" : "var(--color-violet-dim)",
                        letterSpacing: "0.15em",
                      }}
                    >
                      EXP_ENTRY_0{i + 1}
                    </span>

                    {/* Role + dates row */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-5 gap-3">
                      <div className="flex-1">
                        <h3
                          className="font-[family-name:var(--font-display)] font-semibold text-text-primary leading-tight"
                          style={{ fontSize: "1.15rem" }}
                        >
                          {entry.role}
                        </h3>
                        <p
                          className="font-[family-name:var(--font-mono)] mt-1.5 flex items-center gap-2"
                          style={{
                            fontSize: "0.82rem",
                            color: i % 2 === 0 ? "var(--color-blue)" : "var(--color-violet)",
                          }}
                        >
                          <span aria-hidden="true">◈</span>
                          {entry.org}
                        </p>
                      </div>
                      <span
                        className="chip shrink-0 self-start"
                        style={{
                          fontSize: "0.68rem",
                          color: i % 2 === 0 ? "var(--color-blue)" : "var(--color-violet)",
                          background: i % 2 === 0 ? "rgba(69,211,255,0.06)" : "rgba(178,115,255,0.06)",
                          borderColor: i % 2 === 0 ? "rgba(69,211,255,0.22)" : "rgba(178,115,255,0.22)",
                        }}
                      >
                        {entry.dates}
                      </span>
                    </div>

                    {/* Separator */}
                    <hr className="sep-line mb-5" />

                    {/* Bullet points */}
                    <ul className="space-y-3">
                      {entry.bullets.map((bullet, j) => (
                        <li
                          key={j}
                          className="flex gap-3 text-text-secondary"
                          style={{ fontSize: "0.88rem", lineHeight: 1.65 }}
                        >
                          <span
                            className="mt-[0.45rem] shrink-0 w-1.5 h-1.5 rounded-full"
                            style={{
                              background: i % 2 === 0 ? "var(--color-violet)" : "var(--color-blue)",
                              boxShadow: i % 2 === 0
                                ? "0 0 6px rgba(178,115,255,0.6)"
                                : "0 0 6px rgba(69,211,255,0.6)",
                            }}
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
