import { describe, expect, it } from "vitest";
import { detectWebGL } from "@/lib/webgl";

describe("detectWebGL", () => {
  it("returns false when the canvas context throws", () => {
    const host = {
      createElement: () => ({
        getContext: () => {
          throw new Error("blocked");
        },
      }),
    };

    expect(detectWebGL(host)).toBe(false);
  });

  it("returns false when no context is available", () => {
    const host = {
      createElement: () => ({
        getContext: () => null,
      }),
    };

    expect(detectWebGL(host)).toBe(false);
  });

  it("returns true when a context object is created", () => {
    const host = {
      createElement: () => ({
        getContext: (kind: string) => (kind === "webgl2" ? { kind } : null),
      }),
    };

    expect(detectWebGL(host)).toBe(true);
  });
});
