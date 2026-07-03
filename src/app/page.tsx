import { Nav } from "@/components/public/Nav";
import { Hero } from "@/components/public/Hero";
import { StatStrip } from "@/components/public/StatStrip";
import { SectionDivider } from "@/components/public/SectionDivider";
import { About } from "@/components/public/About";
import { Skills } from "@/components/public/Skills";
import { Experience } from "@/components/public/Experience";
import { Projects } from "@/components/public/Projects";
import { Certifications } from "@/components/public/Certifications";
import { Education } from "@/components/public/Education";
import { Contact } from "@/components/public/Contact";
import { Footer } from "@/components/public/Footer";
import { getPublicContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getPublicContent();

  return (
    <main>
      <Nav links={content.profile.links} />

      <Hero
        name={content.profile.name}
        titles={content.profile.titles}
        summary={content.profile.summary}
        heroDayImage={content.heroDayImage}
        heroNightImage={content.heroNightImage}
      />

      <StatStrip />

      <SectionDivider variant={1} toColor="var(--color-panel)" />

      <About summary={content.profile.summary} profile={content.profile} />

      <SectionDivider
        variant={2}
        flip
        fromColor="var(--color-panel)"
        toColor="var(--color-void)"
      />

      <Skills skills={content.skills} />

      <SectionDivider variant={3} toColor="var(--color-panel)" />

      <Experience entries={content.experience} />

      <SectionDivider
        variant={4}
        flip
        fromColor="var(--color-panel)"
        toColor="var(--color-void)"
      />

      <Projects projects={content.projects} />

      <SectionDivider variant={5} toColor="var(--color-panel)" />

      <Certifications
        certifications={content.certifications}
        achievements={content.achievements}
      />

      <SectionDivider
        variant={1}
        flip
        fromColor="var(--color-panel)"
        toColor="var(--color-void)"
      />

      <Education
        entries={content.education}
        extraCurricular={content.extraCurricular}
      />

      <SectionDivider variant={2} toColor="var(--color-void)" />

      <Contact
        email={content.profile.email}
        phone={content.profile.phone}
        location={content.profile.location}
        links={content.profile.links}
      />

      <Footer name={content.profile.name} links={content.profile.links} />
    </main>
  );
}
