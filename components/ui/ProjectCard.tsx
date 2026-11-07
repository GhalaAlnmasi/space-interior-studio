import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { StudyPlate } from "@/components/ui/StudyPlate";
import { cn } from "@/lib/cn";
import { projectPath, studyKindLabel, type Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
  size?: "feature" | "standard";
};

export function ProjectCard({ project, size = "standard" }: ProjectCardProps) {
  const featured = size === "feature";

  return (
    <article className="group h-full">
      <Link href={projectPath(project.slug)} className="flex h-full flex-col">
        <div
          className={cn(
            "overflow-hidden border border-charcoal/15 bg-ivory-deep",
            featured ? "aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]" : "aspect-[16/11] lg:aspect-[16/10]",
          )}
        >
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <StudyPlate variant={project.plate} decorative />
          </div>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sage-deep">
              {project.location}
              <span aria-hidden="true"> · </span>
              {project.typology}
              <span aria-hidden="true"> · </span>
              {studyKindLabel}
            </p>
            <h3
              className={cn(
                "mt-2 font-display leading-none tracking-[-0.03em] text-charcoal",
                featured ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
              )}
            >
              {project.title}
            </h3>
          </div>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 size-5 shrink-0 text-charcoal transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </div>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">{project.excerpt}</p>
        <span
          aria-hidden="true"
          className="mt-5 block h-px w-12 origin-left bg-bronze transition-transform duration-500 group-hover:scale-x-[2.4] motion-reduce:transition-none motion-reduce:group-hover:scale-x-100"
        />
      </Link>
    </article>
  );
}
