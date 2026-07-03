import { CountUp } from "@/components/shared/CountUp";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TiltCard } from "@/components/shared/TiltCard";

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

interface StatStripProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  { value: 8, suffix: "th", label: "@ DEFCON CTF" },
  { value: 3, label: "Certifications" },
  { value: 26, suffix: "th", label: "of 300+ TN Police CTF" },
  { value: 5, suffix: "+", label: "Security Projects" },
];

export function StatStrip({ stats = defaultStats }: StatStripProps) {
  // Render stats duplicated 3 times for a seamless infinite scroll loop
  const marqueeStats = [...stats, ...stats, ...stats];

  return (
    <section
      className="relative py-8 md:py-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--color-panel) 0%, var(--color-void) 50%, var(--color-panel) 100%)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 25% 50%, rgba(69,211,255,0.03), transparent 60%), radial-gradient(ellipse at 75% 50%, rgba(178,115,255,0.03), transparent 60%)",
        }}
      />

      <div className="marquee-container w-full max-w-7xl mx-auto px-6 overflow-hidden">
        <div className="marquee-content flex gap-8 py-3">
          {marqueeStats.map((stat, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i} className="w-[280px] shrink-0">
                <TiltCard
                  className={isEven ? "card h-full" : "card card-violet h-full"}
                  glowColor={isEven ? "blue" : "violet"}
                >
                  <div
                    className="p-6 text-center h-full"
                    style={{
                      borderRadius: isEven ? "var(--radius-card)" : "var(--radius-card-alt)",
                    }}
                  >
                    <div
                      className="font-[family-name:var(--font-mono)] font-bold mb-2"
                      style={{
                        fontSize: "clamp(1.75rem, 1.5rem + 1vw, 2.5rem)",
                        color: isEven ? "var(--color-blue)" : "var(--color-violet)",
                      }}
                    >
                      <CountUp
                        end={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    </div>
                    <p
                      className="font-[family-name:var(--font-mono)] text-text-secondary"
                      style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
