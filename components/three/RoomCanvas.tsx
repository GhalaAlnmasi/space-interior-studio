"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { RoomScene } from "@/components/three/RoomScene";
import {
  CAMERA_TRANSITION_MS,
  frameCamera,
  getCameraPreset,
  shouldAnimateCommand,
  smoothstep,
  studioCamera,
  type CameraCommand,
  type CameraPose,
  type Vec3,
} from "@/lib/studio";
import type { StudioConfiguration } from "@/lib/studio-config";
import type { FurnitureId, FurnitureLayout } from "@/lib/spatial";

type RoomCanvasProps = {
  command: CameraCommand;
  configuration: StudioConfiguration;
  layout: FurnitureLayout;
  selected: FurnitureId | null;
  compact: boolean;
  reduceMotion: boolean;
  applyFrame: boolean;
  onUserOrbit: () => void;
  onSelect: (id: FurnitureId | null) => void;
  onCommit: (id: FurnitureId, position: { x: number; z: number }) => void;
  onDragActive?: (active: boolean) => void;
};

export type RoomCanvasHandle = {
  getPose: () => CameraPose;
};

type CameraAnim = {
  fromPosition: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toPosition: THREE.Vector3;
  toTarget: THREE.Vector3;
  presetId: CameraCommand["presetId"];
  started: number;
  duration: number;
};

function CameraDriver({
  controlsRef,
  animRef,
  command,
  compact,
  reduceMotion,
  applyFrame,
}: {
  controlsRef: RefObject<OrbitControlsImpl | null>;
  animRef: RefObject<CameraAnim | null>;
  command: CameraCommand;
  compact: boolean;
  reduceMotion: boolean;
  applyFrame: boolean;
}) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    if (!applyFrame) {
      animRef.current = null;
      return;
    }

    const framed = command.pose ?? frameCamera(getCameraPreset(command.presetId), compact);
    let frame = 0;
    let stopped = false;

    const begin = () => {
      if (stopped) return;
      const controls = controlsRef.current;
      if (!controls) {
        frame = window.requestAnimationFrame(begin);
        return;
      }

      const toPosition = new THREE.Vector3(...framed.position);
      const toTarget = new THREE.Vector3(...framed.target);
      const duration = shouldAnimateCommand(command, reduceMotion) ? CAMERA_TRANSITION_MS : 0;

      if (duration === 0) {
        camera.position.copy(toPosition);
        controls.target.copy(toTarget);
        controls.update();
        animRef.current = null;
        if (command.presetId === "overview" && !command.pose) controls.saveState();
        return;
      }

      animRef.current = {
        fromPosition: camera.position.clone(),
        fromTarget: controls.target.clone(),
        toPosition,
        toTarget,
        presetId: command.presetId,
        started: performance.now(),
        duration,
      };
    };

    frame = window.requestAnimationFrame(begin);
    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
      animRef.current = null;
    };
  }, [animRef, applyFrame, camera, command, compact, controlsRef, reduceMotion]);

  useFrame(() => {
    const job = animRef.current;
    const controls = controlsRef.current;
    if (!job || !controls) return;

    const amount = smoothstep((performance.now() - job.started) / job.duration);
    camera.position.lerpVectors(job.fromPosition, job.toPosition, amount);
    controls.target.lerpVectors(job.fromTarget, job.toTarget, amount);
    controls.update();

    if (amount >= 1) {
      if (job.presetId === "overview" && !command.pose) controls.saveState();
      animRef.current = null;
    }
  });

  return null;
}

function PoseReader({
  poseRef,
  controlsRef,
}: {
  poseRef: RefObject<CameraPose>;
  controlsRef: RefObject<OrbitControlsImpl | null>;
}) {
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    const target = controlsRef.current?.target;
    if (!target) return;
    poseRef.current = {
      position: [camera.position.x, camera.position.y, camera.position.z],
      target: [target.x, target.y, target.z],
    };
  });

  return null;
}

const RoomCanvas = forwardRef<RoomCanvasHandle, RoomCanvasProps>(function RoomCanvas(
  { command, configuration, layout, selected, compact, reduceMotion, applyFrame, onUserOrbit, onSelect, onCommit, onDragActive },
  ref,
) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const animRef = useRef<CameraAnim | null>(null);
  const poseRef = useRef<CameraPose>({
    position: [...studioCamera.position] as Vec3,
    target: [...studioCamera.target] as Vec3,
  });
  const draggingRef = useRef(false);

  useImperativeHandle(ref, () => ({
    getPose: () => ({
      position: [...poseRef.current.position] as Vec3,
      target: [...poseRef.current.target] as Vec3,
    }),
  }));

  return (
    <Canvas
      className="h-full max-w-full touch-none"
      shadows="percentage"
      dpr={compact ? [1, 1.25] : [1, 1.5]}
      camera={{
        position: studioCamera.position,
        fov: studioCamera.fov,
        near: 0.1,
        far: 40,
      }}
      gl={{ antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.92;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
      onPointerMissed={() => {
        if (!draggingRef.current) onSelect(null);
      }}
    >
      <RoomScene
        configuration={configuration}
        layout={layout}
        selected={selected}
        dragEnabled={!compact}
        reduceMotion={reduceMotion}
        onSelect={onSelect}
        onDragActive={(active) => {
          draggingRef.current = active;
          if (controlsRef.current) controlsRef.current.enabled = !active;
          if (active) animRef.current = null;
          onDragActive?.(active);
        }}
        onCommit={onCommit}
      />
      <PoseReader poseRef={poseRef} controlsRef={controlsRef} />
      <CameraDriver
        controlsRef={controlsRef}
        animRef={animRef}
        command={command}
        compact={compact}
        reduceMotion={reduceMotion}
        applyFrame={applyFrame}
      />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableDamping={!reduceMotion}
        dampingFactor={0.08}
        rotateSpeed={0.7}
        zoomSpeed={0.6}
        minDistance={studioCamera.minDistance}
        maxDistance={studioCamera.maxDistance}
        minPolarAngle={studioCamera.minPolarAngle}
        maxPolarAngle={studioCamera.maxPolarAngle}
        minAzimuthAngle={studioCamera.minAzimuthAngle}
        maxAzimuthAngle={studioCamera.maxAzimuthAngle}
        target={studioCamera.target}
        onStart={() => {
          if (draggingRef.current) return;
          animRef.current = null;
          onUserOrbit();
        }}
      />
    </Canvas>
  );
});

export default RoomCanvas;
