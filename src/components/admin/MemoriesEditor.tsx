"use client";

import { useState, useEffect } from "react";
import { MediaUploader } from "./MediaUploader";

interface MemoriesEditorProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

interface Category {
  id: string;
  label: string;
  slug: string;
  order: number;
}

interface MemoryEvent {
  id: string;
  categoryId: string;
  title: string;
  shortDescription: string;
  detailedContent: string;
  order: number;
  media: Array<{
    id: string;
    type: string;
    originalUrl: string;
    compressedUrl: string;
    thumbnailUrl: string;
    isCover: boolean;
    sizeBytes: number;
  }>;
}

export function MemoriesEditor({ showToast }: MemoriesEditorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [events, setEvents] = useState<MemoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatLabel, setNewCatLabel] = useState("");

  // Load categories
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/memories/categories");
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) setActiveCategory(data[0].id);
      } catch {
        showToast("Failed to load categories", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showToast]);

  // Load events when category changes
  useEffect(() => {
    if (!activeCategory) return;
    async function loadEvents() {
      try {
        const res = await fetch(
          `/api/memories/events?categoryId=${activeCategory}`
        );
        const data = await res.json();
        setEvents(data);
      } catch {
        setEvents([]);
      }
    }
    loadEvents();
  }, [activeCategory]);

  const handleAddCategory = async () => {
    if (!newCatLabel.trim()) return;
    try {
      const res = await fetch("/api/memories/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          label: newCatLabel.trim(),
          order: categories.length,
        }),
      });
      const cat = await res.json();
      setCategories([...categories, cat]);
      setNewCatLabel("");
      showToast("Category added");
    } catch {
      showToast("Failed to add category", "error");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await fetch("/api/memories/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      setCategories(categories.filter((c) => c.id !== id));
      if (activeCategory === id) {
        setActiveCategory(categories.find((c) => c.id !== id)?.id || "");
      }
      showToast("Category deleted");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const handleAddEvent = async () => {
    if (!activeCategory) return;
    try {
      const res = await fetch("/api/memories/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          categoryId: activeCategory,
          title: "New Memory",
          order: events.length,
        }),
      });
      const event = await res.json();
      setEvents([...events, { ...event, media: [] }]);
      showToast("Event created");
    } catch {
      showToast("Failed to add event", "error");
    }
  };

  const handleUpdateEvent = async (event: MemoryEvent) => {
    try {
      await fetch("/api/memories/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id: event.id,
          title: event.title,
          shortDescription: event.shortDescription,
          detailedContent: event.detailedContent,
          order: event.order,
        }),
      });
      showToast("Event updated");
    } catch {
      showToast("Failed to update", "error");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await fetch("/api/memories/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      setEvents(events.filter((e) => e.id !== id));
      showToast("Event deleted");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const updateEventField = (
    eventId: string,
    field: keyof MemoryEvent,
    value: string
  ) => {
    setEvents(
      events.map((e) =>
        e.id === eventId ? { ...e, [field]: value } : e
      )
    );
  };

  if (loading) {
    return <div className="font-mono text-sm text-text-muted">Loading...</div>;
  }

  return (
    <div className="space-y-8 bg-panel p-8 rounded-2xl border border-border shadow-md">
      <div className="border-b border-border pb-4">
        <h2 className="font-[family-name:var(--font-display)] font-bold text-xl">
          Memories
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          Manage memory categories and events with images/videos.
        </p>
      </div>

      {/* Category management */}
      <div className="space-y-3">
        <h3 className="text-sm font-[family-name:var(--font-display)] font-semibold">
          Categories
        </h3>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono cursor-pointer transition-all ${
                activeCategory === cat.id
                  ? "border-amber/30 bg-amber/10 text-amber"
                  : "border-border text-text-secondary hover:border-amber/20"
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(cat.id);
                }}
                className="text-red-400/50 hover:text-red-400 ml-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newCatLabel}
            onChange={(e) => setNewCatLabel(e.target.value)}
            placeholder="New category name"
            className="flex-1 px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
          />
          <button
            onClick={handleAddCategory}
            className="btn-secondary py-2 px-4 text-xs"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Events for active category */}
      {activeCategory && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-[family-name:var(--font-display)] font-semibold">
              Events in &quot;
              {categories.find((c) => c.id === activeCategory)?.label}&quot;
            </h3>
            <button
              onClick={handleAddEvent}
              className="btn-secondary py-1.5 px-4 text-xs"
            >
              + Add Event
            </button>
          </div>

          {events.length === 0 && (
            <p className="text-xs text-text-muted font-mono py-4">
              No events yet. Click &quot;+ Add Event&quot; to create one.
            </p>
          )}

          {events.map((event) => (
            <div
              key={event.id}
              className="p-5 bg-void/30 border border-border rounded-xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-text-muted">
                  EVENT: {event.id.slice(0, 8)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateEvent(event)}
                    className="text-[10px] font-mono text-blue hover:text-blue/80"
                  >
                    SAVE
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-[10px] font-mono text-red-400 hover:text-red-300"
                  >
                    DELETE
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={event.title}
                onChange={(e) =>
                  updateEventField(event.id, "title", e.target.value)
                }
                placeholder="Event title"
                className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
              />

              <input
                type="text"
                value={event.shortDescription}
                onChange={(e) =>
                  updateEventField(
                    event.id,
                    "shortDescription",
                    e.target.value
                  )
                }
                placeholder="Short description (shown on card)"
                className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs"
              />

              <textarea
                value={event.detailedContent}
                onChange={(e) =>
                  updateEventField(
                    event.id,
                    "detailedContent",
                    e.target.value
                  )
                }
                placeholder="Detailed content (shown in detail view)"
                rows={4}
                className="w-full px-3 py-2 rounded bg-void border border-border text-text-primary text-xs resize-y"
              />

              <MediaUploader
                ownerType="memoryEvent"
                ownerId={event.id}
                assets={event.media}
                onAssetsChange={(assets) => {
                  setEvents(
                    events.map((e) =>
                      e.id === event.id ? { ...e, media: assets } : e
                    )
                  );
                }}
                showToast={showToast}
                multiple
                acceptVideo
                label="Upload Images & Videos"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
