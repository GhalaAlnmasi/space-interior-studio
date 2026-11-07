export type NavLink = {
  href: string;
  label: string;
};

export const mainNav = [
  { href: "/spaces", label: "Spaces" },
  { href: "/studio", label: "Studio" },
  { href: "/about", label: "About" },
] as const satisfies readonly NavLink[];

export const knownRoutes = ["/", "/spaces", "/studio", "/about"] as const;

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isKnownRoute(href: string): boolean {
  if ((knownRoutes as readonly string[]).includes(href)) return true;
  return href.startsWith("/spaces/");
}
