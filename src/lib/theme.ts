import { prisma } from "./db";

/**
 * The complete set of design tokens that define a visual theme.
 * These map 1:1 to CSS custom properties in globals.css's @theme block.
 */
export interface ThemeTokens {
  // Colors
  "color-void": string;
  "color-panel": string;
  "color-panel-light": string;
  "color-surface": string;
  "color-blue": string;
  "color-blue-dim": string;
  "color-violet": string;
  "color-violet-dim": string;
  "color-amber": string;
  "color-amber-dim": string;
  "color-text-primary": string;
  "color-text-secondary": string;
  "color-text-muted": string;
  "color-border": string;
  "color-border-glow": string;

  // Spacing
  "spacing-section": string;
  "spacing-section-sm": string;

  // Border radius
  "radius-card": string;
  "radius-card-alt": string;
  "radius-button": string;
  "radius-chip": string;

  // Shadows
  "shadow-card": string;
  "shadow-card-hover": string;
  "shadow-card-hover-violet": string;
  "shadow-glow-blue": string;
  "shadow-glow-violet": string;

  // Transitions
  "ease-smooth": string;
  "ease-bounce": string;
  "duration-fast": string;
  "duration-normal": string;
  "duration-slow": string;
}

/**
 * v1-original token set — the exact values from the current globals.css @theme block.
 * This is the "before" snapshot that the rollback mechanism preserves.
 */
export const V1_ORIGINAL_TOKENS: ThemeTokens = {
  "color-void": "#070a0f",
  "color-panel": "#0c121b",
  "color-panel-light": "#111927",
  "color-surface": "#151d2b",
  "color-blue": "#45d3ff",
  "color-blue-dim": "#2a8aad",
  "color-violet": "#b273ff",
  "color-violet-dim": "#7a4db3",
  "color-amber": "#f0a63a",
  "color-amber-dim": "#b8802d",
  "color-text-primary": "#e8edf5",
  "color-text-secondary": "#8892a4",
  "color-text-muted": "#4a5568",
  "color-border": "#1e293b",
  "color-border-glow": "rgba(69, 211, 255, 0.15)",
  "spacing-section": "6rem",
  "spacing-section-sm": "4rem",
  "radius-card": "16px 8px 12px 10px",
  "radius-card-alt": "10px 16px 8px 12px",
  "radius-button": "8px 4px 8px 4px",
  "radius-chip": "12px 8px 12px 8px",
  "shadow-card":
    "6px 6px 16px rgba(0, 0, 0, 0.55), -4px -4px 12px rgba(255, 255, 255, 0.02)",
  "shadow-card-hover":
    "8px 8px 24px rgba(0, 0, 0, 0.65), -6px -6px 18px rgba(69, 211, 255, 0.04)",
  "shadow-card-hover-violet":
    "8px 8px 24px rgba(0, 0, 0, 0.65), -6px -6px 18px rgba(178, 115, 255, 0.04)",
  "shadow-glow-blue":
    "0 0 25px rgba(69, 211, 255, 0.25), inset 0 0 10px rgba(69, 211, 255, 0.15)",
  "shadow-glow-violet":
    "0 0 25px rgba(178, 115, 255, 0.25), inset 0 0 10px rgba(178, 115, 255, 0.15)",
  "ease-smooth": "cubic-bezier(0.25, 0.8, 0.25, 1)",
  "ease-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
  "duration-fast": "150ms",
  "duration-normal": "300ms",
  "duration-slow": "600ms",
};

/**
 * v2-cinematic token set — the new, more distinctive theme.
 * Deeper blacks, richer glows, more pronounced neumorphism.
 */
export const V2_CINEMATIC_TOKENS: ThemeTokens = {
  "color-void": "#040609",
  "color-panel": "#0a0f18",
  "color-panel-light": "#0f1623",
  "color-surface": "#131b2a",
  "color-blue": "#00e5ff",
  "color-blue-dim": "#007a8a",
  "color-violet": "#c084fc",
  "color-violet-dim": "#8b5cf6",
  "color-amber": "#fbbf24",
  "color-amber-dim": "#d97706",
  "color-text-primary": "#f0f4ff",
  "color-text-secondary": "#7b8ba5",
  "color-text-muted": "#3a4558",
  "color-border": "#162035",
  "color-border-glow": "rgba(0, 229, 255, 0.18)",
  "spacing-section": "6rem",
  "spacing-section-sm": "4rem",
  "radius-card": "18px 6px 14px 8px",
  "radius-card-alt": "8px 18px 6px 14px",
  "radius-button": "10px 4px 10px 4px",
  "radius-chip": "14px 6px 14px 6px",
  "shadow-card":
    "8px 8px 24px rgba(0, 0, 0, 0.7), -4px -4px 14px rgba(255, 255, 255, 0.015), inset 0 1px 0 rgba(255,255,255,0.03)",
  "shadow-card-hover":
    "10px 10px 32px rgba(0, 0, 0, 0.75), -6px -6px 20px rgba(0, 229, 255, 0.06), inset 0 1px 0 rgba(0,229,255,0.08)",
  "shadow-card-hover-violet":
    "10px 10px 32px rgba(0, 0, 0, 0.75), -6px -6px 20px rgba(192, 132, 252, 0.06), inset 0 1px 0 rgba(192,132,252,0.08)",
  "shadow-glow-blue":
    "0 0 30px rgba(0, 229, 255, 0.3), 0 0 60px rgba(0, 229, 255, 0.1), inset 0 0 12px rgba(0, 229, 255, 0.2)",
  "shadow-glow-violet":
    "0 0 30px rgba(192, 132, 252, 0.3), 0 0 60px rgba(192, 132, 252, 0.1), inset 0 0 12px rgba(192, 132, 252, 0.2)",
  "ease-smooth": "cubic-bezier(0.22, 0.61, 0.36, 1)",
  "ease-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
  "duration-fast": "150ms",
  "duration-normal": "350ms",
  "duration-slow": "700ms",
};

/**
 * Get the currently active theme tokens from the database.
 * Falls back to v1-original if no theme is set.
 */
export async function getActiveTheme(): Promise<{
  id: string;
  label: string;
  tokens: ThemeTokens;
}> {
  try {
    const settings = await prisma.appSettings.findUnique({
      where: { id: "singleton" },
    });

    if (!settings || !settings.activeThemeId) {
      return { id: "v1-original", label: "v1-original", tokens: V1_ORIGINAL_TOKENS };
    }

    const theme = await prisma.themeVersion.findFirst({
      where: { id: settings.activeThemeId },
    });

    if (!theme) {
      return { id: "v1-original", label: "v1-original", tokens: V1_ORIGINAL_TOKENS };
    }

    return {
      id: theme.id,
      label: theme.label,
      tokens: JSON.parse(theme.tokensJson) as ThemeTokens,
    };
  } catch {
    return { id: "v1-original", label: "v1-original", tokens: V1_ORIGINAL_TOKENS };
  }
}

/**
 * List all saved theme versions.
 */
export async function listThemes() {
  return prisma.themeVersion.findMany({
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Activate a theme by its ID.
 */
export async function activateTheme(themeId: string) {
  // Verify the theme exists
  const theme = await prisma.themeVersion.findUnique({
    where: { id: themeId },
  });
  if (!theme) {
    throw new Error(`Theme ${themeId} not found`);
  }

  await prisma.appSettings.upsert({
    where: { id: "singleton" },
    update: { activeThemeId: themeId },
    create: { id: "singleton", activeThemeId: themeId },
  });

  return theme;
}
