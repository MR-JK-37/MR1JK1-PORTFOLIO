import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TiltCard } from "@/components/shared/TiltCard";

interface AboutProps {
  summary: string;
  profile: {
    name: string;
    titles: string[];
    email: string;
    phone: string;
    location: string;
    links: Record<string, string>;
  };
}

export function About({ summary, profile }: AboutProps) {
  const jsonContent = JSON.stringify(
    {
      name: profile.name,
      role: profile.titles[0],
      location: profile.location,
      email: profile.email,
      specialties: profile.titles,
    },
    null,
    2
  );

  const colorizedJson = jsonContent
    .split("\n")
    .map((line, i) => {
      let colored = line.replace(
        /"([^"]+)":/g,
        '<span style="color: var(--color-blue)">"$1"</span>:'
      );
      colored = colored.replace(
        /: "([^"]+)"/g,
        ': <span style="color: var(--color-amber)">"$1"</span>'
      );
      colored = colored.replace(
        /(\{|\}|\[|\])/g,
        '<span style="color: var(--color-text-muted)">$1</span>'
      );
      return `<span style="color: var(--color-text-muted); user-select: none; opacity: 0.35; margin-right: 1.25em; font-size: 0.7em">${String(
        i + 1
      ).padStart(2, " ")}</span>${colored}`;
    })
    .join("\n");

  return (
    <section
      id="about"
      className="section-padding section-lazy"
      style={{ background: "var(--color-panel)" }}
    >
      <div className="section-max-width">
        <ScrollReveal>
          <p className="eyebrow mb-4">$ whoami</p>
          <h2 className="section-heading mb-3">
            About{" "}
            <span className="neon-blue">Me</span>
          </h2>
          <p className="text-text-secondary mb-12" style={{ fontSize: "0.95rem", maxWidth: "440px" }}>
            A brief reconnaissance of the operator behind the terminal.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-start">
          {/* Bio */}
          <ScrollReveal delay={0.1}>
            <div>
              <p
                className="text-text-secondary leading-relaxed mb-8"
                style={{ fontSize: "clamp(0.95rem, 0.85rem + 0.3vw, 1.05rem)", lineHeight: 1.8 }}
              >
                {summary}
              </p>

              {/* Contact cards */}
              <div className="space-y-3">
                {[
                  {
                    label: "location",
                    value: profile.location,
                    color: "amber" as const,
                    icon: (
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    ),
                  },
                  {
                    label: "email",
                    value: profile.email,
                    color: "blue" as const,
                    icon: (
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    ),
                  },
                ].map(({ label, value, color, icon }) => {
                  const c =
                    color === "blue"
                      ? { text: "var(--color-blue)", bg: "rgba(69,211,255,0.07)", border: "rgba(69,211,255,0.18)" }
                      : { text: "var(--color-amber)", bg: "rgba(240,166,58,0.07)", border: "rgba(240,166,58,0.18)" };

                  return (
                    <div
                      key={label}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300"
                      style={{
                        background: c.bg,
                        border: `1px solid ${c.border}`,
                        color: c.text,
                      }}
                    >
                      <span style={{ color: c.text }}>{icon}</span>
                      <div>
                        <p
                          className="font-[family-name:var(--font-mono)] uppercase"
                          style={{ fontSize: "0.6rem", opacity: 0.6, letterSpacing: "0.12em" }}
                        >
                          {label}
                        </p>
                        <p className="text-text-primary" style={{ fontSize: "0.85rem" }}>
                          {value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

          {/* Terminal card */}
          <ScrollReveal delay={0.2}>
            <TiltCard className="card" glowColor="blue" tiltAmount={6}>
              <div className="terminal">
                <div className="terminal-header">
                  <div className="terminal-dot" style={{ background: "#ff5f57", color: "#ff5f57" }} />
                  <div className="terminal-dot" style={{ background: "#febc2e", color: "#febc2e" }} />
                  <div className="terminal-dot" style={{ background: "#28c840", color: "#28c840" }} />
                  <span className="text-text-muted ml-3 blink-cursor" style={{ fontSize: "0.68rem" }}>
                    profile.json
                  </span>
                </div>
                <div className="terminal-body">
                  <pre
                    dangerouslySetInnerHTML={{ __html: colorizedJson }}
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontSize: "0.78rem",
                    }}
                  />
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
