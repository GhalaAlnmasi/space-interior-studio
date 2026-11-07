import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { mainNav } from "@/lib/navigation";
import { site } from "@/lib/site";

export function HeaderFallback() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-transparent">
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
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-[11px] font-medium uppercase tracking-[0.22em] text-sage-deep"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
