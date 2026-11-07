import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { mainNav } from "@/lib/navigation";
import { getAllProjects, projectPath } from "@/lib/projects";
import { site } from "@/lib/site";

export function SiteFooter() {
  const projects = getAllProjects();

  return (
    <footer className="border-t border-charcoal/10 bg-ivory">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-display text-[clamp(4.5rem,12vw,8rem)] leading-none tracking-[-0.045em] text-charcoal">
              Space
            </p>
            <span aria-hidden="true" className="mt-5 block h-px w-16 bg-bronze" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">{site.tagline}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
              Conceptual studies, and a room model you can finish on this device.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:col-span-5 lg:col-start-8">
            <nav aria-label="Pages">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep">Index</p>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/" className="inline-flex min-h-11 items-center text-sm hover:text-bronze-deep">
                    Home
                  </Link>
                </li>
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="inline-flex min-h-11 items-center text-sm hover:text-bronze-deep">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Studies">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-sage-deep">Studies</p>
              <ul className="mt-4 space-y-2">
                {projects.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={projectPath(project.slug)}
                      className="inline-flex min-h-11 items-center text-sm hover:text-bronze-deep"
                    >
                      {project.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-charcoal/10 pt-6 text-[11px] uppercase tracking-[0.18em] text-sage-deep sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.copyrightYear} {site.name}
          </p>
          <p>{site.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
