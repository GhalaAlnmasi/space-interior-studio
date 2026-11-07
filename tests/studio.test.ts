import { describe, expect, it } from "vitest";
import {
  cameraPresets,
  commandForPreset,
  commandForReset,
  frameCamera,
  isPoseInsideLimits,
  isValidStudioCamera,
  mixVec3,
  shouldAnimateCommand,
  smoothstep,
  studioCamera,
  studioModelNotes,
} from "@/lib/studio";

describe("studio camera", () => {
  it("starts inside the orbit limits and stays above the floor", () => {
    expect(isValidStudioCamera(studioCamera)).toBe(true);
  });

  it("rejects a camera that can pass under the floor", () => {
    expect(
      isValidStudioCamera({
        ...studioCamera,
        maxPolarAngle: Math.PI,
      }),
    ).toBe(false);
  });

  it("describes the solids that are actually in the model", () => {
    expect(studioModelNotes.join(" ")).toMatch(/sofa/i);
    expect(studioModelNotes.join(" ")).toMatch(/table/i);
    expect(studioModelNotes.join(" ")).toMatch(/rug/i);
  });

  it("keeps every camera preset inside the orbit limits", () => {
    expect(cameraPresets.map((preset) => preset.id)).toEqual(["overview", "lounge", "architectural"]);

    for (const preset of cameraPresets) {
      expect(isPoseInsideLimits(preset.position, preset.target, studioCamera)).toBe(true);
      const compact = frameCamera(preset, true);
      expect(isPoseInsideLimits(compact.position, compact.target, studioCamera)).toBe(true);
    }
  });

  it("pulls the camera back on a short viewport without moving the target", () => {
    const preset = cameraPresets[1];
    const compact = frameCamera(preset, true);
    const desktop = frameCamera(preset, false);
    expect(compact.target).toEqual(preset.target);
    expect(desktop.position).toEqual(preset.position);
    expect(Math.hypot(...compact.position.map((value, index) => value - preset.target[index]))).toBeGreaterThan(
      Math.hypot(...preset.position.map((value, index) => value - preset.target[index])),
    );
  });

  it("resets to the overview immediately and skips preset motion when requested", () => {
    expect(commandForReset(4)).toEqual({ presetId: "overview", nonce: 4, immediate: true });
    expect(shouldAnimateCommand(commandForReset(4), false)).toBe(false);
    expect(shouldAnimateCommand(commandForPreset("lounge", 2, false), false)).toBe(true);
    expect(shouldAnimateCommand(commandForPreset("lounge", 2, true), false)).toBe(false);
    expect(shouldAnimateCommand(commandForPreset("lounge", 2, false), true)).toBe(false);
    expect(shouldAnimateCommand(commandForPreset("overview", 0, false), false)).toBe(false);
  });

  it("eases a camera move from the start pose to the end pose", () => {
    const from = cameraPresets[0].position;
    const to = cameraPresets[1].position;
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(1)).toBe(1);
    expect(smoothstep(0.5)).toBeCloseTo(0.5);
    expect(mixVec3(from, to, 0)).toEqual([...from]);
    expect(mixVec3(from, to, 1)).toEqual([...to]);
  });
});
