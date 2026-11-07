"use client";

import { useEffect, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import {
  getFloorFinish,
  getSofaColor,
  getSofaFabric,
  getWallFinish,
  type StudioConfiguration,
} from "@/lib/studio-config";

type RoomTextures = {
  oakColor: THREE.CanvasTexture | null;
  walnutColor: THREE.CanvasTexture | null;
  ashColor: THREE.CanvasTexture | null;
  oakRough: THREE.CanvasTexture | null;
  plasterMap: THREE.CanvasTexture | null;
  linenMap: THREE.CanvasTexture | null;
  boucleMap: THREE.CanvasTexture | null;
  velvetMap: THREE.CanvasTexture | null;
  stoneMap: THREE.CanvasTexture | null;
  rugMap: THREE.CanvasTexture | null;
};

export type RoomMaterials = RoomTextures & {
  plaster: THREE.MeshStandardMaterial;
  plasterShade: THREE.MeshStandardMaterial;
  oak: THREE.MeshStandardMaterial;
  trim: THREE.MeshStandardMaterial;
  fabric: THREE.MeshStandardMaterial;
  fabricDeep: THREE.MeshStandardMaterial;
  stone: THREE.MeshPhysicalMaterial;
  metal: THREE.MeshStandardMaterial;
  ceramic: THREE.MeshStandardMaterial;
  clay: THREE.MeshStandardMaterial;
  foliage: THREE.MeshStandardMaterial;
  foliageDeep: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  rug: THREE.MeshStandardMaterial;
  baseboard: THREE.MeshStandardMaterial;
};

function drawCanvas(size: number, paint: (context: CanvasRenderingContext2D, size: number) => void) {
  const element = document.createElement("canvas");
  element.width = size;
  element.height = size;
  const context = element.getContext("2d");
  if (!context) return null;
  paint(context, size);
  return element;
}

function makeTexture(
  source: HTMLCanvasElement | null,
  repeat: [number, number],
  colorMap: boolean,
): THREE.CanvasTexture | null {
  if (!source) return null;
  const texture = new THREE.CanvasTexture(source);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.colorSpace = colorMap ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.anisotropy = colorMap ? 8 : 1;
  return texture;
}

function paintTimber(context: CanvasRenderingContext2D, size: number, base: string, grain: string, knotColor: string) {
  context.fillStyle = base;
  context.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 1) {
    const band = y % 173;
    const alpha = band < 3 ? 0.28 : 0.03 + (y % 17) * 0.004;
    context.fillStyle = grain.replace("ALPHA", String(alpha));
    context.fillRect(0, y, size, 1);
  }

  context.strokeStyle = grain.replace("ALPHA", "0.18");
  context.lineWidth = 2;
  for (let index = 0; index < 5; index += 1) {
    context.beginPath();
    context.moveTo(0, 80 + index * 190);
    context.bezierCurveTo(size * 0.3, 40 + index * 190, size * 0.6, 140 + index * 190, size, 70 + index * 190);
    context.stroke();
  }

  context.strokeStyle = grain.replace("ALPHA", "0.1");
  context.lineWidth = 1;
  for (let index = 0; index < 18; index += 1) {
    const x = (index * 67) % size;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + 14, size);
    context.stroke();
  }

  for (let index = 0; index < 36; index += 1) {
    const x = (index * 149) % size;
    const y = (index * 97) % size;
    context.fillStyle = grain.replace("ALPHA", "0.2");
    context.fillRect(x, y, 16 + (index % 4) * 4, 2);
  }

  for (const [x, y] of [
    [220, 260],
    [740, 690],
  ] as const) {
    const gradient = context.createRadialGradient(x, y, 4, x, y, 46);
    gradient.addColorStop(0, knotColor);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(x, y, 34, 18, 0.4, 0, Math.PI * 2);
    context.fill();
  }
}

