"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface HeroProps {
  name: string;
  titles: string[];
  summary: string;
  heroDayImage: string;
  heroNightImage: string;
}

export function Hero({
  name,
  titles,
  summary,
  heroDayImage,
  heroNightImage,
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nightLayerRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(0);
  const mousePos = useRef({ x: 50, y: 50 });
  const targetPos = useRef({ x: 50, y: 50 });
  const rafId = useRef<number>(0);
  const prefersReducedMotion = useRef(false);

  /* Title rotation */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [titles.length]);

  /* Check if hint was already shown this session */
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const hintShown = sessionStorage.getItem("hero-hint-shown");
    if (!hintShown && !prefersReducedMotion.current) {
      const timer = setTimeout(() => setShowHint(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const scrollOffset = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      scrollOffset.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Smooth lerp animation loop for cursor tracking */
  useEffect(() => {
    if (prefersReducedMotion.current) return;

    const container = containerRef.current;
    const nightLayer = nightLayerRef.current;
    if (!container || !nightLayer) return;

    function animate() {
      /* Lerp towards target */
      const lerpFactor = 0.08;
      mousePos.current.x +=
        (targetPos.current.x - mousePos.current.x) * lerpFactor;
      mousePos.current.y +=
        (targetPos.current.y - mousePos.current.y) * lerpFactor;

      const x = mousePos.current.x;
      const y = mousePos.current.y;
      const scrollVal = scrollOffset.current;

      const nl = nightLayerRef.current;
      const ct = containerRef.current;

      /* Update mask position on night layer */
      if (nl) {
        nl.style.setProperty("--mouse-x", `${x}%`);
        nl.style.setProperty("--mouse-y", `${y}%`);
      }

      /* 3D parallax on layers — subtle depth differences */
      const offsetX = (x - 50) * 0.3;
      const offsetY = (y - 50) * 0.3;

      if (ct) {
        /* Day image: moves slightly opposite */
        const dayImg = ct.querySelector(
          "[data-layer='day']"
        ) as HTMLElement;
        if (dayImg) {
          dayImg.style.transform = `translate3d(${-offsetX * 0.3}px, ${-offsetY * 0.3 + scrollVal * 0.3}px, 0) scale(1.05)`;
        }

        /* Night image: moves with cursor slightly */
        const nightImg = ct.querySelector(
          "[data-layer='night']"
        ) as HTMLElement;
        if (nightImg) {
          nightImg.style.transform = `translate3d(${offsetX * 0.3}px, ${offsetY * 0.3 + scrollVal * 0.3}px, 0) scale(1.05)`;
        }

        /* Ambient grid: moves more */
        const grid = ct.querySelector(
          "[data-layer='grid']"
        ) as HTMLElement;
        if (grid) {
          grid.style.transform = `translate3d(${offsetX * 0.6}px, ${offsetY * 0.6 + scrollVal * 0.15}px, 0)`;
        }

        /* Content: subtle float */
        const content = ct.querySelector(
          "[data-layer='content']"
        ) as HTMLElement;
        if (content) {
          content.style.transform = `translate3d(${offsetX * 0.15}px, ${offsetY * 0.15 - scrollVal * 0.2}px, 0)`;
        }
      }

      rafId.current = requestAnimationFrame(animate);
    }

    rafId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent | React.TouchEvent) => {
      if (prefersReducedMotion.current) return;
      const container = containerRef.current;
      if (!container) return;

      let clientX: number, clientY: number;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;

      targetPos.current = { x, y };

      /* Activate the reveal */
      const nightLayer = nightLayerRef.current;
      if (nightLayer) {
        nightLayer.style.setProperty("--inner-size", "140px");
        nightLayer.style.setProperty("--outer-size", "220px");
      }

      if (!hasInteracted) {
        setHasInteracted(true);
        setShowHint(false);
        sessionStorage.setItem("hero-hint-shown", "true");
      }
    },
    [hasInteracted]
  );

  const handlePointerLeave = useCallback(() => {
    if (prefersReducedMotion.current) return;
    const nightLayer = nightLayerRef.current;
    if (nightLayer) {
      nightLayer.style.setProperty("--inner-size", "0px");
      nightLayer.style.setProperty("--outer-size", "0px");
    }
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-dvh overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handlePointerMove as unknown as React.TouchEventHandler}
      style={{ perspective: "1000px" }}
    >
      {/* Layer 0: Ambient dot grid + glow */}
      <div
        data-layer="grid"
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(69,211,255,0.06) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(178,115,255,0.06) 0%, transparent 50%),
            radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 24px 24px",
          backgroundPosition: "center, center, center",
        }}
      />

      {/* Layer 1: Day image (analyst mode — default visible) */}
      <div
        data-layer="day"
        className="absolute inset-0"
        style={{ willChange: "transform" }}
      >
        <Image
          src={heroDayImage}
          alt="Jaikiran E — analyst mode at a desk with dual monitors"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />
        {/* Blue overlay tint */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(7,10,15,0.3), rgba(7,10,15,0.7))",
          }}
        />
      </div>

      {/* Layer 2: Night image (exploit mode — masked to cursor) */}
      <div
        ref={nightLayerRef}
        data-layer="night"
        className="absolute inset-0 pointer-events-none"
        style={{
          willChange: "mask-image, -webkit-mask-image",
          maskImage: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black var(--inner-size, 0px), transparent var(--outer-size, 0px))`,
          WebkitMaskImage: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black var(--inner-size, 0px), transparent var(--outer-size, 0px))`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          transition:
            "--inner-size 0.4s cubic-bezier(0.22, 0.61, 0.36, 1), --outer-size 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)",
          animation:
            !hasInteracted && !prefersReducedMotion.current
              ? "idle-sweep 4s ease-in-out 2s 1 both"
              : "none",
        }}
      >
        <Image
          src={heroNightImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />
        {/* Violet overlay tint */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(7,10,15,0.2), rgba(7,10,15,0.6))",
          }}
        />
      </div>

      {/* Layer 3: Content overlay */}
      <div
        data-layer="content"
        className="absolute inset-x-0 bottom-0 z-10 w-full max-w-7xl mx-auto px-8 md:px-24 lg:px-32 pb-16 md:pb-24 text-left flex flex-col items-start justify-end"
        style={{ willChange: "transform", height: "100%" }}
      >
        {/* Giant outline background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden opacity-10">
          <div className="poster-stroke-text text-[15vw] md:text-[18vw] whitespace-nowrap tracking-tighter font-black select-none uppercase">
            JAIKIRAN
          </div>
        </div>

        <div className="max-w-xl md:max-w-md lg:max-w-lg z-10 flex flex-col items-start relative mb-4">
          {/* Monospace eyebrow */}
          <p
            className="eyebrow mb-3 tracking-widest"
            style={{ fontSize: "0.75rem" }}
          >
            {"// "}
            <span className="text-violet font-semibold">MR!JK!</span>
            {" — "}
            <span className="text-blue font-semibold">CYBER SECURITY</span>
          </p>

          {/* Name & Cursive Accent Font Pairing */}
          <div className="relative mb-3">
            <h1
              className="font-[family-name:var(--font-display)] font-black tracking-tighter cursor-default text-text-primary uppercase"
              style={{
                fontSize: "clamp(3.2rem, 2.2rem + 6.5vw, 6.8rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
              }}
            >
              Jaikiran
            </h1>
            <span
              className="font-[family-name:var(--font-accent)] text-violet absolute -bottom-8 -right-8 text-8xl md:text-11xl rotate-[-15deg] pointer-events-none select-none opacity-95 drop-shadow-[0_0_15px_rgba(255,145,0,0.6)]"
            >
              E
            </span>
          </div>

          {/* Rotating title */}
          <div className="h-6 overflow-hidden mb-4 mt-2">
            <p
              className="font-[family-name:var(--font-mono)] text-text-secondary transition-all duration-500"
              style={{
                fontSize: "clamp(0.8rem, 0.7rem + 0.6vw, 1.05rem)",
              }}
              key={currentTitle}
            >
              {">"} {titles[currentTitle]}
              <span className="animate-pulse ml-1 text-blue">▊</span>
            </p>
          </div>

          {/* Summary */}
          <p
            className="text-text-secondary mb-6 leading-relaxed"
            style={{ fontSize: "clamp(0.85rem, 0.8rem + 0.25vw, 0.95rem)" }}
          >
            {summary.length > 150 ? summary.slice(0, 150) + "..." : summary}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-start">
            <a href="#projects" className="skeuo-btn-primary">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              View Projects
            </a>
            <a href="#contact" className="skeuo-btn-secondary">
              Contact Me
            </a>
          </div>
        </div>

        {/* Right side social links stack - placed bottom-right matching left side */}
        <div className="absolute right-8 md:right-24 lg:right-32 bottom-16 md:bottom-24 hidden md:flex flex-col gap-5 items-end z-10">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-mono)] text-xs text-text-secondary hover:text-blue transition-colors tracking-widest uppercase py-1"
          >
            GitHub ↗
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-mono)] text-xs text-text-secondary hover:text-blue transition-colors tracking-widest uppercase py-1"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://tryhackme.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-mono)] text-xs text-text-secondary hover:text-blue transition-colors tracking-widest uppercase py-1"
          >
            TryHackMe ↗
          </a>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          aria-hidden="true"
        >
          <span
            className="text-text-muted font-[family-name:var(--font-mono)]"
            style={{ fontSize: "0.65rem" }}
          >
            scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-text-muted/30 flex items-start justify-center p-1">
            <div
              className="w-1 h-2 rounded-full bg-blue"
              style={{
                animation: "fadeInUp 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Cursor reveal hint */}
      {showHint && (
        <div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 font-[family-name:var(--font-mono)] text-text-muted pointer-events-none"
          style={{
            fontSize: "0.7rem",
            animation: "fadeInUp 0.5s ease both",
            opacity: 0.7,
          }}
        >
          {"// move your cursor — analyst mode is hiding something"}
        </div>
      )}
    </section>
  );
}
