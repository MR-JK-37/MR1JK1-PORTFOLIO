"use client";

import { useRouter } from "next/navigation";

interface FooterProps {
  name: string;
  links?: Record<string, string>;
}

export function Footer({ name, links }: FooterProps) {
  const router = useRouter();

  return (
    <footer
      className="relative py-10 px-6"
      style={{
        background: "var(--color-void)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Top accent gradient */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent 5%, rgba(69,211,255,0.2) 30%, rgba(178,115,255,0.2) 70%, transparent 95%)",
        }}
      />

      <div className="section-max-width flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Left: brand + copyright */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span
            className="font-[family-name:var(--font-display)] font-bold text-sm tracking-tight"
            style={{
              background: "linear-gradient(135deg, var(--color-blue), var(--color-violet))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            MR!JK!
          </span>
          <p
            className="text-text-muted font-[family-name:var(--font-mono)]"
            style={{ fontSize: "0.68rem", letterSpacing: "0.05em" }}
          >
            © {new Date().getFullYear()} {name} &mdash; Built with purpose.
          </p>
        </div>

        {/* Center: status */}
        <div className="flex items-center gap-2">
          <span className="status-dot" aria-hidden="true" />
          <span
            className="font-[family-name:var(--font-mono)] text-text-muted"
            style={{ fontSize: "0.65rem", letterSpacing: "0.1em" }}
          >
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>

        {/* Right: social icons */}
        <div className="flex items-center gap-5">
          {links?.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-text-muted hover:text-blue transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
          {links?.linkedin && (
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-text-muted hover:text-blue transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Hidden admin trigger */}
      <button
        onClick={() => router.push("/admin")}
        aria-label="Site administration"
        className="absolute bottom-3 right-3 w-[3px] h-[3px] rounded-full border-none p-0 bg-text-muted"
        style={{ opacity: 0.15, cursor: "default", outline: "none" }}
        tabIndex={0}
        onFocus={(e) => {
          e.currentTarget.style.outline = "2px solid var(--color-blue)";
          e.currentTarget.style.outlineOffset = "4px";
          e.currentTarget.style.opacity = "0.5";
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none";
          e.currentTarget.style.opacity = "0.15";
        }}
      />
    </footer>
  );
}
