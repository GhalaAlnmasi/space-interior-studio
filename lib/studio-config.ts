export type SofaFabric = "linen" | "boucle" | "velvet";
export type SofaColor = "ivory" | "sand" | "sage" | "terracotta" | "charcoal";
export type FloorFinish = "natural-oak" | "dark-walnut" | "light-ash";
export type WallFinish = "warm-ivory" | "sage" | "soft-clay";
export type LightingMode = "daylight" | "golden-hour" | "evening";

export type StudioConfiguration = {
  sofaFabric: SofaFabric;
  sofaColor: SofaColor;
  floorFinish: FloorFinish;
  wallFinish: WallFinish;
  lightingMode: LightingMode;
};

export type FinishOption<T extends string> = {
  id: T;
  label: string;
  description: string;
  swatch: string;
};

export const sofaFabrics = [
  { id: "linen", label: "Linen", description: "Matte, with a fine weave.", swatch: "#E7DCCB", roughness: 0.94, metalness: 0 },
  { id: "boucle", label: "Bouclé", description: "A looped cloth with soft irregularity.", swatch: "#E4D5C4", roughness: 0.9, metalness: 0 },
  { id: "velvet", label: "Velvet", description: "Smooth, with a light directional sheen.", swatch: "#D9CBBA", roughness: 0.38, metalness: 0.08 },
] as const satisfies readonly (FinishOption<SofaFabric> & { roughness: number; metalness: number })[];

export const sofaColors = [
  { id: "ivory", label: "Ivory", description: "A pale cloth, close to the plaster.", swatch: "#E7E0D4" },
  { id: "sand", label: "Sand", description: "The original warm linen tone.", swatch: "#D8CCBA" },
  { id: "sage", label: "Sage", description: "A muted green, kept dusty.", swatch: "#8B927C" },
  { id: "terracotta", label: "Terracotta", description: "A fired clay color, not a bright orange.", swatch: "#C48A6A" },
  { id: "charcoal", label: "Charcoal", description: "A deep neutral for the seating only.", swatch: "#3E453C" },
] as const satisfies readonly FinishOption<SofaColor>[];

export const floorFinishes = [
  { id: "natural-oak", label: "Natural oak", description: "Warm grain and a low sheen.", swatch: "#C6A57C", roughness: 0.72, trim: "#8A6244" },
  { id: "dark-walnut", label: "Dark walnut", description: "A deeper timber with tighter grain.", swatch: "#6B4632", roughness: 0.64, trim: "#4A3024" },
  { id: "light-ash", label: "Light ash", description: "A pale floor with a dry surface.", swatch: "#E4D2B8", roughness: 0.8, trim: "#B89A78" },
] as const satisfies readonly (FinishOption<FloorFinish> & { roughness: number; trim: string })[];

export const wallFinishes = [
  { id: "warm-ivory", label: "Warm ivory", description: "The original plaster.", swatch: "#F3EEE6", shade: "#E4DCD0" },
  { id: "sage", label: "Sage", description: "A gray-green plaster, still matte.", swatch: "#D5DBC9", shade: "#C5CDB8" },
  { id: "soft-clay", label: "Soft clay", description: "A warm blush, short of terracotta.", swatch: "#E6D2C4", shade: "#D8C2B2" },
] as const satisfies readonly (FinishOption<WallFinish> & { shade: string })[];

export type LightingRecipe = {
  id: LightingMode;
  label: string;
  description: string;
  swatch: string;
  ambientIntensity: number;
  ambientColor: string;
  hemisphereSky: string;
  hemisphereGround: string;
  hemisphereIntensity: number;
  sunColor: string;
  sunIntensity: number;
  sunPosition: [number, number, number];
  fillColor: string;
  fillIntensity: number;
  fillPosition: [number, number, number];
  exposure: number;
  background: string;
  lampIntensity: number;
  glassColor: string;
  glassOpacity: number;
};

