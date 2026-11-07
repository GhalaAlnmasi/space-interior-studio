import { describe, expect, it } from "vitest";
import { isKnownRoute, isNavItemActive, knownRoutes, mainNav } from "@/lib/navigation";
import { getAllProjects, projectPath } from "@/lib/projects";

describe("navigation", () => {
  it("points the header at real pages", () => {
    expect(mainNav.map((item) => item.href)).toEqual(["/spaces", "/studio", "/about"]);
    for (const item of mainNav) {
      expect(knownRoutes).toContain(item.href);
      expect(isKnownRoute(item.href)).toBe(true);
    }
  });

  it("treats a study page as part of Spaces", () => {
    expect(isNavItemActive("/spaces/maison-sable", "/spaces")).toBe(true);
    expect(isNavItemActive("/studio", "/spaces")).toBe(false);
    expect(isNavItemActive("/", "/")).toBe(true);
    expect(isNavItemActive("/about", "/")).toBe(false);
  });

  it("keeps study links inside the known archive", () => {
    for (const project of getAllProjects()) {
      expect(isKnownRoute(projectPath(project.slug))).toBe(true);
    }
  });
});
