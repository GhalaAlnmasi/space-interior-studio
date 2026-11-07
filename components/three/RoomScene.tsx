"use client";

import { useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Atmosphere } from "@/components/three/Atmosphere";
import { FurnitureStage } from "@/components/three/Furniture";
import { useRoomMaterials, type RoomMaterials } from "@/components/three/roomMaterials";
import type { StudioConfiguration } from "@/lib/studio-config";
import type { FurnitureId, FurnitureLayout } from "@/lib/spatial";

const BACK_Z = -2.32;
const LEFT_X = -2.66;
const WALL_T = 0.14;
const INNER_Z = BACK_Z + WALL_T / 2;
const INNER_X = LEFT_X + WALL_T / 2;

function Floor({ materials, onClear }: { materials: RoomMaterials; onClear: () => void }) {
  const origin = useRef({ x: 0, y: 0 });
  return (
    <mesh
      position={[0, -0.045, 0.02]}
      receiveShadow
      material={materials.oak}
      onPointerDown={(event) => {
        origin.current = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY };
      }}
      onClick={(event) => clearIfTap(event, origin.current, onClear)}
    >
      <boxGeometry args={[5.42, 0.09, 4.78]} />
    </mesh>
  );
}

function clearIfTap(event: ThreeEvent<MouseEvent>, origin: { x: number; y: number }, onClear: () => void) {
  const dx = event.nativeEvent.clientX - origin.x;
  const dy = event.nativeEvent.clientY - origin.y;
  if (dx * dx + dy * dy < 36) onClear();
}

function Walls({ materials, onClear }: { materials: RoomMaterials; onClear: () => void }) {
  const origin = useRef({ x: 0, y: 0 });
  const remember = (event: ThreeEvent<PointerEvent>) => {
    origin.current = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY };
  };
  const clear = (event: ThreeEvent<MouseEvent>) => clearIfTap(event, origin.current, onClear);
  return (
    <group>
      <mesh position={[0, 1.41, BACK_Z]} receiveShadow material={materials.plaster} onPointerDown={remember} onClick={clear}>
        <boxGeometry args={[5.42, 2.82, WALL_T]} />
      </mesh>
      <mesh position={[LEFT_X, 1.41, 0.02]} receiveShadow material={materials.plasterShade} onPointerDown={remember} onClick={clear}>
        <boxGeometry args={[WALL_T, 2.82, 4.7]} />
      </mesh>
      <mesh position={[0, 0.045, INNER_Z + 0.012]} material={materials.baseboard}>
        <boxGeometry args={[5.28, 0.09, 0.025]} />
      </mesh>
      <mesh position={[INNER_X + 0.012, 0.045, 0.02]} material={materials.baseboard}>
        <boxGeometry args={[0.025, 0.09, 4.5]} />
      </mesh>
      <Window materials={materials} />
    </group>
  );
}

function Window({ materials }: { materials: RoomMaterials }) {
  return (
    <group position={[1.12, 1.58, INNER_Z]}>
      <mesh position={[0, 0, 0.004]} material={materials.plasterShade}>
        <boxGeometry args={[1.28, 1.18, 0.02]} />
      </mesh>
      <mesh position={[0, 0, 0.02]} material={materials.glass}>
        <planeGeometry args={[1.08, 0.98]} />
      </mesh>
      <mesh position={[0, 0, 0.03]} material={materials.trim}>
        <boxGeometry args={[0.035, 1.16, 0.03]} />
      </mesh>
      <mesh position={[0, 0.18, 0.03]} material={materials.trim}>
        <boxGeometry args={[1.16, 0.03, 0.03]} />
      </mesh>
      {[-0.58, 0.58].map((x) => (
        <mesh key={x} position={[x, 0, 0.034]} material={materials.trim}>
          <boxGeometry args={[0.045, 1.24, 0.04]} />
        </mesh>
      ))}
      {[-0.62, 0.62].map((y) => (
        <mesh key={y} position={[0, y, 0.034]} material={materials.trim}>
          <boxGeometry args={[1.24, 0.045, 0.04]} />
        </mesh>
      ))}
      <mesh position={[0, -0.66, 0.07]} castShadow receiveShadow material={materials.trim}>
        <boxGeometry args={[1.42, 0.045, 0.12]} />
      </mesh>
    </group>
  );
}

function Rug({ materials }: { materials: RoomMaterials }) {
  return (
    <mesh position={[-0.06, 0.012, -0.86]} receiveShadow material={materials.rug}>
      <boxGeometry args={[2.72, 0.024, 1.9]} />
    </mesh>
  );
}

export function RoomScene({
  configuration,
  layout,
  selected,
  dragEnabled,
  reduceMotion,
  onSelect,
  onDragActive,
  onCommit,
}: {
  configuration: StudioConfiguration;
  layout: FurnitureLayout;
  selected: FurnitureId | null;
  dragEnabled: boolean;
  reduceMotion: boolean;
  onSelect: (id: FurnitureId | null) => void;
  onDragActive: (active: boolean) => void;
  onCommit: (id: FurnitureId, position: { x: number; z: number }) => void;
}) {
  const materials = useRoomMaterials(configuration);

  return (
    <>
      <color attach="background" args={["#EFEAE2"]} />
      <Atmosphere mode={configuration.lightingMode} reduceMotion={reduceMotion} />
      <Floor materials={materials} onClear={() => onSelect(null)} />
      <Walls materials={materials} onClear={() => onSelect(null)} />
      <Rug materials={materials} />
      <FurnitureStage
        materials={materials}
        layout={layout}
        selected={selected}
        dragEnabled={dragEnabled}
        onSelect={onSelect}
        onDragActive={onDragActive}
        onCommit={onCommit}
      />
    </>
  );
}
