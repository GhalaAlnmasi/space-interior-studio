import { ProjectCard } from "@/components/ui/ProjectCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Container } from "@/components/ui/Container";
import { homeCopy } from "@/lib/content";
import { getAllProjects } from "@/lib/projects";

export function FeaturedSpaces() {
  const [feature, ...rest] = getAllProjects();
  if (!feature) return null;

  return (
    <section className="border-t border-charcoal/10 py-24 md:py-32" aria-labelledby="spaces-title">
      <ScrollReveal>
        <Container>
          <div className="max-w-2xl">
            <SectionLabel index={homeCopy.spacesIndex}>{homeCopy.spacesLabel}</SectionLabel>
            <h2
              id="spaces-title"
              className="mt-5 font-display text-[clamp(2.7rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.03em]"
            >
              {homeCopy.spacesTitle}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-soft">{homeCopy.spacesBody}</p>
          </div>
          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <ProjectCard project={feature} size="feature" />
            </div>
            <div className="grid gap-12 md:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {rest.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </Container>
      </ScrollReveal>
    </section>
  );
}
