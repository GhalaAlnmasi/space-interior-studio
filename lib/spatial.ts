export type FurnitureId = "sofa" | "coffee-table" | "plant";
export type SofaVariant = "modern" | "rounded";
export type TableVariant = "rectangular" | "sculptural";
export type PlantVariant = "tall" | "compact";
export type MoveDirection = "left" | "right" | "window" | "opening";

export type FurniturePlacement<Variant extends string> = {
  variant: Variant;
  position: { x: number; z: number };
};

export type FurnitureLayout = {
  sofa: FurniturePlacement<SofaVariant>;
  "coffee-table": FurniturePlacement<TableVariant>;
  plant: FurniturePlacement<PlantVariant>;
};

type Footprint = { width: number; depth: number };
type Rect = Footprint & { x: number; z: number };

export const furnitureIds = ["sofa", "coffee-table", "plant"] as const satisfies readonly FurnitureId[];

export const CLEARANCE = 0.08;
export const MOVE_STEP = 0.12;
export const VARIANT_SEARCH_RADIUS = 0.64;

/**
 * Usable floor, inside the plaster and short of the open edges.
 * Furniture rotation is fixed, so every footprint is an axis-aligned box.
 * The window sill sits above the furniture and is not a floor obstacle.
 */
export const roomBounds = {
  minX: -2.42,
  maxX: 2.42,
  minZ: -2.05,
  maxZ: 2.05,
};

export const footprints: {
  sofa: Record<SofaVariant, Footprint>;
  "coffee-table": Record<TableVariant, Footprint>;
  plant: Record<PlantVariant, Footprint>;
} = {
  sofa: {
    modern: { width: 2.1, depth: 0.86 },
    rounded: { width: 1.86, depth: 1.02 },
  },
  "coffee-table": {
    rectangular: { width: 1.22, depth: 0.72 },
    sculptural: { width: 0.92, depth: 0.92 },
  },
  plant: {
    tall: { width: 0.56, depth: 0.56 },
    compact: { width: 0.4, depth: 0.4 },
  },
};

/** The corner lamp is fixed. Its base occupies this patch of floor. */
export const fixedObstacles: readonly Rect[] = [{ x: -2.02, z: -1.62, width: 0.28, depth: 0.28 }];

export const defaultLayout: FurnitureLayout = {
  sofa: { variant: "modern", position: { x: -0.08, z: -1.28 } },
  "coffee-table": { variant: "rectangular", position: { x: -0.02, z: -0.36 } },
  plant: { variant: "tall", position: { x: -2.12, z: 0.62 } },
};

export const furnitureCatalog = {
  sofa: {
    label: "Sofa",
    variants: [
      { id: "modern", label: "Low profile", description: "A long seat with separate cushions." },
      { id: "rounded", label: "Rounded lounge", description: "A lower seat with soft arms." },
    ],
  },
  "coffee-table": {
    label: "Coffee table",
    variants: [
      { id: "rectangular", label: "Travertine rectangle", description: "A stone top on a metal frame." },
      { id: "sculptural", label: "Sculptural round", description: "A round stone top on a pedestal." },
    ],
  },
  plant: {
    label: "Plant",
    variants: [
      { id: "tall", label: "Tall architectural", description: "A narrow pot and an upright plant." },
      { id: "compact", label: "Compact sculptural", description: "A low pot and a dense crown." },
    ],
  },
} as const;

const variantIds: Record<FurnitureId, readonly string[]> = {
  sofa: furnitureCatalog.sofa.variants.map((item) => item.id),
  "coffee-table": furnitureCatalog["coffee-table"].variants.map((item) => item.id),
  plant: furnitureCatalog.plant.variants.map((item) => item.id),
};

export const editorCopy = {
  furniture: "Furniture",
  selected: "Selected",
  none: "Select the sofa, table, or plant.",
  dragHint: "On a large screen, drag a selected piece across the floor. The buttons move it along the room.",
  nudge: "Move",
  left: "Left",
  right: "Right",
  window: "Window",
  opening: "Opening",
  undo: "Undo",
  redo: "Redo",
  clearSelection: "Clear selection",
  blocked: "That piece is against the room or another object.",
  variantFit: "The new form needed a little space, so the piece shifted to fit.",
  variantReject: "That form does not fit here. Move the piece, then try again.",
  undone: "The previous design is restored.",
  redone: "The change is applied again.",
  migrated: "An earlier finish set was restored. Furniture stays in the original arrangement until you save.",
  perspectiveSave: "Save perspective",
  perspectiveRestore: "Restore perspective",
  perspectiveClear: "Clear perspective",
  perspectiveSaved: "This view is saved on this device, separate from the design.",
  perspectiveRestored: "The saved view is restored. Finishes and furniture stay as they are.",
  perspectiveCleared: "The saved view is cleared.",
  perspectiveInvalid: "This view cannot be saved. Move within the room and try again.",
  perspectiveEmpty: "There is no saved view yet.",
  perspectiveUnavailable: "This browser cannot store a view on this device.",
} as const;

export function footprintOf(id: FurnitureId, variant: string): Footprint | null {
  const table = footprints[id] as Record<string, Footprint>;
  return table[variant] ?? null;
}

