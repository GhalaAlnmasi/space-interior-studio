type CanvasHost = {
  createElement: (tag: "canvas") => {
    getContext: (kind: string) => unknown;
  };
};

export function detectWebGL(host?: CanvasHost): boolean {
  try {
    if (host) {
      const canvas = host.createElement("canvas");
      return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    }

    if (typeof document === "undefined") return false;
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
