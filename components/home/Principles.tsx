import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Container } from "@/components/ui/Container";
import { homeCopy, principles } from "@/lib/content";

export function Principles() {
  return (
    <section className="border-t border-charcoal/10 py-24 md:py-32" aria-labelledby="principles-title">
      <ScrollReveal stagger>
        <Container>
          <div className="max-w-2xl">
            <SectionLabel index={homeCopy.principlesIndex}>{homeCopy.principlesLabel}</SectionLabel>
            <h2
              id="principles-title"
              className="mt-5 font-display text-[clamp(2.7rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.03em]"
            >
              {homeCopy.principlesTitle}
            </h2>
          </div>
          <ol className="mt-14 divide-y divide-charcoal/10 border-y border-charcoal/10">
            {principles.map((principle) => (
              <li key={principle.index} data-reveal className="grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep md:col-span-2">
                  {principle.index}
                </p>
                <h3 className="font-display text-4xl tracking-[-0.03em] md:col-span-4 md:text-5xl">
                  {principle.title}
                </h3>
                <p className="max-w-md text-base leading-relaxed text-ink-soft md:col-span-5 md:col-start-8">
                  {principle.body}
                </p>
              </li>
            ))}
          </ol>
          <Link
            href="/about"
            className="mt-10 inline-flex min-h-11 items-center text-[11px] font-medium uppercase tracking-[0.22em] text-charcoal underline decoration-sand decoration-1 underline-offset-4 hover:decoration-bronze"
          >
            {homeCopy.aboutLink}
          </Link>
        </Container>
      </ScrollReveal>
    </section>
  );
}
