import { isPoseInsideLimits, studioCamera, type CameraPose, type Vec3 } from "@/lib/studio";
import { browserDesignStorage, type DesignStorage } from "@/lib/studio-config";

export const CAMERA_BOOKMARK_KEY = "space-studio-camera-v1";
export const CAMERA_BOOKMARK_VERSION = 1;

export type BookmarkStorage = DesignStorage & {
  removeItem: (key: string) => void;
};

function isVec3(value: unknown): value is Vec3 {
  if (!Array.isArray(value) || value.length !== 3) return false;
  return value.every((item) => typeof item === "number" && Number.isFinite(item));
}

export function isRestorablePose(pose: CameraPose): boolean {
  return isVec3(pose.position) && isVec3(pose.target) && isPoseInsideLimits(pose.position, pose.target, studioCamera);
}

export function serializeCameraBookmark(pose: CameraPose): string {
  return JSON.stringify({
    version: CAMERA_BOOKMARK_VERSION,
    position: pose.position,
    target: pose.target,
  });
}

export function parseCameraBookmark(raw: string | null): { ok: true; pose: CameraPose } | { ok: false; reason: "empty" | "invalid" } {
  if (raw == null || raw.trim() === "") return { ok: false, reason: "empty" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "invalid" };
  }

  if (!parsed || typeof parsed !== "object") return { ok: false, reason: "invalid" };
  const record = parsed as { version?: unknown; position?: unknown; target?: unknown };
  if (record.version !== CAMERA_BOOKMARK_VERSION) return { ok: false, reason: "invalid" };
  if (!isVec3(record.position) || !isVec3(record.target)) return { ok: false, reason: "invalid" };
  const pose = { position: record.position, target: record.target };
  if (!isRestorablePose(pose)) return { ok: false, reason: "invalid" };
  return { ok: true, pose };
}

export function readBookmarkRaw(storage: DesignStorage | null): string | null {
  if (!storage) return null;
  try {
    return storage.getItem(CAMERA_BOOKMARK_KEY);
  } catch {
    return null;
  }
}

export function writeCameraBookmark(storage: DesignStorage | null, pose: CameraPose): boolean {
  if (!storage || !isRestorablePose(pose)) return false;
  try {
    storage.setItem(CAMERA_BOOKMARK_KEY, serializeCameraBookmark(pose));
    return true;
  } catch {
    return false;
  }
}

export function clearCameraBookmark(storage: BookmarkStorage | null): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(CAMERA_BOOKMARK_KEY);
    return true;
  } catch {
    return false;
  }
}

let cachedRaw: string | null | undefined;
let cachedPose: CameraPose | null = null;

export function readCameraBookmarkSnapshot(): CameraPose | null {
  const raw = readBookmarkRaw(browserDesignStorage());
  if (raw === cachedRaw) return cachedPose;
  cachedRaw = raw;
  const parsed = parseCameraBookmark(raw);
  cachedPose = parsed.ok ? parsed.pose : null;
  return cachedPose;
}

export function rememberCameraBookmark(pose: CameraPose | null) {
  cachedRaw = pose ? serializeCameraBookmark(pose) : null;
  cachedPose = pose;
}

export function browserBookmarkStorage(): BookmarkStorage | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}
