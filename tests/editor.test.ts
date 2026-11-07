import { describe, expect, it } from "vitest";
import {
  clearCameraBookmark,
  isRestorablePose,
  parseCameraBookmark,
  writeCameraBookmark,
  type BookmarkStorage,
} from "@/lib/camera-bookmark";
import { commitHistory, createHistory, HISTORY_LIMIT, redoHistory, sameDesign, undoHistory, type StudioDesign } from "@/lib/history";
import { cameraPresets, commandForPose, studioCamera } from "@/lib/studio";
import { defaultConfiguration, serializeDesign, type DesignStorage, type StudioConfiguration } from "@/lib/studio-config";
import { defaultDesign, designWithConfiguration, parseStudioDesign, serializeStudioDesign, writeStudioDesign } from "@/lib/studio-design";
import {
  canOccupy,
  defaultLayout,
  fixedObstacles,
  layoutValid,
  moveFurniture,
  nudgeFurniture,
  placeVariant,
  rectanglesOverlap,
  roomBounds,
  type FurnitureLayout,
} from "@/lib/spatial";

function memoryStorage(initial: Record<string, string> = {}): BookmarkStorage & { dump: Record<string, string> } {
  const dump = { ...initial };
  return {
    dump,
    getItem: (key) => (key in dump ? dump[key] : null),
    setItem: (key, value) => {
      dump[key] = value;
    },
    removeItem: (key) => {
      delete dump[key];
    },
  };
}

function design(layout: FurnitureLayout = defaultLayout, configuration: StudioConfiguration = defaultConfiguration): StudioDesign {
  return { configuration, layout };
}

describe("furniture collision", () => {
  it("keeps the original arrangement inside the room and clear of the lamp", () => {
    expect(layoutValid(defaultLayout)).toBe(true);
    expect(fixedObstacles).toHaveLength(1);
    expect(canOccupy(defaultLayout, "plant", fixedObstacles[0].x, fixedObstacles[0].z)).toBe(false);
  });

  it("stops a move at the room boundary", () => {
    const next = moveFurniture(defaultLayout, "plant", 9, 0.62);
    expect(next.x).toBeLessThanOrEqual(roomBounds.maxX);
    expect(next.x).toBeGreaterThan(defaultLayout.plant.position.x);
    expect(canOccupy(defaultLayout, "plant", next.x, next.z)).toBe(true);
  });

  it("stops the sofa before it overlaps the table", () => {
    const next = moveFurniture(defaultLayout, "sofa", defaultLayout.sofa.position.x, -0.2);
    const moved = {
      ...defaultLayout,
      sofa: { ...defaultLayout.sofa, position: next },
    };
    expect(layoutValid(moved)).toBe(true);
    expect(next.z).toBeLessThan(-0.9);
    expect(rectanglesOverlap(
      { x: next.x, z: next.z, width: 2.1, depth: 0.86 },
      { x: defaultLayout["coffee-table"].position.x, z: defaultLayout["coffee-table"].position.z, width: 1.22, depth: 0.72 },
    )).toBe(false);
  });

  it("rejects a non-finite destination and an invalid variant", () => {
    expect(moveFurniture(defaultLayout, "plant", Number.NaN, 0)).toEqual(defaultLayout.plant.position);
    expect(placeVariant(defaultLayout, "sofa", "tall" as "modern")).toBeNull();
    expect(layoutValid({
      ...defaultLayout,
      sofa: { variant: "modern", position: { x: Number.POSITIVE_INFINITY, z: 0 } },
    })).toBe(false);
  });

  it("moves a variant to a nearby valid place or refuses when the search is closed", () => {
    const tight = {
      ...defaultLayout,
      sofa: { variant: "modern" as const, position: { x: -0.08, z: -1.6 } },
    };
    expect(layoutValid(tight)).toBe(true);
    const shifted = placeVariant(tight, "sofa", "rounded");
    expect(shifted).not.toBeNull();
    expect(shifted && layoutValid(shifted)).toBe(true);
    expect(shifted?.sofa.variant).toBe("rounded");
    expect(placeVariant(tight, "sofa", "rounded", { maxRadius: 0 })).toBeNull();
  });

  it("nudges by one step and reports a blocked step as the same layout", () => {
    const nudged = nudgeFurniture(defaultLayout, "plant", "opening");
    expect(nudged).not.toBe(defaultLayout);
    expect(nudged.plant.position.z).toBeGreaterThan(defaultLayout.plant.position.z);
    expect(layoutValid(nudged)).toBe(true);
    const pinned = {
      ...defaultLayout,
      plant: { variant: "tall" as const, position: { x: roomBounds.maxX - 0.28, z: roomBounds.maxZ - 0.28 } },
    };
    expect(nudgeFurniture(pinned, "plant", "opening")).toBe(pinned);
  });
});

