import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Container } from "@/components/ui/Container";
import { spacesCopy } from "@/lib/content";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Spaces",
  description: spacesCopy.lede,
};

export default function SpacesPage() {
  const projects = getAllProjects();

  return (
    <>
      <PageHeader index={spacesCopy.index} eyebrow={spacesCopy.eyebrow} title={spacesCopy.title}>
        {spacesCopy.lede}
      </PageHeader>
      <Container className="py-16 md:py-24">
        {projects.length === 0 ? (
          <p className="text-ink-soft">No studies are published yet.</p>
        ) : (
          <ScrollReveal stagger>
            <ul className="grid gap-16 md:grid-cols-2 md:gap-x-8 md:gap-y-20">
              {projects.map((project, index) => (
                <li key={project.slug} data-reveal className={index === 0 ? "md:col-span-2" : undefined}>
                  <ProjectCard project={project} size={index === 0 ? "feature" : "standard"} />
                </li>
              ))}
            </ul>
          </ScrollReveal>
        )}
      </Container>
    </>
  );
}
