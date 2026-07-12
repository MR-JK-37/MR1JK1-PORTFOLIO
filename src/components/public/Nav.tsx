"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface NavProps {
  links?: { github?: string; linkedin?: string; tryhackme?: string };
  forceVisible?: boolean; // When true (e.g. /memories page), skip scroll-gate
}

const sections = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Nav({ links, forceVisible }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [memoriesVisible, setMemoriesVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Scrollspy for sections
      if (forceVisible) return; // No scrollspy on /memories page

      const scrollPos = window.scrollY + 300;
      let currentActive = "";
      sections.forEach((s) => {
        const el = document.querySelector(s.href);
        if (el) {
          const top = (el as HTMLElement).offsetTop;
          const height = (el as HTMLElement).offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            currentActive = s.href;
          }
        }
      });
      if (currentActive) {
        setActiveSection(currentActive);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceVisible]);

  // IntersectionObserver for footer to reveal "Memories" nav item
  useEffect(() => {
    if (forceVisible) {
      setMemoriesVisible(true);
      return;
    }

    const footer = document.querySelector("footer");
    if (!footer) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMemoriesVisible(true);
        }
      },
      { threshold: 0.8 } // 80% of footer visible
    );

    observerRef.current.observe(footer);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [forceVisible]);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const allNavItems = forceVisible
    ? [{ label: "← Home", href: "/" }, { label: "Memories", href: "/memories" }]
    : sections;

  return (
    <>
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 rounded-full ${
          scrolled || forceVisible
            ? "top-3 w-[90%] max-w-5xl h-12 px-6 border border-white/5 border-t-white/12 border-b-black/50 bg-gradient-to-b from-panel-light to-panel backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
            : "top-6 w-[95%] max-w-6xl h-16 px-8 border border-transparent bg-transparent shadow-none backdrop-blur-none"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] font-bold text-lg tracking-tight group"
          >
            <span className="text-text-primary group-hover:text-blue transition-colors duration-200">
              MR
            </span>
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--color-blue), var(--color-violet))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              !JK!
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-4">
            {allNavItems.map((s) => {
              const isActive = activeSection === s.href;
              const isExternal = s.href.startsWith("/");
              return isExternal ? (
                <Link
                  key={s.href}
                  href={s.href}
                  className="relative px-3 py-1.5 rounded-lg text-xs font-[family-name:var(--font-mono)] tracking-wider uppercase transition-colors duration-300 text-text-secondary hover:text-text-primary"
                >
                  {s.label}
                </Link>
              ) : (
                <a
                  key={s.href}
                  href={s.href}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-[family-name:var(--font-mono)] tracking-wider uppercase transition-all duration-300 ${isActive ? "text-blue skeuo-nav-active font-semibold" : "text-text-secondary hover:text-text-primary hover:bg-white/3"}`}
                >
                  {s.label}
                </a>
              );
            })}

            {/* Memories — scroll-gated */}
            {!forceVisible && (
              <Link
                href="/memories"
                className={`relative pb-1 text-xs font-[family-name:var(--font-mono)] tracking-wider uppercase transition-all duration-500 ${
                  memoriesVisible
                    ? "opacity-100 translate-x-0 text-amber hover:text-amber/80"
                    : "opacity-0 translate-x-4 pointer-events-none"
                }`}
                style={{
                  textShadow: memoriesVisible
                    ? "0 0 20px rgba(240,166,58,0.3)"
                    : "none",
                }}
              >
                Memories ✦
              </Link>
            )}

            {/* Social icons */}
            {links?.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="text-text-muted hover:text-blue transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
            {links?.linkedin && (
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="text-text-muted hover:text-blue transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={`w-5 h-[2px] bg-text-primary transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-[5px]" : ""
              }`}
            />
            <span
              className={`w-5 h-[2px] bg-text-primary transition-all duration-300 ${
                mobileOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`w-5 h-[2px] bg-text-primary transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay with clip-path wipe */}
      <div
        className={`fixed inset-0 z-[99] md:hidden transition-all duration-500 ${
          mobileOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
        style={{
          clipPath: mobileOpen
            ? "circle(150% at calc(100% - 2.5rem) 2rem)"
            : "circle(0% at calc(100% - 2.5rem) 2rem)",
          transition: "clip-path 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <div className="absolute inset-0 bg-void/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          {sections.map((s, i) => (
            <a
              key={s.href}
              href={s.href}
              onClick={handleNavClick}
              className="text-2xl font-[family-name:var(--font-display)] font-semibold text-text-primary hover:text-blue transition-colors"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition: `opacity 0.3s ease ${i * 0.08 + 0.2}s, transform 0.3s ease ${i * 0.08 + 0.2}s`,
              }}
            >
              <span className="text-blue font-[family-name:var(--font-mono)] text-sm mr-3">
                0{i + 1}.
              </span>
              {s.label}
            </a>
          ))}

          {/* Memories link in mobile menu — only visible when scroll-gated */}
          {memoriesVisible && (
            <Link
              href="/memories"
              onClick={handleNavClick}
              className="text-2xl font-[family-name:var(--font-display)] font-semibold text-amber hover:text-amber/80 transition-colors"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.3s ease ${sections.length * 0.08 + 0.2}s, transform 0.3s ease ${sections.length * 0.08 + 0.2}s`,
              }}
            >
              <span className="text-amber font-[family-name:var(--font-mono)] text-sm mr-3">
                ✦
              </span>
              Memories
            </Link>
          )}

          {/* Social row */}
          <div
            className="flex gap-6 mt-4"
            style={{
              opacity: mobileOpen ? 1 : 0,
              transition: "opacity 0.3s ease 0.6s",
            }}
          >
            {links?.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="text-text-muted hover:text-blue transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
            {links?.linkedin && (
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="text-text-muted hover:text-blue transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
