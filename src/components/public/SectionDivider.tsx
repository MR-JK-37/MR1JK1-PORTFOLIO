interface SectionDividerProps {
  variant?: 1 | 2 | 3 | 4 | 5;
  flip?: boolean;
  className?: string;
  fromColor?: string;
  toColor?: string;
}

export function SectionDivider({
  variant = 1,
  flip = false,
  className = "",
  fromColor = "var(--color-void)",
  toColor = "var(--color-panel)",
}: SectionDividerProps) {
  const paths: Record<number, string> = {
    1: "M0,64 C320,128 640,0 960,64 C1280,128 1600,32 1920,80 L1920,160 L0,160 Z",
    2: "M0,96 C240,32 480,128 720,80 C960,32 1200,112 1440,64 C1680,16 1920,96 1920,96 L1920,160 L0,160 Z",
    3: "M0,80 C160,120 320,40 480,80 C640,120 800,48 960,80 C1120,112 1280,48 1440,80 C1600,112 1760,56 1920,80 L1920,160 L0,160 Z",
    4: "M0,48 C320,96 640,16 960,64 C1120,88 1280,40 1440,56 C1600,72 1760,48 1920,64 L1920,160 L0,160 Z",
    5: "M0,80 Q480,0 960,80 Q1440,160 1920,80 L1920,160 L0,160 Z",
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      aria-hidden="true"
      style={{
        marginBlock: "-2px",
        height: "80px",
        transform: flip ? "scaleY(-1)" : "none",
      }}
    >
      <svg
        viewBox="0 0 1920 160"
        preserveAspectRatio="none"
        className="section-divider"
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          <linearGradient
            id={`divider-grad-${variant}-${flip ? "f" : "n"}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={fromColor} stopOpacity="0" />
            <stop offset="100%" stopColor={toColor} stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d={paths[variant]}
          fill={`url(#divider-grad-${variant}-${flip ? "f" : "n"})`}
        />
      </svg>
    </div>
  );
}
