import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { getProjectBySlug } from "@/lib/projects";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("ProjectCard", () => {
  it("links the study title to its page", () => {
    const project = getProjectBySlug("maison-sable");
    if (!project) throw new Error("Expected Maison Sable to exist");

    render(<ProjectCard project={project} />);

    const link = screen.getByRole("link", { name: /Maison Sable/i });
    expect(link.getAttribute("href")).toBe("/spaces/maison-sable");
    expect(link.textContent).toContain("Marrakech");
  });
});