function paintOak(context: CanvasRenderingContext2D, size: number) {
  paintTimber(context, size, "#C6A57C", "rgba(86, 52, 28, ALPHA)", "rgba(74, 44, 24, 0.45)");
}

function paintWalnut(context: CanvasRenderingContext2D, size: number) {
  paintTimber(context, size, "#6B4632", "rgba(28, 16, 10, ALPHA)", "rgba(20, 10, 6, 0.5)");
}

function paintAsh(context: CanvasRenderingContext2D, size: number) {
  paintTimber(context, size, "#E6D5BE", "rgba(120, 96, 70, ALPHA)", "rgba(110, 86, 62, 0.28)");
}

function paintOakRoughness(context: CanvasRenderingContext2D, size: number) {
  context.fillStyle = "#d5d5d5";
  context.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 2) {
    context.fillStyle = y % 48 === 0 ? "#9a9a9a" : "#c8c8c8";
    context.fillRect(0, y, size, 1);
  }
}

function paintPlaster(context: CanvasRenderingContext2D, size: number) {
  context.fillStyle = "#F4F0E8";
  context.fillRect(0, 0, size, size);

  for (let index = 0; index < 28; index += 1) {
    const x = (index * 97) % size;
    const y = (index * 53) % size;
    const blot = context.createRadialGradient(x, y, 4, x, y, 70 + (index % 5) * 12);
    blot.addColorStop(0, "rgba(190, 176, 156, 0.16)");
    blot.addColorStop(1, "rgba(190, 176, 156, 0)");
    context.fillStyle = blot;
    context.fillRect(x - 90, y - 90, 180, 180);
  }

  for (let index = 0; index < 80; index += 1) {
    context.fillStyle = index % 2 === 0 ? "rgba(255, 252, 246, 0.45)" : "rgba(150, 136, 118, 0.16)";
    context.fillRect((index * 61) % size, (index * 97) % size, 2, 2);
  }
}

function paintLinen(context: CanvasRenderingContext2D, size: number) {
  context.fillStyle = "#F4F0E8";
  context.fillRect(0, 0, size, size);
  context.fillStyle = "rgba(90, 74, 58, 0.16)";
  for (let line = 0; line < size; line += 4) {
    context.fillRect(0, line, size, 1);
    context.fillRect(line, 0, 1, size);
  }
}

function paintBoucle(context: CanvasRenderingContext2D, size: number) {
  context.fillStyle = "#F3EEE6";
  context.fillRect(0, 0, size, size);
  context.strokeStyle = "rgba(80, 64, 48, 0.35)";
  context.lineWidth = 2;
  for (let index = 0; index < 220; index += 1) {
    const x = (index * 47) % size;
    const y = (index * 29) % size;
    context.beginPath();
    context.arc(x, y, 3 + (index % 3), 0, Math.PI * 1.35);
    context.stroke();
  }
}

function paintVelvet(context: CanvasRenderingContext2D, size: number) {
  context.fillStyle = "#F7F4EF";
  context.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 2) {
    context.fillStyle = y % 8 === 0 ? "rgba(70, 58, 46, 0.08)" : "rgba(255, 255, 255, 0.04)";
    context.fillRect(0, y, size, 1);
  }
}

function paintStone(context: CanvasRenderingContext2D, size: number) {
  context.fillStyle = "#E7DDD2";
  context.fillRect(0, 0, size, size);

  context.strokeStyle = "rgba(156, 136, 112, 0.22)";
  context.lineWidth = 2;
  for (let index = 0; index < 7; index += 1) {
    const y = ((index + 1) * size) / 8;
    context.beginPath();
    context.moveTo(0, y);
    context.bezierCurveTo(size * 0.28, y - 10, size * 0.62, y + 12, size, y + 2);
    context.stroke();
  }

  for (let index = 0; index < 12; index += 1) {
    const x = (index * 83) % size;
    const y = (index * 57) % size;
    const pit = context.createRadialGradient(x, y, 1, x, y, 12);
    pit.addColorStop(0, "rgba(146, 124, 100, 0.14)");
    pit.addColorStop(1, "rgba(146, 124, 100, 0)");
    context.fillStyle = pit;
    context.beginPath();
    context.arc(x, y, 12, 0, Math.PI * 2);
    context.fill();
  }

  context.strokeStyle = "rgba(176, 160, 140, 0.2)";
  context.lineWidth = 1;
  for (let index = 0; index < 5; index += 1) {
    const x = ((index + 1) * size) / 6;
    context.beginPath();
    context.moveTo(x, 0);
    context.bezierCurveTo(x - 16, size * 0.35, x + 18, size * 0.62, x - 6, size);
    context.stroke();
  }
}

