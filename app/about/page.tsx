import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { aboutCopy } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: aboutCopy.lede,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader index={aboutCopy.index} eyebrow={aboutCopy.eyebrow} title={aboutCopy.title}>
        {aboutCopy.lede}
      </PageHeader>
      <Container className="py-16 md:py-24">
        <ScrollReveal stagger>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="space-y-6 text-base leading-relaxed text-ink-soft md:text-lg lg:col-span-7">
              {aboutCopy.story.map((paragraph) => (
                <p key={paragraph} data-reveal>
                  {paragraph}
                </p>
              ))}
            </div>
            <aside className="border border-charcoal/10 p-6 lg:col-span-4 lg:col-start-9 lg:p-8">
              <p className="font-display text-3xl leading-tight tracking-[-0.03em]">Design your perspective.</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                Begin with the studies, or turn the model and see how a simple room holds light.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button href="/spaces">Explore Spaces</Button>
                <Button href="/studio" variant="secondary">
                  Enter Studio
                </Button>
              </div>
            </aside>
          </div>
        </ScrollReveal>
        <section className="mt-20 border-t border-charcoal/10 pt-12" aria-labelledby="approach-title">
          <h2 id="approach-title" className="font-display text-4xl tracking-[-0.03em] md:text-5xl">
            {aboutCopy.approachTitle}
          </h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3">
            {aboutCopy.steps.map((step) => (
              <li key={step.index}>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep">{step.index}</p>
                <h3 className="mt-3 font-display text-4xl tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </Container>
    </>
  );
}
