"use client";

import { useEffect } from "react";
import type { ThemeTokens } from "@/lib/theme";

interface ThemeProviderProps {
  tokens: ThemeTokens;
  children: React.ReactNode;
}

/**
 * Client component that applies theme tokens as CSS custom properties on :root.
 * Components keep using var(--color-blue) etc. — switching the token values
 * changes the whole site without touching component logic.
 */
export function ThemeProvider({ tokens, children }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(tokens)) {
      root.style.setProperty(`--${key}`, value);
    }

    // Cleanup: remove the properties when unmounting
    return () => {
      for (const key of Object.keys(tokens)) {
        root.style.removeProperty(`--${key}`);
      }
    };
  }, [tokens]);

  return <>{children}</>;
}
