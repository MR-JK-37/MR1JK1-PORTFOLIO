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
      /* Color the keys */
      let colored = line.replace(
        /"([^"]+)":/g,
        '<span style="color: var(--color-blue)">"$1"</span>:'
      );
      /* Color string values */
      colored = colored.replace(
        /: "([^"]+)"/g,
        ': <span style="color: var(--color-amber)">"$1"</span>'
      );
      /* Color brackets */
      colored = colored.replace(
        /(\{|\}|\[|\])/g,
        '<span style="color: var(--color-text-muted)">$1</span>'
      );
      return `<span style="color: var(--color-text-muted); user-select: none; opacity: 0.4; margin-right: 1em">${String(i + 1).padStart(2, " ")}</span>${colored}`;
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
          <p className="eyebrow mb-3">$ whoami</p>
          <h2
            className="font-[family-name:var(--font-display)] font-bold mb-12"
            style={{
              fontSize: "clamp(1.75rem, 1.2rem + 2.5vw, 3rem)",
            }}
          >
            About{" "}
            <span style={{ color: "var(--color-blue)" }}>Me</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Bio text */}
          <ScrollReveal delay={0.1}>
            <p
              className="text-text-secondary leading-relaxed mb-6"
              style={{ fontSize: "clamp(0.95rem, 0.85rem + 0.3vw, 1.1rem)" }}
            >
              {summary}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2 text-text-secondary">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="var(--color-blue)"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span style={{ fontSize: "0.85rem" }}>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="var(--color-violet)"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <span style={{ fontSize: "0.85rem" }}>{profile.email}</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Terminal card */}
          <ScrollReveal delay={0.2}>
            <TiltCard className="card" glowColor="blue">
              <div className="terminal">
                <div className="terminal-header">
                  <div
                    className="terminal-dot"
                    style={{ background: "#ff5f57" }}
                  />
                  <div
                    className="terminal-dot"
                    style={{ background: "#febc2e" }}
                  />
                  <div
                    className="terminal-dot"
                    style={{ background: "#28c840" }}
                  />
                  <span className="text-text-muted ml-2" style={{ fontSize: "0.7rem" }}>
                    profile.json
                  </span>
                </div>
                <div className="terminal-body">
                  <pre
                    dangerouslySetInnerHTML={{ __html: colorizedJson }}
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
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
