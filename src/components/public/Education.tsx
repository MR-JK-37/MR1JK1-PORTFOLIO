import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TiltCard } from "@/components/shared/TiltCard";

interface EducationEntry {
  degree: string;
  institution: string;
  years: string;
}

interface EducationProps {
  entries: EducationEntry[];
  extraCurricular?: string[];
}

export function Education({ entries, extraCurricular }: EducationProps) {
  return (
    <section id="education" className="section-padding section-lazy">
      <div className="section-max-width">
        <ScrollReveal>
          <p className="eyebrow mb-3">$ cat /etc/education</p>
          <h2
            className="font-[family-name:var(--font-display)] font-bold mb-12"
            style={{
              fontSize: "clamp(1.75rem, 1.2rem + 2.5vw, 3rem)",
            }}
          >
            Education{" "}
            <span style={{ color: "var(--color-blue)" }}>& More</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Education entries */}
          <div className="space-y-6">
            {entries.map((entry, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <TiltCard
                  className={i % 2 === 0 ? "card" : "card card-violet"}
                  glowColor={i % 2 === 0 ? "blue" : "violet"}
                >
                  <div
                    className="p-6"
                    style={{
                      borderRadius:
                        i % 2 === 0
                          ? "var(--radius-card)"
                          : "var(--radius-card-alt)",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: i % 2 === 0 ? "rgba(69,211,255,0.1)" : "rgba(178,115,255,0.1)",
                          border: i % 2 === 0 ? "1px solid rgba(69,211,255,0.2)" : "1px solid rgba(178,115,255,0.2)",
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke={i % 2 === 0 ? "var(--color-blue)" : "var(--color-violet)"}
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3
                          className="font-[family-name:var(--font-display)] font-semibold text-text-primary"
                          style={{ fontSize: "1rem" }}
                        >
                          {entry.degree}
                        </h3>
                        <p
                          className="text-text-secondary mt-1"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {entry.institution}
                        </p>
                        <span
                          className="chip mt-3 inline-block"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {entry.years}
                        </span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>

          {/* Extra-curricular */}
          {extraCurricular && extraCurricular.length > 0 && (
            <ScrollReveal delay={0.2}>
              <TiltCard className="card card-violet" glowColor="violet">
                <div className="p-6" style={{ borderRadius: "var(--radius-card-alt)" }}>
                  <h3
                    className="font-[family-name:var(--font-mono)] mb-5 flex items-center gap-2"
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
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                      />
                    </svg>
                    Extra-Curricular
                  </h3>

                  <ul className="space-y-3">
                    {extraCurricular.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-text-secondary"
                        style={{ fontSize: "0.9rem", lineHeight: 1.6 }}
                      >
                        <span
                          className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full"
                          style={{ background: "var(--color-amber)" }}
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
