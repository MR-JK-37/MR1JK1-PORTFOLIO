"use client";

import { useState, useEffect } from "react";
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

export function Projects({ projects }: ProjectsProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="projects" className="section-padding section-lazy">
      <div className="section-max-width">
        <ScrollReveal>
          <p className="eyebrow mb-3">$ ls -la ./projects</p>
          <h2
            className="font-[family-name:var(--font-display)] font-bold mb-12"
            style={{
              fontSize: "clamp(1.75rem, 1.2rem + 2.5vw, 3rem)",
            }}
          >
            Featured{" "}
            <span style={{ color: "var(--color-violet)" }}>Projects</span>
          </h2>
        </ScrollReveal>

        {/* Asymmetric grid */}
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          }}
        >
          {projects.map((project, i) => (
            <ScrollReveal
              key={i}
              delay={i * 0.1}
              className={i === 0 ? "col-span-full" : ""}
            >
              <div className="h-full">
                <TiltCard
                  className={i % 2 === 0 ? "card h-full" : "card card-violet h-full"}
                  glowColor={i % 2 === 0 ? "blue" : "violet"}
                >
                <div
                  className="p-6 md:p-8 h-full flex flex-col"
                  style={{
                    borderRadius:
                      i % 2 === 0
                        ? "var(--radius-card)"
                        : "var(--radius-card-alt)",
                  }}
                >
                  {/* Project number */}
                  <span
                    className="font-[family-name:var(--font-mono)] mb-3 block"
                    style={{
                      fontSize: "0.7rem",
                      color:
                        i % 2 === 0
                          ? "var(--color-blue-dim)"
                          : "var(--color-violet-dim)",
                    }}
                  >
                    project_0{i + 1}
                  </span>

                  {/* Title */}
                  <h3
                    className="font-[family-name:var(--font-display)] font-semibold mb-3"
                    style={{
                      fontSize: i === 0 ? "1.4rem" : "1.15rem",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-text-secondary mb-6 flex-grow"
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className={
                          i % 2 === 0 ? "chip" : "chip chip-violet"
                        }
                        style={{ fontSize: "0.65rem" }}
                      >
                        {tech}
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
