import { copyDesign, type StudioDesign } from "@/lib/history";
import { defaultLayout, layoutValid, type FurnitureId, type FurnitureLayout } from "@/lib/spatial";
import {
  browserDesignStorage,
  defaultConfiguration,
  isStudioConfiguration,
  parseStoredDesign,
  STUDIO_STORAGE_KEY,
  type DesignStorage,
  type StudioConfiguration,
} from "@/lib/studio-config";

export const STUDIO_DESIGN_KEY = "space-studio-config-v2";
export const STUDIO_DESIGN_VERSION = 2;

export const defaultDesign: StudioDesign = {
  configuration: defaultConfiguration,
  layout: defaultLayout,
};

export type DesignSnapshot = {
  design: StudioDesign;
  restored: boolean;
  migrated: boolean;
};

export type StudioParseResult =
  | { ok: true; design: StudioDesign; migrated: boolean }
  | { ok: false; reason: "empty" | "invalid" | "version" };

const sofaVariants = new Set(["modern", "rounded"]);
const tableVariants = new Set(["rectangular", "sculptural"]);
const plantVariants = new Set(["tall", "compact"]);

export const serverDesignSnapshot: DesignSnapshot = {
  design: defaultDesign,
  restored: false,
  migrated: false,
};

function parsePiece<Variant extends string>(value: unknown, allowed: Set<string>): { variant: Variant; position: { x: number; z: number } } | null {
  if (!value || typeof value !== "object") return null;
  const record = value as { variant?: unknown; position?: { x?: unknown; z?: unknown } };
  if (typeof record.variant !== "string" || !allowed.has(record.variant)) return null;
  const x = record.position?.x;
  const z = record.position?.z;
  if (typeof x !== "number" || typeof z !== "number" || !Number.isFinite(x) || !Number.isFinite(z)) return null;
  return { variant: record.variant as Variant, position: { x, z } };
}

export function parseLayout(value: unknown): FurnitureLayout | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const sofa = parsePiece(record.sofa, sofaVariants);
  const table = parsePiece(record["coffee-table"], tableVariants);
  const plant = parsePiece(record.plant, plantVariants);
  if (!sofa || !table || !plant) return null;
  const layout = { sofa, "coffee-table": table, plant } as FurnitureLayout;
  return layoutValid(layout) ? layout : null;
}

export function serializeStudioDesign(design: StudioDesign): string {
  return JSON.stringify({
    version: STUDIO_DESIGN_VERSION,
    configuration: design.configuration,
    layout: design.layout,
  });
}

export function parseStudioDesign(raw: string | null): StudioParseResult {
  if (raw == null || raw.trim() === "") return { ok: false, reason: "empty" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "invalid" };
  }

  if (!parsed || typeof parsed !== "object") return { ok: false, reason: "invalid" };
  const record = parsed as { version?: unknown; configuration?: unknown; layout?: unknown };

  if (record.version === 1) {
    if (!isStudioConfiguration(record.configuration)) return { ok: false, reason: "invalid" };
    return {
      ok: true,
      migrated: true,
      design: { configuration: record.configuration, layout: defaultLayout },
    };
  }

  if (record.version !== STUDIO_DESIGN_VERSION) return { ok: false, reason: "version" };
  if (!isStudioConfiguration(record.configuration)) return { ok: false, reason: "invalid" };
  const layout = parseLayout(record.layout);
  if (!layout) return { ok: false, reason: "invalid" };
  return { ok: true, migrated: false, design: { configuration: record.configuration, layout } };
}

function readKey(storage: DesignStorage | null, key: string): string | null {
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStudioDesign(storage: DesignStorage | null, design: StudioDesign): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STUDIO_DESIGN_KEY, serializeStudioDesign(design));
    return true;
  } catch {
    return false;
  }
}

let cachedToken: string | undefined;
let cachedSnapshot: DesignSnapshot = serverDesignSnapshot;

export function readDesignSnapshot(): DesignSnapshot {
  const storage = browserDesignStorage();
  const current = readKey(storage, STUDIO_DESIGN_KEY);
  const previous = readKey(storage, STUDIO_STORAGE_KEY);
  const token = `${current ?? ""}\u0000${previous ?? ""}`;
  if (token === cachedToken) return cachedSnapshot;
  cachedToken = token;

  if (current && current.trim() !== "") {
    const parsed = parseStudioDesign(current);
    cachedSnapshot = parsed.ok ? { design: copyDesign(parsed.design), restored: true, migrated: false } : serverDesignSnapshot;
    return cachedSnapshot;
  }

  const legacy = parseStoredDesign(previous);
  cachedSnapshot = legacy.ok
    ? { design: { configuration: legacy.configuration, layout: defaultLayout }, restored: true, migrated: true }
    : serverDesignSnapshot;
  return cachedSnapshot;
}

export function rememberStoredStudio(design: StudioDesign) {
  cachedToken = `${serializeStudioDesign(design)}\u0000`;
  cachedSnapshot = { design: copyDesign(design), restored: true, migrated: false };
}

export function designWithConfiguration(design: StudioDesign, configuration: StudioConfiguration): StudioDesign {
  return { configuration, layout: design.layout };
}

export function designWithLayout(design: StudioDesign, layout: FurnitureLayout): StudioDesign {
  return { configuration: design.configuration, layout };
}

export function pieceLabel(id: FurnitureId): string {
  if (id === "coffee-table") return "Coffee table";
  if (id === "plant") return "Plant";
  return "Sofa";
}
