import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type PageHeaderProps = {
  index: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function PageHeader({ index, eyebrow, title, children }: PageHeaderProps) {
  return (
    <header className="border-b border-charcoal/10">
      <Container className="grid gap-8 py-16 md:py-24 lg:grid-cols-12 lg:gap-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sage-deep lg:col-span-3">
          {index}
          <span aria-hidden="true"> — </span>
          {eyebrow}
        </p>
        <div className="lg:col-span-8 lg:col-start-5">
          <h1 className="font-display text-[clamp(3.4rem,8vw,6.75rem)] leading-[0.88] tracking-[-0.035em] text-charcoal">
            {title}
          </h1>
          <div className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
            {children}
          </div>
        </div>
      </Container>
    </header>
  );
}