function paintRug(context: CanvasRenderingContext2D, size: number) {
  context.fillStyle = "#E3D5C0";
  context.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 6) {
    context.fillStyle = y % 12 === 0 ? "rgba(120, 96, 70, 0.16)" : "rgba(255, 248, 238, 0.18)";
    context.fillRect(0, y, size, 2);
  }
  context.strokeStyle = "#B7A48A";
  context.lineWidth = 28;
  context.strokeRect(16, 16, size - 32, size - 32);
  context.strokeStyle = "#EFE6D8";
  context.lineWidth = 8;
  context.strokeRect(36, 36, size - 72, size - 72);
}

function createTextures(): RoomTextures {
  return {
    oakColor: makeTexture(drawCanvas(1024, paintOak), [3.6, 1.8], true),
    walnutColor: makeTexture(drawCanvas(1024, paintWalnut), [3.6, 1.8], true),
    ashColor: makeTexture(drawCanvas(1024, paintAsh), [3.6, 1.8], true),
    oakRough: makeTexture(drawCanvas(512, paintOakRoughness), [3.6, 1.8], false),
    plasterMap: makeTexture(drawCanvas(512, paintPlaster), [1.4, 1.4], true),
    linenMap: makeTexture(drawCanvas(512, paintLinen), [2.6, 2.6], true),
    boucleMap: makeTexture(drawCanvas(512, paintBoucle), [2.2, 2.2], true),
    velvetMap: makeTexture(drawCanvas(512, paintVelvet), [1.4, 2.8], true),
    stoneMap: makeTexture(drawCanvas(512, paintStone), [1.2, 1.2], true),
    rugMap: makeTexture(drawCanvas(512, paintRug), [1, 1], true),
  };
}

