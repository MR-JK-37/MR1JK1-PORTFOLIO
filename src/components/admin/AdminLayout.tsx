"use client";

import { useState, useEffect, useCallback } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

import { ProfileEditor } from "./ProfileEditor";
import { SkillsEditor } from "./SkillsEditor";
import { ProjectsEditor } from "./ProjectsEditor";
import { ExperienceEditor } from "./ExperienceEditor";
import { CertsEditor } from "./CertsEditor";
import { EducationEditor } from "./EducationEditor";
import { ExtraEditor } from "./ExtraEditor";
import { HeroMediaEditor } from "./HeroMediaEditor";
import { AppearanceEditor } from "./AppearanceEditor";
import { ParticipationEditor } from "./ParticipationEditor";
import { MemoriesEditor } from "./MemoriesEditor";

interface AdminLayoutProps {
  isFirstRun: boolean;
}

export function AdminLayout({ isFirstRun: initialFirstRun }: AdminLayoutProps) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [isFirstRun, setIsFirstRun] = useState(initialFirstRun);
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setAuthenticated(data.authenticated);
      } catch {
        setAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  const handleAuthSuccess = () => {
    setAuthenticated(true);
    setIsFirstRun(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAuthenticated(false);
    } catch {
      // Ignored
    }
  };

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center font-[family-name:var(--font-mono)] text-text-secondary">
        Initializing secure environment...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-6">
        <LoginForm onSuccess={handleAuthSuccess} isFirstRun={isFirstRun} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void text-text-primary flex">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg z-[300] font-[family-name:var(--font-mono)] text-xs shadow-2xl border ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-panel flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <div className="font-[family-name:var(--font-display)] font-bold text-lg">
            MR!JK! <span className="text-blue text-xs font-mono ml-1 font-normal">CMS v1.0</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1" aria-label="CMS Administration">
          {[
            { id: "profile", label: "Profile / Bio" },
            { id: "skills", label: "Arsenal / Skills" },
            { id: "projects", label: "Projects" },
            { id: "experience", label: "Experience Log" },
            { id: "certifications", label: "Certs & Achievements" },
            { id: "education", label: "Education" },
            { id: "extra", label: "Extra-Curricular" },
            { id: "hero-images", label: "Hero Media" },
            { id: "appearance", label: "Appearance" },
            { id: "participation", label: "Participation" },
            { id: "memories", label: "Memories" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue/10 text-blue border-l-2 border-blue"
                  : "text-text-secondary hover:bg-void/50 hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs font-[family-name:var(--font-mono)] transition-colors"
          >
            TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl">
          {activeTab === "profile" && <ProfileEditor showToast={showToast} />}
          {activeTab === "skills" && <SkillsEditor showToast={showToast} />}
          {activeTab === "projects" && <ProjectsEditor showToast={showToast} />}
          {activeTab === "experience" && <ExperienceEditor showToast={showToast} />}
          {activeTab === "certifications" && <CertsEditor showToast={showToast} />}
          {activeTab === "education" && <EducationEditor showToast={showToast} />}
          {activeTab === "extra" && <ExtraEditor showToast={showToast} />}
          {activeTab === "hero-images" && <HeroMediaEditor showToast={showToast} />}
          {activeTab === "appearance" && <AppearanceEditor showToast={showToast} />}
          {activeTab === "participation" && <ParticipationEditor showToast={showToast} />}
          {activeTab === "memories" && <MemoriesEditor showToast={showToast} />}
        </div>
      </main>
    </div>
  );
}
