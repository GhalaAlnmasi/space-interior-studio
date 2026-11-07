"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Color, type AmbientLight, type DirectionalLight, type HemisphereLight, type MeshStandardMaterial, type PointLight } from "three";
import { smoothstep } from "@/lib/studio";
import { getLightingRecipe, lightingTransitionMs, type LightingMode, type LightingRecipe } from "@/lib/studio-config";

type AtmosphereProps = {
  mode: LightingMode;
  reduceMotion: boolean;
};

type LightJob = {
  from: LightingRecipe;
  to: LightingRecipe;
  start: number;
  duration: number;
};

const scratch = new Color();

function mixNumber(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function mixColor(color: Color, from: string, to: string, amount: number) {
  color.set(from);
  scratch.set(to);
  color.lerp(scratch, amount);
}

function applyRecipe(
  lights: {
    ambient: AmbientLight | null;
    hemisphere: HemisphereLight | null;
    sun: DirectionalLight | null;
    fill: DirectionalLight | null;
    lamp: PointLight | null;
    shade: MeshStandardMaterial | null;
  },
  recipe: LightingRecipe,
  amount = 1,
  from: LightingRecipe = recipe,
) {
  const blend = amount >= 1 ? 1 : amount;
  if (lights.ambient) {
    lights.ambient.intensity = mixNumber(from.ambientIntensity, recipe.ambientIntensity, blend);
    mixColor(lights.ambient.color, from.ambientColor, recipe.ambientColor, blend);
  }
  if (lights.hemisphere) {
    lights.hemisphere.intensity = mixNumber(from.hemisphereIntensity, recipe.hemisphereIntensity, blend);
    mixColor(lights.hemisphere.color, from.hemisphereSky, recipe.hemisphereSky, blend);
    mixColor(lights.hemisphere.groundColor, from.hemisphereGround, recipe.hemisphereGround, blend);
  }
  if (lights.sun) {
    lights.sun.intensity = mixNumber(from.sunIntensity, recipe.sunIntensity, blend);
    mixColor(lights.sun.color, from.sunColor, recipe.sunColor, blend);
    lights.sun.position.set(
      mixNumber(from.sunPosition[0], recipe.sunPosition[0], blend),
      mixNumber(from.sunPosition[1], recipe.sunPosition[1], blend),
      mixNumber(from.sunPosition[2], recipe.sunPosition[2], blend),
    );
  }
  if (lights.fill) {
    lights.fill.intensity = mixNumber(from.fillIntensity, recipe.fillIntensity, blend);
    mixColor(lights.fill.color, from.fillColor, recipe.fillColor, blend);
  }
  if (lights.lamp) lights.lamp.intensity = mixNumber(from.lampIntensity, recipe.lampIntensity, blend);
  if (lights.shade) lights.shade.emissiveIntensity = (lights.lamp?.intensity ?? 0) / 2.8;
}

export function Atmosphere({ mode, reduceMotion }: AtmosphereProps) {
  const ambient = useRef<AmbientLight>(null);
  const hemisphere = useRef<HemisphereLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const fill = useRef<DirectionalLight>(null);
  const lamp = useRef<PointLight>(null);
  const shade = useRef<MeshStandardMaterial>(null);
  const job = useRef<LightJob | null>(null);
  const initial = getLightingRecipe("daylight");
  const applied = useRef<LightingRecipe>(initial);

  useEffect(() => {
    const target = getLightingRecipe(mode);
    let frame = 0;
    let stopped = false;

    const begin = () => {
      if (stopped) return;
      if (!sun.current || !lamp.current || !shade.current) {
        frame = window.requestAnimationFrame(begin);
        return;
      }
      const lights = {
        ambient: ambient.current,
        hemisphere: hemisphere.current,
        sun: sun.current,
        fill: fill.current,
        lamp: lamp.current,
        shade: shade.current,
      };
      const duration = lightingTransitionMs(reduceMotion);
      if (duration === 0) {
        applyRecipe(lights, target);
        applied.current = target;
        job.current = null;
        return;
      }
      job.current = {
        from: applied.current,
        to: target,
        start: performance.now(),
        duration,
      };
    };

    frame = window.requestAnimationFrame(begin);
    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
      job.current = null;
    };
  }, [mode, reduceMotion]);

  useFrame(() => {
    const current = job.current;
    if (!current || !sun.current || !lamp.current || !shade.current) return;
    const amount = smoothstep((performance.now() - current.start) / current.duration);
    applyRecipe(
      {
        ambient: ambient.current,
        hemisphere: hemisphere.current,
        sun: sun.current,
        fill: fill.current,
        lamp: lamp.current,
        shade: shade.current,
      },
      current.to,
      amount,
      current.from,
    );
    if (amount >= 1) {
      applied.current = current.to;
      job.current = null;
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={initial.ambientIntensity} color={initial.ambientColor} />
      <hemisphereLight ref={hemisphere} args={[initial.hemisphereSky, initial.hemisphereGround, initial.hemisphereIntensity]} />
      <directionalLight
        ref={sun}
        position={initial.sunPosition}
        intensity={initial.sunIntensity}
        color={initial.sunColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.4}
        shadow-camera-far={12}
        shadow-camera-left={-3.4}
        shadow-camera-right={3.4}
        shadow-camera-top={3.4}
        shadow-camera-bottom={-3.4}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-radius={3}
      />
      <directionalLight ref={fill} position={initial.fillPosition} intensity={initial.fillIntensity} color={initial.fillColor} />
      <group position={[-2.02, 0, -1.62]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.018, 1.1, 8]} />
          <meshStandardMaterial color="#8A6244" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.14, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.11, 0.14, 12]} />
          <meshStandardMaterial ref={shade} color="#F4EFE6" roughness={0.72} emissive="#FFB56A" emissiveIntensity={0} />
        </mesh>
        <pointLight ref={lamp} position={[0, 1.14, 0.08]} intensity={0} distance={3.2} decay={2} color="#FFD2A2" />
      </group>
    </>
  );
}