export function useRoomMaterials(configuration: StudioConfiguration): RoomMaterials {
  const materials = useMemo<RoomMaterials>(() => {
    const textures = createTextures();

    const plasterMaterial = new THREE.MeshStandardMaterial({
      color: "#F3EEE6",
      map: textures.plasterMap,
      roughness: 0.96,
      metalness: 0,
    });
    const plasterShade = plasterMaterial.clone();
    plasterShade.color.set("#E4DCD0");

    return {
      ...textures,
      plaster: plasterMaterial,
      plasterShade,
      oak: new THREE.MeshStandardMaterial({
        color: textures.oakColor ? "#ffffff" : "#C6A57C",
        map: textures.oakColor,
        roughnessMap: textures.oakRough,
        roughness: 0.86,
        metalness: 0,
      }),
      trim: new THREE.MeshStandardMaterial({
        color: "#8A6244",
        roughness: 0.62,
        metalness: 0,
      }),
      fabric: new THREE.MeshStandardMaterial({
        color: "#D8CCBA",
        map: textures.linenMap,
        roughness: 0.94,
        metalness: 0,
      }),
      fabricDeep: new THREE.MeshStandardMaterial({
        color: "#CBBBA6",
        map: textures.linenMap,
        roughness: 0.96,
        metalness: 0,
      }),
      stone: new THREE.MeshPhysicalMaterial({
        color: "#F4EFE8",
        map: textures.stoneMap,
        roughness: 0.52,
        metalness: 0,
        clearcoat: 0.18,
        clearcoatRoughness: 0.48,
      }),
      metal: new THREE.MeshStandardMaterial({
        color: "#C4A077",
        roughness: 0.48,
        metalness: 0.55,
      }),
      ceramic: new THREE.MeshStandardMaterial({
        color: "#F4EFE6",
        roughness: 0.34,
        metalness: 0.02,
      }),
      clay: new THREE.MeshStandardMaterial({
        color: "#CDB69A",
        roughness: 0.84,
        metalness: 0,
      }),
      foliage: new THREE.MeshStandardMaterial({
        color: "#667258",
        roughness: 0.9,
        metalness: 0,
      }),
      foliageDeep: new THREE.MeshStandardMaterial({
        color: "#4E5944",
        roughness: 0.92,
        metalness: 0,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#F7F3EA",
        roughness: 0.08,
        metalness: 0,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
      rug: new THREE.MeshStandardMaterial({
        color: textures.rugMap ? "#ffffff" : "#E3D5C0",
        map: textures.rugMap,
        roughness: 1,
        metalness: 0,
      }),
      baseboard: new THREE.MeshStandardMaterial({
        color: "#8A6244",
        roughness: 0.62,
        metalness: 0,
      }),
    };
  }, []);

  useLayoutEffect(() => {
    applyFinish(materials, configuration);
  }, [configuration, materials]);

  useEffect(() => {
    const textures = [
      materials.oakColor,
      materials.walnutColor,
      materials.ashColor,
      materials.oakRough,
      materials.plasterMap,
      materials.linenMap,
      materials.boucleMap,
      materials.velvetMap,
      materials.stoneMap,
      materials.rugMap,
    ];
    const surfaces = [
      materials.plaster,
      materials.plasterShade,
      materials.oak,
      materials.trim,
      materials.fabric,
      materials.fabricDeep,
      materials.stone,
      materials.metal,
      materials.ceramic,
      materials.clay,
      materials.foliage,
      materials.foliageDeep,
      materials.glass,
      materials.rug,
      materials.baseboard,
    ];

    return () => {
      for (const texture of textures) texture?.dispose();
      for (const surface of surfaces) surface.dispose();
    };
  }, [materials]);

  return materials;
}

const floorMaps = {
  "natural-oak": "oakColor",
  "dark-walnut": "walnutColor",
  "light-ash": "ashColor",
} as const;

const fabricMaps = {
  linen: "linenMap",
  boucle: "boucleMap",
  velvet: "velvetMap",
} as const;

export function applyFinish(materials: RoomMaterials, configuration: StudioConfiguration) {
  const fabric = getSofaFabric(configuration.sofaFabric);
  const fabricMap = materials[fabricMaps[configuration.sofaFabric]];
  materials.fabric.map = fabricMap;
  materials.fabric.color.set(getSofaColor(configuration.sofaColor).swatch);
  materials.fabric.roughness = fabric.roughness;
  materials.fabric.metalness = fabric.metalness;
  materials.fabric.needsUpdate = true;

  materials.fabricDeep.map = fabricMap;
  materials.fabricDeep.color.copy(materials.fabric.color).multiplyScalar(0.84);
  materials.fabricDeep.roughness = Math.min(1, fabric.roughness + 0.04);
  materials.fabricDeep.metalness = fabric.metalness;
  materials.fabricDeep.needsUpdate = true;

  const floor = getFloorFinish(configuration.floorFinish);
  materials.oak.map = materials[floorMaps[configuration.floorFinish]];
  materials.oak.roughness = floor.roughness;
  materials.oak.color.set("#ffffff");
  materials.oak.needsUpdate = true;
  materials.baseboard.color.set(floor.trim);

  const wall = getWallFinish(configuration.wallFinish);
  materials.plaster.color.set(wall.swatch);
  materials.plasterShade.color.set(wall.shade);
}
