import { describe, expect, it } from "vitest";
import {
  defaultConfiguration,
  getLightingRecipe,
  isStudioConfiguration,
  lightingTransitionMs,
  parseStoredDesign,
  randomConfiguration,
  sameConfiguration,
  serializeDesign,
  sofaColors,
  sofaFabrics,
  withConfigurationOption,
  writeStoredDesign,
  type DesignStorage,
  type StudioConfiguration,
} from "@/lib/studio-config";

function memoryStorage(initial: Record<string, string> = {}): DesignStorage & { dump: Record<string, string> } {
  const dump = { ...initial };
  return {
    dump,
    getItem: (key) => (key in dump ? dump[key] : null),
    setItem: (key, value) => {
      dump[key] = value;
    },
  };
}

describe("studio configuration", () => {
  it("starts from the original linen, sand, oak, ivory, daylight room", () => {
    expect(defaultConfiguration).toEqual({
      sofaFabric: "linen",
      sofaColor: "sand",
      floorFinish: "natural-oak",
      wallFinish: "warm-ivory",
      lightingMode: "daylight",
    });
    expect(isStudioConfiguration(defaultConfiguration)).toBe(true);
  });

  it("rejects an unknown finish and keeps a valid change", () => {
    expect(withConfigurationOption(defaultConfiguration, "sofaColor", "sage")).toEqual({
      ...defaultConfiguration,
      sofaColor: "sage",
    });
    expect(withConfigurationOption(defaultConfiguration, "sofaFabric", "velvet")?.sofaFabric).toBe("velvet");
    expect(withConfigurationOption(defaultConfiguration, "sofaColor", "crimson" as StudioConfiguration["sofaColor"])).toBeNull();
    expect(isStudioConfiguration({ ...defaultConfiguration, floorFinish: "marble" })).toBe(false);
  });

  it("maps evening to a lamp and golden hour to a lower sun", () => {
    const daylight = getLightingRecipe("daylight");
    const golden = getLightingRecipe("golden-hour");
    const evening = getLightingRecipe("evening");
    expect(evening.lampIntensity).toBeGreaterThan(daylight.lampIntensity);
    expect(golden.sunPosition[1]).toBeLessThan(daylight.sunPosition[1]);
    expect(evening.sunIntensity).toBeLessThan(daylight.sunIntensity);
    expect(sofaFabrics.map((item) => item.id)).toEqual(["linen", "boucle", "velvet"]);
    expect(sofaColors).toHaveLength(5);
  });

  it("snaps light changes when reduced motion is requested", () => {
    expect(lightingTransitionMs(true)).toBe(0);
    expect(lightingTransitionMs(false)).toBeGreaterThan(0);
  });

  it("saves and restores a versioned design", () => {
    const storage = memoryStorage();
    const design = { ...defaultConfiguration, sofaColor: "charcoal" as const, lightingMode: "evening" as const };
    expect(writeStoredDesign(storage, design)).toBe(true);
    expect(parseStoredDesign(storage.getItem("space-studio-config-v1"))).toEqual({ ok: true, configuration: design });
  });

  it("ignores invalid JSON, empty storage, and an old schema version", () => {
    expect(parseStoredDesign(null)).toEqual({ ok: false, reason: "empty" });
    expect(parseStoredDesign("")).toEqual({ ok: false, reason: "empty" });
    expect(parseStoredDesign("{")).toEqual({ ok: false, reason: "invalid" });
    expect(parseStoredDesign(JSON.stringify({ version: 1, configuration: { sofaFabric: "linen" } }))).toEqual({
      ok: false,
      reason: "invalid",
    });
    expect(parseStoredDesign(JSON.stringify({ version: 0, configuration: defaultConfiguration }))).toEqual({
      ok: false,
      reason: "version",
    });
    expect(writeStoredDesign(null, defaultConfiguration)).toBe(false);
  });

  it("resets finishes without touching a separate camera command", () => {
    const changed = withConfigurationOption(defaultConfiguration, "wallFinish", "sage");
    expect(changed).not.toEqual(defaultConfiguration);
    expect(sameConfiguration(defaultConfiguration, defaultConfiguration)).toBe(true);
    expect(serializeDesign(defaultConfiguration)).toContain('"version":1');
    expect(defaultConfiguration).not.toHaveProperty("position");
  });

  it("randomizes into another curated combination", () => {
    const next = randomConfiguration(defaultConfiguration, () => 0);
    expect(isStudioConfiguration(next)).toBe(true);
    expect(sameConfiguration(next, defaultConfiguration)).toBe(false);
    const again = randomConfiguration(next, () => 0);
    expect(isStudioConfiguration(again)).toBe(true);
  });
});
