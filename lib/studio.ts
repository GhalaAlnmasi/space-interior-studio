export type Vec3 = [number, number, number];

export type CameraPose = {
  position: Vec3;
  target: Vec3;
};

export type CameraPresetId = "overview" | "lounge" | "architectural";

export type CameraPreset = CameraPose & {
  id: CameraPresetId;
  label: string;
  description: string;
};

export const cameraPresets = [
  {
    id: "overview",
    label: "Overview",
    description: "The whole room, from the open corner.",
    position: [1.35, 1.25, 1.9],
    target: [-0.1, 0.42, -0.95],
  },
  {
    id: "lounge",
    label: "Lounge Detail",
    description: "Sofa, rug, and the stone table.",
    position: [0.82, 0.9, 1.02],
    target: [-0.12, 0.36, -0.98],
  },
  {
    id: "architectural",
    label: "Architectural View",
    description: "Walls, window, and the height of the room.",
    position: [1.9, 1.85, 1.2],
    target: [0.95, 1.15, -1.7],
  },
] as const satisfies readonly CameraPreset[];

export const studioCamera = {
  position: cameraPresets[0].position,
  target: cameraPresets[0].target,
  fov: 40,
  minDistance: 2.05,
  maxDistance: 6.6,
  minPolarAngle: 0.95,
  maxPolarAngle: 1.48,
  minAzimuthAngle: 0.18,
  maxAzimuthAngle: 1.28,
};

export type StudioCamera = typeof studioCamera;

export const CAMERA_TRANSITION_MS = 880;

export type CameraCommand = {
  presetId: CameraPresetId;
  nonce: number;
  immediate: boolean;
  pose?: CameraPose;
};

export const studioModelNotes = [
  "A plaster corner with a deep window, a sill, and a low oak baseboard",
  "A linen sofa of separate seat, back, and arm cushions",
  "A travertine coffee table on brushed metal legs",
  "A wool rug with a woven border",
  "A clay vessel, a small tray, three books, and a plant",
] as const;

export const studioCopy = {
  description:
    "An interactive study model. Change the cloth, floor, walls, light, and furniture, then save the design on this device.",
  label: "Interactive 3D Preview",
  roomTitle: "Plaster room",
  help: "Drag empty floor to look around the room. Scroll or pinch to move closer. Select a piece to move it. Choose a view, or use Reset View to return to the original overview. Finish and furniture changes do not move the camera.",
  preparing: "Preparing the room",
  loading: "Loading the 3D preview",
  reset: "Reset View",
  viewsLabel: "Views",
  fallbackTitle: "This preview needs WebGL.",
  fallbackBody:
    "This browser cannot start a 3D view. The study model is a plaster corner with a linen sofa, a stone table, a wool rug, and a few quiet objects.",
  fallbackAction: "View the spaces",
  phaseNote:
    "This is a shared study model, not a reconstruction of a project. Finishes, light, and the sofa, table, and plant can be changed here and saved on this device.",
} as const;

export function getCameraPreset(id: CameraPresetId): CameraPreset {
  const preset = cameraPresets.find((item) => item.id === id);
  if (!preset) return cameraPresets[0];
  return preset;
}

export function poseMetrics(position: Vec3, target: Vec3) {
  const deltaX = position[0] - target[0];
  const deltaY = position[1] - target[1];
  const deltaZ = position[2] - target[2];
  const distance = Math.hypot(deltaX, deltaY, deltaZ);
  const horizontal = Math.hypot(deltaX, deltaZ);
  const azimuth = Math.atan2(deltaX, deltaZ);
  const polar = Math.acos(Math.min(1, Math.max(-1, deltaY / distance)));

  return { distance, horizontal, azimuth, polar };
}

export function isPoseInsideLimits(
  position: Vec3,
  target: Vec3,
  camera: Pick<
    StudioCamera,
    "minDistance" | "maxDistance" | "minPolarAngle" | "maxPolarAngle" | "minAzimuthAngle" | "maxAzimuthAngle"
  >,
): boolean {
  const pose = poseMetrics(position, target);

  return (
    pose.distance > camera.minDistance &&
    pose.distance < camera.maxDistance &&
    pose.horizontal > 2 &&
    pose.polar > camera.minPolarAngle &&
    pose.polar < camera.maxPolarAngle &&
    pose.azimuth > camera.minAzimuthAngle &&
    pose.azimuth < camera.maxAzimuthAngle
  );
}

export function isValidStudioCamera(camera: StudioCamera): boolean {
  return (
    camera.fov >= 30 &&
    camera.fov <= 50 &&
    camera.minDistance > 0 &&
    camera.minDistance < camera.maxDistance &&
    camera.minPolarAngle > 0.4 &&
    camera.minPolarAngle < camera.maxPolarAngle &&
    camera.maxPolarAngle < Math.PI / 2 &&
    camera.minAzimuthAngle < camera.maxAzimuthAngle &&
    camera.minAzimuthAngle > -0.2 &&
    camera.maxAzimuthAngle < Math.PI / 2 + 0.2 &&
    isPoseInsideLimits(camera.position, camera.target, camera)
  );
}

export function frameCamera(preset: CameraPose, compact: boolean): CameraPose {
  if (!compact) {
    return { position: preset.position, target: preset.target };
  }

  const pose = poseMetrics(preset.position, preset.target);
  const nextDistance = Math.min(pose.distance * 1.12, studioCamera.maxDistance - 0.15);
  const scale = nextDistance / pose.distance;

  return {
    position: [
      preset.target[0] + (preset.position[0] - preset.target[0]) * scale,
      preset.target[1] + (preset.position[1] - preset.target[1]) * scale,
      preset.target[2] + (preset.position[2] - preset.target[2]) * scale,
    ],
    target: preset.target,
  };
}

export function smoothstep(amount: number): number {
  const clamped = Math.min(1, Math.max(0, amount));
  return clamped * clamped * (3 - 2 * clamped);
}

export function mixVec3(from: Vec3, to: Vec3, amount: number): Vec3 {
  return [
    from[0] + (to[0] - from[0]) * amount,
    from[1] + (to[1] - from[1]) * amount,
    from[2] + (to[2] - from[2]) * amount,
  ];
}

export function commandForPreset(presetId: CameraPresetId, nonce: number, reduceMotion: boolean): CameraCommand {
  return { presetId, nonce, immediate: reduceMotion };
}

export function commandForReset(nonce: number): CameraCommand {
  return { presetId: "overview", nonce, immediate: true };
}

export function commandForPose(pose: CameraPose, nonce: number, reduceMotion: boolean): CameraCommand {
  return { presetId: "overview", nonce, immediate: reduceMotion, pose };
}

export function shouldAnimateCommand(command: CameraCommand, reduceMotion: boolean): boolean {
  return command.nonce > 0 && !command.immediate && !reduceMotion;
}
