import { HeroPlate } from "@/components/home/HeroPlate";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { homeCopy } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative -mt-16 overflow-hidden">
      <Container className="grid min-h-svh items-center gap-10 py-24 lg:grid-cols-12 lg:gap-8 lg:py-28">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <p className="hero-rise text-[11px] font-medium uppercase tracking-[0.32em] text-sage-deep">
            {homeCopy.heroEyebrow}
          </p>
          <h1 className="mt-6 max-w-[11ch] font-display text-[clamp(3.4rem,8vw,7.4rem)] leading-[0.84] tracking-[-0.04em] text-charcoal">
            <span className="hero-rise delay-1 block">{homeCopy.heroTitleLead}</span>
            <span className="hero-rise delay-2 block italic text-bronze">{homeCopy.heroTitleEmphasis}</span>
            <span className="hero-rise delay-3 block">{homeCopy.heroTitleClose}</span>
          </h1>
          <p className="hero-rise delay-4 mt-8 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
            {homeCopy.heroBody}
          </p>
          <div className="hero-rise delay-5 mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/spaces">{homeCopy.explore}</Button>
            <Button href="/studio" variant="secondary">
              {homeCopy.enter}
            </Button>
          </div>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep">
            {homeCopy.fields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
          <div className="hero-rise delay-2 relative aspect-[4/5] overflow-hidden border border-charcoal/15 bg-ivory-deep sm:aspect-[5/4] lg:aspect-[4/5]">
            <HeroPlate />
            <p className="pointer-events-none absolute bottom-4 left-4 text-[11px] font-medium uppercase tracking-[0.24em] text-charcoal">
              01
            </p>
          </div>
          <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep">
            {homeCopy.plateCaption}
          </p>
        </div>
      </Container>
      <a
        href="#philosophy"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep lg:flex"
      >
        <span>The practice</span>
        <span aria-hidden="true" className="scroll-cue" />
      </a>
    </section>
  );
}
