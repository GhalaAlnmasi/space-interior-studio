import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/layout/SiteHeader";

const pathname = vi.hoisted(() => ({ current: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
}));

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

describe("SiteHeader", () => {
  beforeEach(() => {
    pathname.current = "/studio";
  });

  it("links to every primary page and marks the current one", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "SPACE, home" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "Spaces" }).getAttribute("href")).toBe("/spaces");
    expect(screen.getByRole("link", { name: "Studio" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "About" }).getAttribute("href")).toBe("/about");
  });

  it("opens the menu and closes it from the keyboard", () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded")).toBe("true");

    const spaceLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("href") === "/spaces");
    expect(spaceLinks).toHaveLength(2);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
    expect(screen.getAllByRole("link").filter((link) => link.getAttribute("href") === "/spaces")).toHaveLength(1);
  });
});
