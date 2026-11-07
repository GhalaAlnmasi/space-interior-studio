import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Container } from "@/components/ui/Container";
import { homeCopy } from "@/lib/content";

export function Philosophy() {
  return (
    <section id="philosophy" className="border-t border-charcoal/10 py-24 md:py-32" aria-labelledby="philosophy-title">
      <ScrollReveal stagger>
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <SectionLabel index={homeCopy.philosophyIndex}>{homeCopy.philosophyLabel}</SectionLabel>
          </div>
          <div className="lg:col-span-8">
            <h2
              id="philosophy-title"
              className="font-display text-[clamp(2.7rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.03em]"
            >
              {homeCopy.philosophyTitle}
            </h2>
            <blockquote data-reveal className="mt-10 max-w-3xl font-display text-[clamp(1.8rem,3vw,2.7rem)] leading-snug italic text-charcoal">
              {homeCopy.philosophyQuote}
            </blockquote>
            <div className="mt-10 grid max-w-3xl gap-6 text-base leading-relaxed text-ink-soft md:grid-cols-2">
              {homeCopy.philosophyBody.map((paragraph) => (
                <p key={paragraph} data-reveal>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </ScrollReveal>
    </section>
  );
}
