import type { ReactNode } from "react";

type SectionLabelProps = {
  index: string;
  children: ReactNode;
  tone?: "light" | "dark";
};

export function SectionLabel({ index, children, tone = "light" }: SectionLabelProps) {
  const ink = tone === "dark" ? "text-sand" : "text-sage-deep";
  const line = tone === "dark" ? "bg-sand/60" : "bg-charcoal/20";

  return (
    <p className={`flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] ${ink}`}>
      <span>{index}</span>
      <span className={`h-px w-8 ${line}`} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
