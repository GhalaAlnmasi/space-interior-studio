import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StudyDiagram } from "@/components/ui/StudyDiagram";
import { StudyPlate } from "@/components/ui/StudyPlate";
import {
  getAdjacentProjects,
  getAllProjects,
  getProjectBySlug,
  projectPath,
  studyKindLabel,
} from "@/lib/projects";

type SpacePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: SpacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Study" };
  return {
    title: project.title,
    description: project.excerpt,
  };
}

export default function SpacePage({ params }: SpacePageProps) {
  return (
    <Suspense fallback={<StudyFallback />}>
      <StudyDetail params={params} />
    </Suspense>
  );
}

function StudyFallback() {
  return (
    <Container className="py-16">
      <div className="h-8 w-40 bg-sand" />
      <div className="mt-6 h-20 max-w-xl bg-ivory-deep" />
      <div className="mt-10 aspect-[16/10] border border-charcoal/10 bg-ivory-deep" />
    </Container>
  );
}

async function StudyDetail({ params }: SpacePageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const adjacent = getAdjacentProjects(project.slug);

  return (
    <article>
      <header className="border-b border-charcoal/10">
        <Container className="grid gap-8 py-16 md:py-20 lg:grid-cols-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sage-deep lg:col-span-3">
            {project.index}
            <span aria-hidden="true"> — </span>
            {project.location}
          </p>
          <div className="lg:col-span-8 lg:col-start-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep">
              {studyKindLabel}
              <span aria-hidden="true"> · </span>
              {project.typology}
            </p>
            <h1 className="mt-4 font-display text-[clamp(3.4rem,8vw,6.5rem)] leading-[0.88] tracking-[-0.035em]">
              {project.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">{project.summary}</p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-sage-deep">{project.disclaimer}</p>
          </div>
        </Container>
      </header>
      <Container className="py-12 md:py-16">
        <div className="overflow-hidden border border-charcoal/15 bg-ivory-deep">
          <div className="aspect-[4/5] sm:aspect-[16/10]">
            <StudyPlate variant={project.plate} label={`${project.title} spatial study`} />
          </div>
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-sage-deep">
          {studyKindLabel}. Original drawing, not a photograph of a completed project.
        </p>
        <blockquote className="mt-16 max-w-3xl font-display text-3xl leading-tight tracking-[-0.03em] text-charcoal md:text-4xl">
          {project.philosophy}
        </blockquote>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">{project.inspiration}</p>
        <div className="mt-16 grid gap-14 lg:grid-cols-12">
          <div className="space-y-6 text-base leading-relaxed text-ink-soft lg:col-span-6">
            {project.narrative.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:col-start-8">
            <div>
              <h2 className="text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep">Materials</h2>
              <ul className="mt-4">
                {project.finishes.map((finish) => (
                  <li key={finish.name} className="border-t border-charcoal/10 py-3">
                    <p className="text-sm">{finish.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{finish.note}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep">Gestures</h2>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed">
                {project.gestures.map((gesture) => (
                  <li key={gesture} className="border-t border-charcoal/10 py-2">
                    {gesture}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <StudyDiagram project={project} kind="plan" />
          <StudyDiagram project={project} kind="section" />
        </div>
        <div className="mt-16 border border-charcoal/10 px-6 py-8 sm:px-8">
          <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
            The studio model is a shared room for looking, not a reconstruction of this study.
          </p>
          <div className="mt-6">
            <Button href="/studio" variant="secondary">
              Enter Studio
            </Button>
          </div>
        </div>
        {adjacent ? (
          <nav aria-label="More studies" className="mt-16 grid gap-8 border-t border-charcoal/10 pt-8 sm:grid-cols-2">
            <Link href={projectPath(adjacent.previous.slug)} className="group block min-h-11">
              <p className="text-[11px] uppercase tracking-[0.22em] text-sage-deep">
                Previous
                <span aria-hidden="true"> · </span>
                {adjacent.previous.index}
              </p>
              <p className="mt-2 font-display text-3xl tracking-[-0.03em] group-hover:text-bronze-deep">
                {adjacent.previous.title}
              </p>
            </Link>
            <Link href={projectPath(adjacent.next.slug)} className="group block min-h-11 sm:text-right">
              <p className="text-[11px] uppercase tracking-[0.22em] text-sage-deep">
                Next
                <span aria-hidden="true"> · </span>
                {adjacent.next.index}
              </p>
              <p className="mt-2 font-display text-3xl tracking-[-0.03em] group-hover:text-bronze-deep">
                {adjacent.next.title}
              </p>
            </Link>
          </nav>
        ) : null}
      </Container>
    </article>
  );
}
