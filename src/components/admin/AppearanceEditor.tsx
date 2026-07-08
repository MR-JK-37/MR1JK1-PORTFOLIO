"use client";

import { useState, useEffect } from "react";

interface AppearanceEditorProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

interface ThemeItem {
  id: string;
  label: string;
  createdAt: string;
}

export function AppearanceEditor({ showToast }: AppearanceEditorProps) {
  const [themes, setThemes] = useState<ThemeItem[]>([]);
  const [activeThemeId, setActiveThemeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/theme");
        const data = await res.json();
        setThemes(data.themes || []);
        setActiveThemeId(data.activeThemeId || "");
      } catch {
        showToast("Failed to load themes", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showToast]);

  const handleActivate = async (themeId: string) => {
    setActivating(themeId);
    try {
      const res = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId }),
      });

      if (!res.ok) {
        throw new Error("Failed to activate theme");
      }

      setActiveThemeId(themeId);
      showToast("Theme activated — reload to see changes");
    } catch {
      showToast("Failed to activate theme", "error");
    } finally {
      setActivating(null);
    }
  };

  const v1Theme = themes.find((t) => t.label === "v1-original");

  if (loading) {
    return (
      <div className="font-mono text-sm text-text-muted">
        Loading themes...
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-panel p-8 rounded-2xl border border-border shadow-md">
      <div className="border-b border-border pb-4">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-xl">
          Appearance
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          Manage visual themes. Switching themes only changes colors, shadows,
          and spacing — all content remains untouched.
        </p>
      </div>

      {/* Quick restore button */}
      {v1Theme && activeThemeId !== v1Theme.id && (
        <button
          onClick={() => handleActivate(v1Theme.id)}
          disabled={activating !== null}
          className="w-full py-3 rounded-xl border border-amber/30 bg-amber/5 text-amber hover:bg-amber/10 transition-colors font-[family-name:var(--font-mono)] text-sm font-semibold"
        >
          {activating === v1Theme.id
            ? "Restoring..."
            : "⟲ Restore v1-original (revert to original theme)"}
        </button>
      )}

      {/* Theme list */}
      <div className="space-y-3">
        <h3 className="text-sm font-[family-name:var(--font-display)] font-semibold text-text-primary">
          Saved Themes
        </h3>

        {themes.length === 0 && (
          <p className="text-xs text-text-muted font-mono">
            No themes saved yet. Run the seed to initialize.
          </p>
        )}

        {themes.map((theme) => {
          const isActive = theme.id === activeThemeId;

          return (
            <div
              key={theme.id}
              className={`p-4 rounded-xl border transition-all ${
                isActive
                  ? "border-blue/30 bg-blue/5 shadow-[0_0_20px_rgba(69,211,255,0.08)]"
                  : "border-border bg-void/30 hover:border-border/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-display)] font-semibold text-sm">
                      {theme.label}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue/15 text-blue border border-blue/20">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-text-muted mt-1 block">
                    Created:{" "}
                    {new Date(theme.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {!isActive && (
                  <button
                    onClick={() => handleActivate(theme.id)}
                    disabled={activating !== null}
                    className="btn-primary py-1.5 px-4 text-xs font-semibold"
                  >
                    {activating === theme.id ? "Activating..." : "Activate"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-[11px] text-text-muted font-mono leading-relaxed">
          <span className="text-amber">NOTE:</span> After activating a theme,
          reload the page (or navigate) to see the full effect. The theme only
          changes visual tokens — all your content, certifications,
          achievements, and features remain exactly as they are.
        </p>
      </div>
    </div>
  );
}
