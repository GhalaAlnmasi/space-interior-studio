const conceptualDisclaimer =
  "A conceptual spatial study for this climate and brief. Not a commissioned project, and not a record of a built room.";

export const studyKindLabel = "Conceptual study";

export const projects = [
  {
    slug: "house-of-quiet-light",
    index: "01",
    title: "House of Quiet Light",
    location: "AlUla",
    typology: "Residence",
    plate: "courtyard",
    excerpt:
      "A courtyard residence where shade is the first room and limestone stays cool after noon.",
    summary:
      "A spatial study for a private residence organized around a square of open sky.",
    disclaimer: conceptualDisclaimer,
    inspiration: "Desert courtyard houses, where shade is planned before any furnishing.",
    philosophy:
      "Light is admitted only after it has crossed stone. The court is the tall room, and everything else stays low.",
    narrative: [
      "The plan is a sequence of shaded rooms around a court. Arrival is indirect, so the eye meets stone before it meets sunlight.",
      "Seating stays low and the horizon of the court remains the tallest event in the room. Linen is the only soft surface. Bronze appears once, as hardware and a bowl for water.",
      "The palette stays narrow: warm stone, olive shadow, and the pale dust color of late afternoon.",
    ],
    materials: ["Lime plaster", "Honed limestone", "Linen", "Oiled oak", "Bronze"],
    finishes: [
      { name: "Lime plaster", note: "Warm, matte, with a soft trowel mark left visible." },
      { name: "Honed limestone", note: "Cool underfoot, honed rather than polished." },
      { name: "Linen", note: "Sand colored, and used only on the seating." },
      { name: "Oiled oak", note: "Reserved for doors and one low bench." },
      { name: "Bronze", note: "Unlacquered hardware and a single water bowl." },
    ],
    gestures: ["Deep window reveals", "A shaded court", "Low seating", "One bronze line"],
    planCaption: "Shade wraps a square of sky. Seating stays on the long edge of the court.",
    sectionCaption: "The court is the tallest event. Openings are deep, and the seating line stays low.",
  },
  {
    slug: "north-room",
    index: "02",
    title: "North Room",
    location: "Copenhagen",
    typology: "Atelier",
    plate: "atelier",
    excerpt:
      "A north-lit workroom of pale plaster and oak, planned for long hours of quiet attention.",
    summary:
      "A spatial study for a single workroom where the weather outside is the only ornament.",
    disclaimer: conceptualDisclaimer,
    inspiration: "North-facing workrooms, where the sky is even and the furniture can stay few.",
    philosophy:
      "One window, one table, one path. Color is withheld so a change in the weather is enough.",
    narrative: [
      "The room is one volume with a tall north window. Work happens along the light, and storage is a wall rather than a collection of objects.",
      "Oak is reserved for the floor and one long table. Plaster does the rest. Color is almost absent, so a change in the sky is enough.",
      "The drawing keeps the ceiling high and the furniture few, leaving a clear path from door to window.",
    ],
    materials: ["Mineral plaster", "White oak", "Wool", "Linen", "Smoked glass"],
    finishes: [
      { name: "Mineral plaster", note: "Pale and dry, with almost no sheen." },
      { name: "White oak", note: "Floor and the long work table only." },
      { name: "Wool", note: "One rug, undyed, stopping short of the walls." },
      { name: "Linen", note: "A curtain, if the sky becomes too bright." },
      { name: "Smoked glass", note: "The storage wall, quiet enough to read as plaster." },
    ],
    gestures: ["A full-height north window", "One work table", "A storage wall", "Bare plaster"],
    planCaption: "Work runs along the glass. Storage is a wall, and the center of the room stays empty.",
    sectionCaption: "A high north window, a clear path beneath it, and a ceiling left unadorned.",
  },
  {
    slug: "maison-sable",
    index: "03",
    title: "Maison Sable",
    location: "Marrakech",
    typology: "Guest house",
    plate: "sable",
    excerpt:
      "Thick shade, sand-colored tadelakt, and a bronze basin in a house planned for heat.",
    summary:
      "A spatial study for a small guest house that treats shade as a material.",
    disclaimer: conceptualDisclaimer,
    inspiration: "Thick-walled guest houses, where the afternoon is delayed by mass and shade.",
    philosophy:
      "Heat is managed by thickness. The room steps down toward water, and pattern is refused.",
    narrative: [
      "Walls are thick enough to delay the afternoon. An arch holds the main room, and the floor steps down toward a basin.",
      "Tadelakt is left matte. Cedar is dark and used sparingly. Pattern is refused, except for the rhythm of shade across the floor.",
      "Guests move from bright court to dim room to a single opening that frames the evening sky.",
    ],
    materials: ["Tadelakt", "Cedar", "Single-tone zellige", "Linen", "Unlacquered bronze"],
    finishes: [
      { name: "Tadelakt", note: "Sand colored and left matte, not waxed to a shine." },
      { name: "Cedar", note: "Dark, and used for the door and a single bench." },
      { name: "Single-tone zellige", note: "The basin only, in one clay color." },
      { name: "Linen", note: "Loose covers, the only soft surface in the room." },
      { name: "Unlacquered bronze", note: "The basin rim and the door hardware." },
    ],
    gestures: ["A load-bearing arch", "A sunken floor", "A bronze basin", "Deep shade"],
    planCaption: "A short sequence from bright court to dim room, ending at the basin.",
    sectionCaption: "An arch, a step down, and one opening aimed at the evening sky.",
  },
] as const;

export type Project = (typeof projects)[number];
export type PlateVariant = Project["plate"] | "hero";

export function getAllProjects(): readonly Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function projectPath(slug: string): string {
  return `/spaces/${slug}`;
}

export function getAdjacentProjects(
  slug: string,
): { previous: Project; next: Project } | undefined {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) return undefined;
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  if (!previous || !next) return undefined;
  return { previous, next };
}
