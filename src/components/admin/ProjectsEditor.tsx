"use client";

import { useState, useEffect } from "react";

interface ProjectsEditorProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

interface Project {
  title: string;
  description: string;
  stack: string[];
}

export function ProjectsEditor({ showToast }: ProjectsEditorProps) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/content/projects");
        const rows = await res.json();
        if (rows.length > 0) {
          setProjects(JSON.parse(rows[0].value));
        } else {
          setProjects([]);
        }
      } catch {
        showToast("Failed to load projects", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [showToast]);

  const handleSave = async (updatedProjects = projects) => {
    if (!updatedProjects) return;
    setSaving(true);

    try {
      const res = await fetch("/api/content/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "all",
          value: updatedProjects,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Projects updated successfully");
    } catch {
      showToast("Failed to save projects configuration", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = () => {
    if (!projects) return;
    const newList = [
      ...projects,
      {
        title: "New Exploitation Framework",
        description: "Describe what this project does and the problems it solves.",
        stack: ["Python", "Metasploit", "Bash"],
      },
    ];
    setProjects(newList);
    handleSave(newList);
  };

  const handleRemoveProject = (index: number) => {
    if (!projects) return;
    const newList = projects.filter((_, i) => i !== index);
    setProjects(newList);
    handleSave(newList);
  };

  const handleFieldChange = (index: number, field: keyof Project, value: unknown) => {
    if (!projects) return;
    const newList = [...projects];
    newList[index] = { ...newList[index], [field]: value };
    setProjects(newList);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (!projects) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const newList = [...projects];
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    
    setProjects(newList);
    handleSave(newList);
  };

  if (loading || !projects) {
    return <div className="font-mono text-sm text-text-muted">Reading database...</div>;
  }

  return (
    <div className="space-y-8 bg-panel p-8 rounded-2xl border border-border shadow-md">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl">Projects Grid</h2>
          <p className="text-xs text-text-secondary mt-1">
            Build and arrange your portfolio projects. Order is editable.
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleAddProject} className="btn-secondary py-2 px-4 text-xs font-semibold">
            Add Project
          </button>
          <button onClick={() => handleSave()} disabled={saving} className="btn-primary py-2 px-5 text-xs font-semibold">
            {saving ? "Saving..." : "Save Grid"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {projects.map((project, idx) => (
          <div key={idx} className="p-6 bg-void/30 border border-border rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-mono)] text-xs text-text-muted">
                PROJECT {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="px-2 py-1 bg-void border border-border text-text-secondary hover:text-text-primary rounded text-xs disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === projects.length - 1}
                  className="px-2 py-1 bg-void border border-border text-text-secondary hover:text-text-primary rounded text-xs disabled:opacity-30"
                >
                  ▼
                </button>
                <button
                  onClick={() => handleRemoveProject(idx)}
                  className="text-xs font-[family-name:var(--font-mono)] text-red-400 hover:text-red-300 ml-4"
                >
                  DELETE
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">TITLE</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleFieldChange(idx, "title", e.target.value)}
                  className="w-full px-4 py-2 rounded bg-void border border-border text-text-primary focus:outline-none focus:border-blue text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">
                  STACK TAGS (Comma Separated)
                </label>
                <input
                  type="text"
                  value={project.stack.join(", ")}
                  onChange={(e) =>
                    handleFieldChange(
                      idx,
                      "stack",
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  className="w-full px-4 py-2 rounded bg-void border border-border text-text-primary focus:outline-none focus:border-blue text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">DESCRIPTION</label>
              <textarea
                rows={3}
                value={project.description}
                onChange={(e) => handleFieldChange(idx, "description", e.target.value)}
                className="w-full px-4 py-2 rounded bg-void border border-border text-text-primary focus:outline-none focus:border-blue text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
