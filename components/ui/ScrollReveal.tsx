"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
};

export function ScrollReveal({ children, className, stagger = false }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let cancelled = false;
    let context: { revert: () => void } | undefined;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const items = stagger ? element.querySelectorAll("[data-reveal]") : [];
        const targets = items.length > 0 ? items : element;
        gsap.from(targets, {
          autoAlpha: 0,
          y: 28,
          duration: 1.05,
          ease: "power3.out",
          stagger: items.length > 0 ? 0.08 : 0,
          scrollTrigger: {
            trigger: element,
            start: "top 84%",
            once: true,
          },
        });
      }, element);
      if (cancelled) context.revert();
    })();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
