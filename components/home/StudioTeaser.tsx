import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { homeCopy } from "@/lib/content";

export function StudioTeaser() {
  return (
    <section className="bg-charcoal text-ivory" aria-labelledby="studio-teaser-title">
      <Container className="grid gap-10 py-24 md:py-32 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <SectionLabel index={homeCopy.studioIndex} tone="dark">
            {homeCopy.studioLabel}
          </SectionLabel>
          <h2
            id="studio-teaser-title"
            className="mt-5 font-display text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.92] tracking-[-0.03em]"
          >
            {homeCopy.studioTitle}
          </h2>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="text-base leading-relaxed text-sand md:text-lg">{homeCopy.studioBody}</p>
          <ul className="mt-8 grid gap-px bg-sand/25 sm:grid-cols-2">
            {homeCopy.studioCapabilities.map((item) => (
              <li key={item.label} className="bg-charcoal px-4 py-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sand">{item.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-ivory/80">{item.note}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href="/studio" variant="inverse">
              {homeCopy.enter}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