function inflate(rect: Rect, margin: number): Rect {
  return { x: rect.x, z: rect.z, width: rect.width + margin * 2, depth: rect.depth + margin * 2 };
}

export function rectanglesOverlap(left: Rect, right: Rect): boolean {
  return Math.abs(left.x - right.x) * 2 < left.width + right.width && Math.abs(left.z - right.z) * 2 < left.depth + right.depth;
}

export function insideRoom(rect: Rect, bounds = roomBounds): boolean {
  return (
    rect.x - rect.width / 2 >= bounds.minX &&
    rect.x + rect.width / 2 <= bounds.maxX &&
    rect.z - rect.depth / 2 >= bounds.minZ &&
    rect.z + rect.depth / 2 <= bounds.maxZ
  );
}

function rectFor(id: FurnitureId, layout: FurnitureLayout, at?: { x: number; z: number }): Rect | null {
  const piece = layout[id];
  const size = footprintOf(id, piece.variant);
  if (!size) return null;
  return { ...size, x: at?.x ?? piece.position.x, z: at?.z ?? piece.position.z };
}

export function canOccupy(layout: FurnitureLayout, id: FurnitureId, x: number, z: number): boolean {
  if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
  const rect = rectFor(id, layout, { x, z });
  if (!rect || !insideRoom(rect)) return false;
  for (const obstacle of fixedObstacles) {
    if (rectanglesOverlap(rect, inflate(obstacle, CLEARANCE))) return false;
  }
  for (const other of furnitureIds) {
    if (other === id) continue;
    const neighbor = rectFor(other, layout);
    if (!neighbor) return false;
    if (rectanglesOverlap(rect, inflate(neighbor, CLEARANCE))) return false;
  }
  return true;
}

export function layoutValid(layout: FurnitureLayout): boolean {
  for (const id of furnitureIds) {
    const piece = layout[id];
    if (!piece?.position || !variantIds[id].includes(piece.variant)) return false;
    if (!canOccupy(layout, id, piece.position.x, piece.position.z)) return false;
  }
  return true;
}

function roundCoord(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function moveFurniture(layout: FurnitureLayout, id: FurnitureId, x: number, z: number): { x: number; z: number } {
  const start = layout[id].position;
  if (!Number.isFinite(x) || !Number.isFinite(z) || !canOccupy(layout, id, start.x, start.z)) {
    return { x: start.x, z: start.z };
  }

  const distance = Math.hypot(x - start.x, z - start.z);
  const steps = Math.max(1, Math.ceil(distance / 0.04));
  let currentX = start.x;
  let currentZ = start.z;

  for (let step = 1; step <= steps; step += 1) {
    const nextX = start.x + ((x - start.x) * step) / steps;
    const nextZ = start.z + ((z - start.z) * step) / steps;
    if (canOccupy(layout, id, nextX, nextZ)) {
      currentX = nextX;
      currentZ = nextZ;
      continue;
    }
    if (canOccupy(layout, id, nextX, currentZ)) currentX = nextX;
    if (canOccupy(layout, id, currentX, nextZ)) currentZ = nextZ;
    break;
  }

  return { x: roundCoord(currentX), z: roundCoord(currentZ) };
}

export function nudgeFurniture(layout: FurnitureLayout, id: FurnitureId, direction: MoveDirection, step = MOVE_STEP): FurnitureLayout {
  const delta = {
    left: [-step, 0],
    right: [step, 0],
    window: [0, -step],
    opening: [0, step],
  }[direction];
  const position = layout[id].position;
  const next = moveFurniture(layout, id, position.x + delta[0], position.z + delta[1]);
  if (Math.abs(next.x - position.x) < 0.0001 && Math.abs(next.z - position.z) < 0.0001) return layout;
  return {
    ...layout,
    [id]: { ...layout[id], position: next },
  };
}

export function placeVariant<Id extends FurnitureId>(
  layout: FurnitureLayout,
  id: Id,
  variant: FurnitureLayout[Id]["variant"],
  options?: { maxRadius?: number },
): FurnitureLayout | null {
  if (!footprintOf(id, variant)) return null;
  const origin = layout[id].position;
  const maxRadius = options?.maxRadius ?? VARIANT_SEARCH_RADIUS;

  const candidateAt = (x: number, z: number): FurnitureLayout | null => {
    const candidate = {
      ...layout,
      [id]: { variant, position: { x, z } },
    } as FurnitureLayout;
    return canOccupy(candidate, id, x, z) ? candidate : null;
  };

  const current = candidateAt(origin.x, origin.z);
  if (current) return current;

  for (let radius = 0.08; radius <= maxRadius + 0.0001; radius += 0.08) {
    for (let step = 0; step < 8; step += 1) {
      const angle = (Math.PI / 4) * step;
      const found = candidateAt(roundCoord(origin.x + Math.cos(angle) * radius), roundCoord(origin.z + Math.sin(angle) * radius));
      if (found) return found;
    }
  }

  return null;
}

export function samePosition(left: { x: number; z: number }, right: { x: number; z: number }): boolean {
  return Math.abs(left.x - right.x) < 0.0001 && Math.abs(left.z - right.z) < 0.0001;
}