describe("design history", () => {
  it("records one entry for a finished drag and drops redo after a new edit", () => {
    let visual = defaultLayout.sofa.position;
    for (const target of [0.2, 0.5, 0.8, 1.1]) {
      visual = moveFurniture(defaultLayout, "plant", target, defaultLayout.plant.position.z);
    }
    const dragged = design({
      ...defaultLayout,
      plant: { ...defaultLayout.plant, position: visual },
    });
    const history = commitHistory(createHistory(defaultDesign), dragged);
    expect(history.past).toHaveLength(1);
    expect(history.future).toHaveLength(0);
    const undone = undoHistory(history);
    expect(sameDesign(undone.present, defaultDesign)).toBe(true);
    const redone = redoHistory(undone);
    expect(sameDesign(redone.present, dragged)).toBe(true);
    const replaced = commitHistory(undone, design(defaultLayout, { ...defaultConfiguration, sofaColor: "sage" }));
    expect(replaced.future).toHaveLength(0);
    expect(replaced.present.configuration.sofaColor).toBe("sage");
    expect(replaced.present.layout).toEqual(defaultLayout);
  });

  it("keeps only the last 10 edits and ignores an unchanged commit", () => {
    let history = createHistory(defaultDesign);
    for (let index = 0; index < 12; index += 1) {
      history = commitHistory(history, design(defaultLayout, { ...defaultConfiguration, sofaColor: index % 2 === 0 ? "ivory" : "sage" }));
    }
    expect(history.past).toHaveLength(HISTORY_LIMIT);
    expect(commitHistory(history, history.present)).toBe(history);
    let steps = 0;
    let cursor = history;
    while (cursor.past.length > 0) {
      cursor = undoHistory(cursor);
      steps += 1;
    }
    expect(steps).toBe(HISTORY_LIMIT);
    expect(undoHistory(cursor)).toBe(cursor);
  });

  it("resets finishes and furniture together without coupling them on a material edit", () => {
    const moved = design({
      ...defaultLayout,
      plant: { ...defaultLayout.plant, position: { x: 1.2, z: 0.4 } },
    });
    const recolored = designWithConfiguration(moved, { ...defaultConfiguration, wallFinish: "sage" });
    expect(recolored.layout).toBe(moved.layout);
    expect(recolored.configuration.wallFinish).toBe("sage");
    const reset = defaultDesign;
    expect(reset.configuration).toEqual(defaultConfiguration);
    expect(reset.layout).toEqual(defaultLayout);
    expect(reset.configuration).not.toHaveProperty("position");
  });
});

describe("studio design storage", () => {
  it("writes version 2 with the furniture layout", () => {
    const storage = memoryStorage();
    expect(writeStudioDesign(storage, defaultDesign)).toBe(true);
    expect(storage.dump["space-studio-config-v2"]).toContain('"version":2');
    expect(parseStudioDesign(storage.dump["space-studio-config-v2"])).toEqual({
      ok: true,
      migrated: false,
      design: defaultDesign,
    });
  });

  it("migrates a valid version 1 finish set onto the original furniture", () => {
    const legacy = serializeDesign({ ...defaultConfiguration, sofaFabric: "velvet", lightingMode: "evening" });
    const parsed = parseStudioDesign(legacy);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.migrated).toBe(true);
    expect(parsed.design.configuration.sofaFabric).toBe("velvet");
    expect(parsed.design.layout).toEqual(defaultLayout);
  });

  it("rejects malformed, overlapping, and non-finite layouts", () => {
    expect(parseStudioDesign(null)).toEqual({ ok: false, reason: "empty" });
    expect(parseStudioDesign("{")).toEqual({ ok: false, reason: "invalid" });
    expect(parseStudioDesign(JSON.stringify({ version: 0, configuration: defaultConfiguration, layout: defaultLayout }))).toEqual({
      ok: false,
      reason: "version",
    });
    expect(parseStudioDesign(JSON.stringify({ version: 2, configuration: defaultConfiguration, layout: { sofa: defaultLayout.sofa } }))).toEqual({
      ok: false,
      reason: "invalid",
    });
    const overlapping = {
      ...defaultLayout,
      plant: { variant: "tall", position: defaultLayout.sofa.position },
    };
    expect(
      parseStudioDesign(JSON.stringify({ version: 2, configuration: defaultConfiguration, layout: overlapping })),
    ).toEqual({ ok: false, reason: "invalid" });
    const infinite: FurnitureLayout = {
      ...defaultLayout,
      plant: { variant: "tall", position: { x: Number.POSITIVE_INFINITY, z: 0 } },
    };
    expect(serializeStudioDesign({ configuration: defaultConfiguration, layout: infinite })).toContain("null");
    expect(parseStudioDesign(JSON.stringify({ version: 2, configuration: defaultConfiguration, layout: infinite }))).toEqual({
      ok: false,
      reason: "invalid",
    });
    expect(writeStudioDesign(null, defaultDesign)).toBe(false);
  });
});

describe("camera bookmark", () => {
  it("stores one pose inside the orbit limits and restores it from storage", () => {
    const storage: DesignStorage & BookmarkStorage = memoryStorage();
    const pose = { position: cameraPresets[1].position, target: cameraPresets[1].target };
    expect(isRestorablePose(pose)).toBe(true);
    expect(writeCameraBookmark(storage, pose)).toBe(true);
    expect(parseCameraBookmark(storage.getItem("space-studio-camera-v1"))).toEqual({ ok: true, pose });
    expect(commandForPose(pose, 3, true)).toMatchObject({ nonce: 3, immediate: true, pose });
    expect(commandForPose(pose, 3, false).immediate).toBe(false);
    expect(clearCameraBookmark(storage)).toBe(true);
    expect(parseCameraBookmark(storage.getItem("space-studio-camera-v1"))).toEqual({ ok: false, reason: "empty" });
  });

  it("rejects a non-finite pose and a view outside the orbit limits", () => {
    const underFloor = {
      position: [0, -1, 4] as [number, number, number],
      target: studioCamera.target,
    };
    expect(isRestorablePose(underFloor)).toBe(false);
    expect(writeCameraBookmark(memoryStorage(), underFloor)).toBe(false);
    expect(parseCameraBookmark(JSON.stringify({ version: 1, position: [1, Number.NaN, 1], target: studioCamera.target }))).toEqual({
      ok: false,
      reason: "invalid",
    });
    expect(parseCameraBookmark(JSON.stringify({ version: 2, position: studioCamera.position, target: studioCamera.target }))).toEqual({
      ok: false,
      reason: "invalid",
    });
  });
});
