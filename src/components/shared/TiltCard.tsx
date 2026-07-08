"use client";

import { useRef, useCallback, ReactNode, MouseEvent } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glowColor?: "blue" | "violet" | "amber";
  scale?: number;
}

export function TiltCard({
  children,
  className = "",
  tiltAmount = 8,
  glowColor = "blue",
  scale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * tiltAmount;
      const rotateY = (x - 0.5) * tiltAmount;

      cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

      /* Position the glow */
      cardRef.current.style.setProperty("--glow-x", `${x * 100}%`);
      cardRef.current.style.setProperty("--glow-y", `${y * 100}%`);
      cardRef.current.style.setProperty("--glow-opacity", "1");
    },
    [tiltAmount, scale]
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    cardRef.current.style.setProperty("--glow-opacity", "0");
  }, []);

  const glowGradient =
    glowColor === "blue"
      ? "radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(69,211,255,0.12), transparent 60%)"
      : glowColor === "violet"
      ? "radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(178,115,255,0.12), transparent 60%)"
      : "radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(240,166,58,0.12), transparent 60%)";

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: glowGradient,
          opacity: "var(--glow-opacity, 0)",
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
          zIndex: 1,
          borderRadius: "inherit",
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}
