import type { Metadata } from "next";
import { StudioStage } from "@/components/three/StudioStage";
import { Container } from "@/components/ui/Container";
import { studioPageCopy } from "@/lib/content";
import { studioCopy, studioModelNotes } from "@/lib/studio";

export const metadata: Metadata = {
  title: "Studio",
  description: studioCopy.description,
};

export default function StudioPage() {
  return (
    <>
      <Container className="pb-6 pt-10 md:pt-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sage-deep">
              {studioPageCopy.index}
              <span aria-hidden="true"> — </span>
              {studioPageCopy.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-[clamp(3.2rem,6vw,5.4rem)] leading-[0.9] tracking-[-0.035em]">
              {studioPageCopy.title}
            </h1>
          </div>
          <p className="max-w-md text-base leading-relaxed text-ink-soft">{studioPageCopy.lede}</p>
        </div>
      </Container>
      <Container className="pb-16 md:pb-24">
        <StudioStage />
        <section className="mt-14 grid gap-10 lg:grid-cols-12" aria-labelledby="model-contents">
          <div className="lg:col-span-5">
            <h2 id="model-contents" className="font-display text-4xl tracking-[-0.03em] md:text-5xl">
              {studioPageCopy.contentsTitle}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">{studioPageCopy.contentsBody}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
              {studioModelNotes.map((note) => (
                <li key={note} className="py-4 text-sm leading-relaxed">
                  {note}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-ink-soft">{studioCopy.phaseNote}</p>
          </div>
        </section>
      </Container>
    </>
  );
}