export const lightingModes = [
  {
    id: "daylight",
    label: "Daylight",
    description: "Clear warm daylight from the window.",
    swatch: "#F4EFE6",
    ambientIntensity: 0.2,
    ambientColor: "#F4EFE6",
    hemisphereSky: "#F7F2E8",
    hemisphereGround: "#CDB89A",
    hemisphereIntensity: 0.34,
    sunColor: "#FFF3E4",
    sunIntensity: 2.15,
    sunPosition: [1.7, 3.5, -0.35],
    fillColor: "#F6EDE2",
    fillIntensity: 0.34,
    fillPosition: [-1.4, 2.2, 2.5],
    exposure: 0.92,
    background: "#EFEAE2",
    lampIntensity: 0,
    glassColor: "#F7F3EA",
    glassOpacity: 0.22,
  },
  {
    id: "golden-hour",
    label: "Golden hour",
    description: "A lower sun and an amber cast.",
    swatch: "#E7C39A",
    ambientIntensity: 0.14,
    ambientColor: "#F3E0C8",
    hemisphereSky: "#F0C99A",
    hemisphereGround: "#C4A27A",
    hemisphereIntensity: 0.28,
    sunColor: "#FFC58A",
    sunIntensity: 2.45,
    sunPosition: [2.6, 1.35, -0.15],
    fillColor: "#F0D2B0",
    fillIntensity: 0.22,
    fillPosition: [-1.6, 1.4, 2.2],
    exposure: 0.98,
    background: "#E7D3B8",
    lampIntensity: 0.15,
    glassColor: "#F6D7B0",
    glassOpacity: 0.28,
  },
  {
    id: "evening",
    label: "Evening",
    description: "Dim daylight and a warm lamp in the corner.",
    swatch: "#C4B39A",
    ambientIntensity: 0.07,
    ambientColor: "#E7DDD0",
    hemisphereSky: "#8E8A84",
    hemisphereGround: "#6A5344",
    hemisphereIntensity: 0.16,
    sunColor: "#C9D4E0",
    sunIntensity: 0.22,
    sunPosition: [1.4, 2.8, -0.5],
    fillColor: "#E8C8A4",
    fillIntensity: 0.12,
    fillPosition: [-1.2, 1.6, 2.1],
    exposure: 0.86,
    background: "#D9D0C4",
    lampIntensity: 2.4,
    glassColor: "#243042",
    glassOpacity: 0.55,
  },
] as const satisfies readonly LightingRecipe[];

export const defaultConfiguration = {
  sofaFabric: "linen",
  sofaColor: "sand",
  floorFinish: "natural-oak",
  wallFinish: "warm-ivory",
  lightingMode: "daylight",
} as const satisfies StudioConfiguration;

export const curatedDesigns = [
  defaultConfiguration,
  { sofaFabric: "boucle", sofaColor: "ivory", floorFinish: "light-ash", wallFinish: "sage", lightingMode: "golden-hour" },
  { sofaFabric: "velvet", sofaColor: "terracotta", floorFinish: "dark-walnut", wallFinish: "soft-clay", lightingMode: "evening" },
  { sofaFabric: "linen", sofaColor: "sage", floorFinish: "natural-oak", wallFinish: "warm-ivory", lightingMode: "daylight" },
  { sofaFabric: "velvet", sofaColor: "charcoal", floorFinish: "dark-walnut", wallFinish: "warm-ivory", lightingMode: "evening" },
  { sofaFabric: "boucle", sofaColor: "sand", floorFinish: "light-ash", wallFinish: "soft-clay", lightingMode: "golden-hour" },
] as const satisfies readonly StudioConfiguration[];

export const STUDIO_STORAGE_KEY = "space-studio-config-v1";
export const STUDIO_STORAGE_VERSION = 1;
export const LIGHTING_TRANSITION_MS = 720;

export const configuratorCopy = {
  title: "Configure",
  open: "Configure room",
  close: "Hide finishes",
  fabric: "Fabric",
  color: "Color",
  floor: "Floor",
  walls: "Walls",
  light: "Light",
  camera: "Camera",
  save: "Save design",
  resetDesign: "Reset design",
  randomize: "Randomize",
  saved: "Design saved on this device. It is not stored in an account.",
  restored: "Saved design restored from this device.",
  unavailable: "This browser cannot store a design on this device.",
  resetNote:
    "Reset design restores the original finishes, light, and furniture. It does not move the camera, and it does not erase a saved design until you save again.",
  randomNote: "Randomize chooses a prepared combination and leaves the furniture where it is. It does not replace a saved design until you save.",
  panelLabel: "Room finishes",
} as const;

const fabricIds = new Set<string>(sofaFabrics.map((item) => item.id));
const colorIds = new Set<string>(sofaColors.map((item) => item.id));
const floorIds = new Set<string>(floorFinishes.map((item) => item.id));
const wallIds = new Set<string>(wallFinishes.map((item) => item.id));
const lightIds = new Set<string>(lightingModes.map((item) => item.id));

