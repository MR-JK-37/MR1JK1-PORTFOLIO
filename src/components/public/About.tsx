"use client";

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
            <span className="neon-violet">Me</span>
          </h2>
          <p className="text-text-secondary mb-12" style={{ fontSize: "0.95rem", maxWidth: "440px" }}>
            A brief reconnaissance of the operator behind the terminal.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          {/* Bio */}
          <ScrollReveal delay={0.1}>
            <div>
              <p
                className="text-text-secondary leading-relaxed"
                style={{ fontSize: "clamp(0.95rem, 0.85rem + 0.3vw, 1.05rem)", lineHeight: 1.8 }}
              >
                {summary}
              </p>
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
