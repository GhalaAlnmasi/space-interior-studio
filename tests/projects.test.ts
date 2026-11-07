import { describe, expect, it } from "vitest";
import {
  getAdjacentProjects,
  getAllProjects,
  getProjectBySlug,
  projectPath,
} from "@/lib/projects";

describe("project archive", () => {
  it("keeps slugs unique and routable", () => {
    const projects = getAllProjects();
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(projects.length).toBeGreaterThanOrEqual(3);

    for (const project of projects) {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      expect(projectPath(project.slug)).toBe(`/spaces/${project.slug}`);
      expect(project.narrative.length).toBeGreaterThan(0);
      expect(project.materials.length).toBeGreaterThan(0);
      expect(project.disclaimer.toLowerCase()).toContain("conceptual");
      expect(project.disclaimer.toLowerCase()).toContain("not a commissioned");
      expect(project.philosophy.length).toBeGreaterThan(20);
      expect(project.finishes.map((finish) => finish.name)).toEqual([...project.materials]);
      expect(project.finishes.every((finish) => finish.note.length > 0)).toBe(true);
      expect(project.planCaption.length).toBeGreaterThan(0);
      expect(project.sectionCaption.length).toBeGreaterThan(0);
    }
  });

  it("finds a study and the studies beside it", () => {
    const project = getProjectBySlug("north-room");
    expect(project?.title).toBe("North Room");
    expect(getProjectBySlug("missing")).toBeUndefined();

    const adjacent = getAdjacentProjects("north-room");
    expect(adjacent?.previous.slug).toBe("house-of-quiet-light");
    expect(adjacent?.next.slug).toBe("maison-sable");
    expect(getAdjacentProjects("missing")).toBeUndefined();
  });
});
