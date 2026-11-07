import type { Project } from "@/lib/projects";

type StudyDiagramProps = {
  project: Project;
  kind: "plan" | "section";
};

const stroke = "#242820";
const soft = "#A77C55";

export function StudyDiagram({ project, kind }: StudyDiagramProps) {
  const title = kind === "plan" ? "Conceptual plan" : "Conceptual section";
  const caption = kind === "plan" ? project.planCaption : project.sectionCaption;

  return (
    <figure className="border border-charcoal/15 bg-ivory">
      <div className="border-b border-charcoal/10 px-5 py-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep">{title}</p>
      </div>
      <div className="px-5 py-6">
        <svg viewBox="0 0 320 210" role="img" aria-label={`${title} for ${project.title}`} className="h-auto w-full">
          {kind === "plan" ? <PlanDrawing variant={project.plate} /> : <SectionDrawing variant={project.plate} />}
        </svg>
      </div>
      <figcaption className="space-y-2 border-t border-charcoal/10 px-5 py-4 text-sm leading-relaxed text-ink-soft">
        <p>{caption}</p>
        <p>Conceptual illustration. Not construction documentation.</p>
      </figcaption>
    </figure>
  );
}

function PlanDrawing({ variant }: { variant: Project["plate"] }) {
  const thick = variant === "sable";
  const inset = thick ? 28 : 18;

  return (
    <g fill="none" stroke={stroke} strokeWidth="1.25">
      <rect x={inset} y="28" width={320 - inset * 2} height="150" />
      {variant === "courtyard" ? <rect x="118" y="62" width="84" height="78" stroke={soft} /> : null}
      {variant === "atelier" ? <line x1="250" y1="40" x2="250" y2="166" stroke={soft} /> : null}
      {variant === "sable" ? <path d="M150 28 V178" stroke={soft} /> : null}
      <rect x="78" y="118" width="92" height="36" />
      <rect x="132" y="86" width="46" height="24" />
      <line x1={inset} y1="96" x2={inset + 16} y2="96" />
    </g>
  );
}

function SectionDrawing({ variant }: { variant: Project["plate"] }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="1.25">
      <line x1="24" y1="168" x2="296" y2="168" />
      <line x1="36" y1="168" x2="36" y2="36" />
      <line x1="36" y1="36" x2="286" y2="36" />
      <line x1="286" y1="36" x2="286" y2="168" />
      {variant === "atelier" ? <rect x="168" y="48" width="78" height="120" stroke={soft} /> : null}
      {variant === "courtyard" ? <rect x="150" y="78" width="70" height="90" stroke={soft} /> : null}
      {variant === "sable" ? <path d="M132 168 V108 Q160 72 188 108 V168" stroke={soft} /> : null}
      <rect x="70" y="132" width="70" height="36" />
      <line x1="158" y1="150" x2="214" y2="150" />
      {variant === "sable" ? <line x1="92" y1="168" x2="150" y2="158" /> : null}
    </g>
  );
}
