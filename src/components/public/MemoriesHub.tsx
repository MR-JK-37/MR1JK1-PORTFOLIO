"use client";

import { useState, useEffect, useCallback } from "react";
import type { MemoryCategoryData, MediaAssetData } from "@/lib/content";
import { MemoryCard } from "./MemoryCard";
import { UnifiedDetailModal } from "./UnifiedDetailModal";

interface MemoryEventWithMedia {
  id: string;
  categoryId: string;
  title: string;
  shortDescription: string;
  detailedContent: string;
  order: number;
  media: MediaAssetData[];
}

interface MemoriesHubProps {
  categories: MemoryCategoryData[];
}

export function MemoriesHub({ categories }: MemoriesHubProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.id || ""
  );
  const [events, setEvents] = useState<MemoryEventWithMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<MemoryEventWithMedia | null>(null);

  const fetchEvents = useCallback(async (categoryId: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/memories/events?categoryId=${categoryId}`
      );
      const data = await res.json();
      setEvents(data);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeCategory) {
      fetchEvents(activeCategory);
    }
  }, [activeCategory, fetchEvents]);

  if (categories.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-text-muted font-[family-name:var(--font-mono)] text-sm">
          No memory categories yet. Add some from the admin panel.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Category sub-navigation: Tactile Segmented Control */}
      <div className="inline-flex p-1.5 rounded-2xl bg-void/80 border border-border/40 shadow-[inset_2px_2px_8px_rgba(0,0,0,0.8)] mb-10 overflow-x-auto max-w-full">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-xl text-xs font-[family-name:var(--font-mono)] transition-all duration-300 ${
                isActive
                  ? "bg-amber/10 border border-amber/35 text-amber shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5),0_0_15px_rgba(240,166,58,0.15)] font-semibold"
                  : "text-text-secondary hover:text-text-primary border border-transparent"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Events staggered grid */}
      {loading ? (
        <div className="py-16 text-center">
          <p className="text-text-muted font-mono text-xs animate-pulse">
            Loading memories...
          </p>
        </div>
      ) : events.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-text-muted font-mono text-xs">
            No memories in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {events.map((event, idx) => {
            const isLarge = idx % 4 === 0;
            return (
              <div
                key={event.id}
                className={isLarge ? "lg:col-span-2 lg:row-span-1" : "col-span-1"}
              >
                <MemoryCard
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                  isLarge={isLarge}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Unified Detail Modal */}
      <UnifiedDetailModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || ""}
        subtitle={selectedEvent?.shortDescription}
        content={selectedEvent?.detailedContent || ""}
        accentColor="amber"
        media={selectedEvent?.media || []}
      />
    </>
  );
}
