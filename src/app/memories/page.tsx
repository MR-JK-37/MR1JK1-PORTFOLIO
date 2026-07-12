import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { MemoriesHub } from "@/components/public/MemoriesHub";
import { getPublicContent, getMemoryCategories } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function MemoriesPage() {
  const [content, categories] = await Promise.all([
    getPublicContent(),
    getMemoryCategories(),
  ]);

  return (
    <main>
      <Nav links={content.profile.links} forceVisible />

      <div className="pt-24 min-h-screen" style={{ background: "var(--color-void)" }}>
        <div className="section-max-width px-6">
          <p className="eyebrow mb-3">$ cd ~/memories</p>
          <h1 className="section-heading mb-8">
            Memory{" "}
            <span className="neon-violet">Archive</span>
          </h1>

          <MemoriesHub categories={categories} />
        </div>
      </div>

      <Footer name={content.profile.name} links={content.profile.links} />
    </main>
  );
}
