"use client";

import { useLayoutEffect, useRef } from "react";
import { StudyPlate } from "@/components/ui/StudyPlate";

export function HeroPlate() {
  const plate = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = plate.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let context: { revert: () => void } | undefined;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !plate.current) return;

      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.to(plate.current, {
          y: 48,
          ease: "none",
          scrollTrigger: {
            trigger: plate.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }, plate.current);
      if (cancelled) context.revert();
    })();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  return (
    <div ref={plate} className="h-[112%] w-full will-change-transform">
      <StudyPlate variant="hero" label="Architectural study of a sunlit room corner" />
    </div>
  );
}