export function isStudioConfiguration(value: unknown): value is StudioConfiguration {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.sofaFabric === "string" &&
    fabricIds.has(record.sofaFabric) &&
    typeof record.sofaColor === "string" &&
    colorIds.has(record.sofaColor) &&
    typeof record.floorFinish === "string" &&
    floorIds.has(record.floorFinish) &&
    typeof record.wallFinish === "string" &&
    wallIds.has(record.wallFinish) &&
    typeof record.lightingMode === "string" &&
    lightIds.has(record.lightingMode)
  );
}

export function getSofaFabric(id: SofaFabric) {
  return sofaFabrics.find((item) => item.id === id) ?? sofaFabrics[0];
}

export function getSofaColor(id: SofaColor) {
  return sofaColors.find((item) => item.id === id) ?? sofaColors[1];
}

export function getFloorFinish(id: FloorFinish) {
  return floorFinishes.find((item) => item.id === id) ?? floorFinishes[0];
}

export function getWallFinish(id: WallFinish) {
  return wallFinishes.find((item) => item.id === id) ?? wallFinishes[0];
}

export function getLightingRecipe(id: LightingMode): LightingRecipe {
  return lightingModes.find((item) => item.id === id) ?? lightingModes[0];
}

export function withConfigurationOption<Key extends keyof StudioConfiguration>(
  configuration: StudioConfiguration,
  key: Key,
  value: StudioConfiguration[Key],
): StudioConfiguration | null {
  const next = { ...configuration, [key]: value };
  return isStudioConfiguration(next) ? next : null;
}

export function sameConfiguration(left: StudioConfiguration, right: StudioConfiguration): boolean {
  return (
    left.sofaFabric === right.sofaFabric &&
    left.sofaColor === right.sofaColor &&
    left.floorFinish === right.floorFinish &&
    left.wallFinish === right.wallFinish &&
    left.lightingMode === right.lightingMode
  );
}

export function randomConfiguration(current: StudioConfiguration, random: () => number = Math.random): StudioConfiguration {
  const choices = curatedDesigns.filter((design) => !sameConfiguration(design, current));
  const pool = choices.length > 0 ? choices : curatedDesigns;
  const index = Math.min(pool.length - 1, Math.max(0, Math.floor(random() * pool.length)));
  return pool[index] ?? defaultConfiguration;
}

export function lightingTransitionMs(reduceMotion: boolean): number {
  return reduceMotion ? 0 : LIGHTING_TRANSITION_MS;
}

export type StoredDesignResult =
  | { ok: true; configuration: StudioConfiguration }
  | { ok: false; reason: "empty" | "invalid" | "version" };

export function serializeDesign(configuration: StudioConfiguration): string {
  return JSON.stringify({ version: STUDIO_STORAGE_VERSION, configuration });
}

export function parseStoredDesign(raw: string | null): StoredDesignResult {
  if (raw == null || raw.trim() === "") return { ok: false, reason: "empty" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "invalid" };
  }

  if (!parsed || typeof parsed !== "object") return { ok: false, reason: "invalid" };
  const record = parsed as { version?: unknown; configuration?: unknown };
  if (record.version !== STUDIO_STORAGE_VERSION) return { ok: false, reason: "version" };
  if (!isStudioConfiguration(record.configuration)) return { ok: false, reason: "invalid" };
  return { ok: true, configuration: record.configuration };
}

export type DesignStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export function readStoredRaw(storage: DesignStorage | null): string | null {
  if (!storage) return null;
  try {
    return storage.getItem(STUDIO_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeStoredDesign(storage: DesignStorage | null, configuration: StudioConfiguration): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STUDIO_STORAGE_KEY, serializeDesign(configuration));
    return true;
  } catch {
    return false;
  }
}

export type ConfigurationSnapshot = {
  configuration: StudioConfiguration;
  restored: boolean;
};

const serverSnapshot: ConfigurationSnapshot = {
  configuration: defaultConfiguration,
  restored: false,
};

let cachedRaw: string | null | undefined;
let cachedSnapshot: ConfigurationSnapshot = serverSnapshot;

export function readConfigurationSnapshot(): ConfigurationSnapshot {
  const raw = readStoredRaw(browserDesignStorage());
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  const parsed = parseStoredDesign(raw);
  cachedSnapshot = parsed.ok ? { configuration: parsed.configuration, restored: true } : serverSnapshot;
  return cachedSnapshot;
}

export function rememberStoredDesign(configuration: StudioConfiguration) {
  cachedRaw = serializeDesign(configuration);
  cachedSnapshot = { configuration, restored: true };
}

export function browserDesignStorage(): DesignStorage | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}
