"use client";

import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TiltCard } from "@/components/shared/TiltCard";

interface Project {
  title: string;
  description: string;
  stack: string[];
}

interface ProjectsProps {
  projects: Project[];
}

const colors: Array<"blue" | "violet" | "amber"> = ["blue", "violet", "amber", "blue", "violet"];

export function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="section-padding section-lazy">
      <div className="section-max-width">
        <ScrollReveal>
          <p className="eyebrow mb-4">$ ls -la ./projects</p>
          <h2 className="section-heading mb-3">
            Featured{" "}
            <span className="neon-violet">Projects</span>
          </h2>
          <p className="text-text-secondary mb-12" style={{ fontSize: "0.95rem", maxWidth: "480px" }}>
            Security research and engineering work, in the field.
          </p>
        </ScrollReveal>

        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          }}
        >
          {projects.map((project, i) => {
            const color = colors[i % colors.length];
            const colorText =
              color === "blue" ? "var(--color-blue)"
              : color === "violet" ? "var(--color-violet)"
              : "var(--color-amber)";
            const colorDim =
              color === "blue" ? "var(--color-blue-dim)"
              : color === "violet" ? "var(--color-violet-dim)"
              : "var(--color-amber-dim)";

            return (
              <ScrollReveal
                key={i}
                delay={i * 0.09}
                className={i === 0 ? "col-span-full" : ""}
              >
                <TiltCard
                  className={`cyber-card-wrapper cyber-card-wrapper-${color} h-full`}
                  glowColor={color}
                  tiltAmount={i === 0 ? 5 : 8}
                >
                  <div className="cyber-card-inner p-6 md:p-8 h-full flex flex-col">
                    <div className="cyber-card-corner-bl" />

                    {/* Project header row */}
                    <div className="flex items-start justify-between mb-4 gap-4">
                      {/* Project number */}
                      <span
                        className="font-[family-name:var(--font-mono)] shrink-0"
                        style={{
                          fontSize: "0.65rem",
                          color: colorDim,
                          letterSpacing: "0.15em",
                          paddingTop: "2px",
                        }}
                      >
                        project_0{i + 1}
                      </span>

                      {/* Stack count badge */}
                      <span
                        className="font-mono text-[9px] px-2 py-0.5 rounded border shrink-0"
                        style={{
                          color: colorText,
                          background: `rgba(${color === "blue" ? "69,211,255" : color === "violet" ? "178,115,255" : "240,166,58"},0.06)`,
                          borderColor: `rgba(${color === "blue" ? "69,211,255" : color === "violet" ? "178,115,255" : "240,166,58"},0.2)`,
                        }}
                      >
                        {project.stack.length} deps
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-[family-name:var(--font-display)] font-semibold mb-3 leading-snug"
                      style={{
                        fontSize: i === 0 ? "1.4rem" : "1.1rem",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {project.title}
                    </h3>

                    {/* Separator */}
                    <hr className="sep-line mb-4" />

                    {/* Description */}
                    <p
                      className="text-text-secondary mb-6 flex-grow"
                      style={{ fontSize: "0.88rem", lineHeight: 1.7 }}
                    >
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className={color === "violet" ? "chip chip-violet" : color === "amber" ? "chip chip-amber" : "chip"}
                          style={{ fontSize: "0.65rem" }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
