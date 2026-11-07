"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type RouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RouteError({ reset }: RouteErrorProps) {
  return (
    <Container className="py-24 md:py-36">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sage-deep">Interrupted</p>
      <h1 className="mt-5 max-w-3xl font-display text-[clamp(3rem,7vw,5.4rem)] leading-[0.92] tracking-[-0.035em]">
        This page did not finish loading.
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
        Try the page again, or return to the rest of the studio.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center justify-center bg-charcoal px-6 text-[11px] font-medium uppercase tracking-[0.22em] text-ivory"
        >
          Try again
        </button>
        <Button href="/" variant="secondary">
          Return home
        </Button>
      </div>
    </Container>
  );
}
