"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { isNavItemActive, mainNav } from "@/lib/navigation";
import { site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const panelId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        menuButtonRef.current?.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    firstLinkRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        solid ? "border-b border-charcoal/10 bg-ivory/95 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="text-[13px] font-medium tracking-[0.42em] text-charcoal"
          aria-label={`${site.name}, home`}
        >
          {site.name}
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {mainNav.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center text-[11px] font-medium uppercase tracking-[0.22em]",
                      active ? "text-charcoal" : "text-sage-deep hover:text-charcoal",
                    )}
                  >
                    <span className={cn("border-b pb-1", active ? "border-bronze" : "border-transparent")}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex size-11 items-center justify-center text-charcoal md:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpenPath(open ? null : pathname)}
        >
          {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>
      </Container>
      <div id={panelId} hidden={!open} className="border-t border-charcoal/10 bg-ivory md:hidden">
        <nav aria-label="Mobile" className="px-5 py-4">
          <ul className="flex flex-col">
            {mainNav.map((item, index) => {
              const active = isNavItemActive(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-charcoal/10">
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="flex min-h-12 items-center justify-between font-display text-4xl text-charcoal"
                    onClick={() => setOpenPath(null)}
                  >
                    {item.label}
                    <span className="font-sans text-[11px] tracking-[0.22em] text-sage-deep">{item.href}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
