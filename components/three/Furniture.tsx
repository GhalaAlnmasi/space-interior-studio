"use client";

import { useThree, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import type { RoomMaterials } from "@/components/three/roomMaterials";
import { footprintOf, moveFurniture, type FurnitureId, type FurnitureLayout } from "@/lib/spatial";

type FurnitureStageProps = {
  materials: RoomMaterials;
  layout: FurnitureLayout;
  selected: FurnitureId | null;
  dragEnabled: boolean;
  onSelect: (id: FurnitureId | null) => void;
  onDragActive: (active: boolean) => void;
  onCommit: (id: FurnitureId, position: { x: number; z: number }) => void;
};

type DragState = {
  id: FurnitureId;
  offsetX: number;
  offsetZ: number;
  x: number;
  z: number;
  pointerId: number;
};

const pieceY: Record<FurnitureId, number> = {
  sofa: 0.02,
  "coffee-table": 0.02,
  plant: 0,
};

export function FurnitureStage({ materials, layout, selected, dragEnabled, onSelect, onDragActive, onCommit }: FurnitureStageProps) {
  const { camera, gl } = useThree();
  const layoutRef = useRef(layout);
  const selectedRef = useRef(selected);
  const dragEnabledRef = useRef(dragEnabled);
  const onSelectRef = useRef(onSelect);
  const onDragActiveRef = useRef(onDragActive);
  const onCommitRef = useRef(onCommit);
  const dragRef = useRef<DragState | null>(null);
  const sofaRef = useRef<THREE.Group>(null);
  const tableRef = useRef<THREE.Group>(null);
  const plantRef = useRef<THREE.Group>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const hitPoint = useRef(new THREE.Vector3());
  const marker = useMemo(() => new THREE.MeshBasicMaterial({ color: "#A77C55", toneMapped: false }), []);
  const groups = { sofa: sofaRef, "coffee-table": tableRef, plant: plantRef };

  useLayoutEffect(() => {
    layoutRef.current = layout;
    selectedRef.current = selected;
    dragEnabledRef.current = dragEnabled;
    onSelectRef.current = onSelect;
    onDragActiveRef.current = onDragActive;
    onCommitRef.current = onCommit;
  });

  useLayoutEffect(() => {
    return () => marker.dispose();
  }, [marker]);

  useLayoutEffect(() => {
    if (dragRef.current) return;
    sofaRef.current?.position.set(layout.sofa.position.x, pieceY.sofa, layout.sofa.position.z);
    tableRef.current?.position.set(layout["coffee-table"].position.x, pieceY["coffee-table"], layout["coffee-table"].position.z);
    plantRef.current?.position.set(layout.plant.position.x, pieceY.plant, layout.plant.position.z);
  }, [layout]);

  function floorPoint(clientX: number, clientY: number) {
    const rect = gl.domElement.getBoundingClientRect();
    pointer.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.current.setFromCamera(pointer.current, camera);
    return raycaster.current.ray.intersectPlane(plane.current, hitPoint.current);
  }

  function beginPointer(id: FurnitureId, event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    const alreadySelected = selectedRef.current === id;
    onSelectRef.current(id);
    onDragActiveRef.current(true);
    const element = gl.domElement;
    const pointerId = event.pointerId;
    const shouldDrag = dragEnabledRef.current && alreadySelected;
    if (shouldDrag) {
      const point = event.ray.intersectPlane(plane.current, hitPoint.current);
      const place = layoutRef.current[id].position;
      if (point) {
        dragRef.current = {
          id,
          offsetX: place.x - hitPoint.current.x,
          offsetZ: place.z - hitPoint.current.z,
          x: place.x,
          z: place.z,
          pointerId,
        };
        try {
          element.setPointerCapture(pointerId);
        } catch {
          // The pointer can already be gone if the browser cancelled it.
        }
      }
    }

    const onMove = (native: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || native.pointerId !== drag.pointerId) return;
      if (!floorPoint(native.clientX, native.clientY)) return;
      const next = moveFurniture(layoutRef.current, drag.id, hitPoint.current.x + drag.offsetX, hitPoint.current.z + drag.offsetZ);
      drag.x = next.x;
      drag.z = next.z;
      groups[drag.id].current?.position.set(next.x, pieceY[drag.id], next.z);
    };

    let done = false;
    const finish = (native: PointerEvent) => {
      if (done || native.pointerId !== pointerId) return;
      done = true;
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerup", finish);
      element.removeEventListener("pointercancel", finish);
      element.removeEventListener("lostpointercapture", finish);
      const drag = dragRef.current;
      dragRef.current = null;
      onDragActiveRef.current(false);
      if (drag && drag.id === id) onCommitRef.current(drag.id, { x: drag.x, z: drag.z });
      try {
        if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);
      } catch {
        // Capture was already released with the pointer.
      }
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerup", finish);
    element.addEventListener("pointercancel", finish);
    element.addEventListener("lostpointercapture", finish);
  }

  return (
    <>
      <Piece
        id="sofa"
        groupRef={sofaRef}
        layout={layout}
        selected={selected === "sofa"}
        marker={marker}
        onPointerDown={beginPointer}
      >
        {layout.sofa.variant === "rounded" ? <RoundedSofa materials={materials} /> : <ModernSofa materials={materials} />}
      </Piece>
      <Piece
        id="coffee-table"
        groupRef={tableRef}
        layout={layout}
        selected={selected === "coffee-table"}
        marker={marker}
        onPointerDown={beginPointer}
      >
        {layout["coffee-table"].variant === "sculptural" ? <SculpturalTable materials={materials} /> : <RectangularTable materials={materials} />}
      </Piece>
      <Piece
        id="plant"
        groupRef={plantRef}
        layout={layout}
        selected={selected === "plant"}
        marker={marker}
        onPointerDown={beginPointer}
      >
        {layout.plant.variant === "compact" ? <CompactPlant materials={materials} /> : <TallPlant materials={materials} />}
      </Piece>
    </>
  );
}

function Piece({
  id,
  groupRef,
  layout,
  selected,
  marker,
  onPointerDown,
  children,
}: {
  id: FurnitureId;
  groupRef: RefObject<THREE.Group | null>;
  layout: FurnitureLayout;
  selected: boolean;
  marker: THREE.MeshBasicMaterial;
  onPointerDown: (id: FurnitureId, event: ThreeEvent<PointerEvent>) => void;
  children: ReactNode;
}) {
  const placement = layout[id];
  const size = footprintOf(id, placement.variant) ?? { width: 1, depth: 1 };
  return (
    <group
      ref={groupRef}
      name={id}
      position={[placement.position.x, pieceY[id], placement.position.z]}
      onPointerDown={(event) => onPointerDown(id, event)}
      onPointerOver={(event) => {
        event.stopPropagation();
        if (event.nativeEvent.currentTarget instanceof HTMLElement) event.nativeEvent.currentTarget.style.cursor = "pointer";
      }}
      onPointerOut={(event) => {
        if (event.nativeEvent.currentTarget instanceof HTMLElement) event.nativeEvent.currentTarget.style.cursor = "";
      }}
    >
      {children}
      {selected ? <SelectionFrame width={size.width} depth={size.depth} localY={0.03 - pieceY[id]} material={marker} /> : null}
    </group>
  );
}

function SelectionFrame({
  width,
  depth,
  localY,
  material,
}: {
  width: number;
  depth: number;
  localY: number;
  material: THREE.Material;
}) {
  const thickness = 0.012;
  return (
    <group position={[0, localY, 0]}>
      <mesh position={[0, 0, -depth / 2]} material={material}>
        <boxGeometry args={[width, 0.006, thickness]} />
      </mesh>
      <mesh position={[0, 0, depth / 2]} material={material}>
        <boxGeometry args={[width, 0.006, thickness]} />
      </mesh>
      <mesh position={[-width / 2, 0, 0]} material={material}>
        <boxGeometry args={[thickness, 0.006, depth]} />
      </mesh>
      <mesh position={[width / 2, 0, 0]} material={material}>
        <boxGeometry args={[thickness, 0.006, depth]} />
      </mesh>
    </group>
  );
}

function Cushion({
  args,
  position,
  material,
  radius = 0.028,
}: {
  args: [number, number, number];
  position: [number, number, number];
  material: THREE.Material;
  radius?: number;
}) {
  return (
    <RoundedBox args={args} radius={radius} smoothness={2} bevelSegments={2} position={position} material={material} castShadow />
  );
}

function ModernSofa({ materials }: { materials: RoomMaterials }) {
  const legs = [
    [-0.86, 0.07, -0.32],
    [0.86, 0.07, -0.32],
    [-0.86, 0.07, 0.32],
    [0.86, 0.07, 0.32],
  ] as const;

  return (
    <group>
      {legs.map(([x, y, z]) => (
        <mesh key={`${x}-${z}`} position={[x, y, z]} castShadow material={materials.trim}>
          <cylinderGeometry args={[0.028, 0.022, 0.14, 12]} />
        </mesh>
      ))}
      <RoundedBox args={[1.92, 0.07, 0.8]} radius={0.015} smoothness={2} bevelSegments={1} position={[0, 0.17, 0]} material={materials.fabricDeep} castShadow />
      <Cushion args={[0.86, 0.16, 0.7]} position={[-0.46, 0.28, 0.03]} material={materials.fabric} radius={0.045} />
      <Cushion args={[0.86, 0.16, 0.7]} position={[0.46, 0.28, 0.03]} material={materials.fabric} radius={0.045} />
      <mesh position={[0, 0.24, 0.34]} material={materials.fabricDeep}>
        <boxGeometry args={[1.64, 0.012, 0.014]} />
      </mesh>
      <mesh position={[0, 0.3, 0.03]} material={materials.fabricDeep}>
        <boxGeometry args={[0.018, 0.1, 0.62]} />
      </mesh>
      {[-0.62, 0, 0.62].map((x) => (
        <Cushion key={x} args={[0.56, 0.4, 0.12]} position={[x, 0.56, -0.32]} material={materials.fabric} radius={0.04} />
      ))}
      {[-0.31, 0.31].map((x) => (
        <mesh key={x} position={[x, 0.56, -0.32]} material={materials.fabricDeep}>
          <boxGeometry args={[0.016, 0.32, 0.08]} />
        </mesh>
      ))}
      {[-0.98, 0.98].map((x) => (
        <Cushion key={x} args={[0.14, 0.32, 0.78]} position={[x, 0.36, 0.01]} material={materials.fabricDeep} radius={0.04} />
      ))}
    </group>
  );
}

function RoundedSofa({ materials }: { materials: RoomMaterials }) {
  return (
    <group>
      <Cushion args={[1.42, 0.24, 0.78]} position={[0, 0.26, 0.04]} material={materials.fabric} radius={0.08} />
      <Cushion args={[0.62, 0.32, 0.18]} position={[-0.34, 0.46, -0.28]} material={materials.fabric} radius={0.06} />
      <Cushion args={[0.62, 0.32, 0.18]} position={[0.34, 0.46, -0.28]} material={materials.fabric} radius={0.06} />
      <Cushion args={[0.28, 0.3, 0.7]} position={[-0.78, 0.32, 0.02]} material={materials.fabricDeep} radius={0.09} />
      <Cushion args={[0.28, 0.3, 0.7]} position={[0.78, 0.32, 0.02]} material={materials.fabricDeep} radius={0.09} />
    </group>
  );
}

function RectangularTable({ materials }: { materials: RoomMaterials }) {
  const legs = [
    [-0.46, 0.17, -0.24],
    [0.46, 0.17, -0.24],
    [-0.46, 0.17, 0.24],
    [0.46, 0.17, 0.24],
  ] as const;

  return (
    <group>
      <RoundedBox
        args={[1.18, 0.05, 0.66]}
        radius={0.016}
        smoothness={2}
        bevelSegments={1}
        position={[0, 0.38, 0]}
        material={materials.stone}
        castShadow
        receiveShadow
      />
      {legs.map(([x, y, z]) => (
        <mesh key={`${x}-${z}`} position={[x, y, z]} castShadow material={materials.metal}>
          <boxGeometry args={[0.028, 0.32, 0.028]} />
        </mesh>
      ))}
      <mesh position={[0, 0.08, 0]} material={materials.metal}>
        <boxGeometry args={[0.9, 0.012, 0.012]} />
      </mesh>
      <mesh position={[0, 0.08, 0]} material={materials.metal}>
        <boxGeometry args={[0.012, 0.012, 0.46]} />
      </mesh>
      <TableObjects materials={materials} />
    </group>
  );
}

function SculpturalTable({ materials }: { materials: RoomMaterials }) {
  return (
    <group>
      <mesh position={[0, 0.36, 0]} castShadow receiveShadow material={materials.stone}>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 32]} />
      </mesh>
      <mesh position={[0, 0.16, 0]} castShadow material={materials.metal}>
        <cylinderGeometry args={[0.07, 0.1, 0.3, 16]} />
      </mesh>
      <mesh position={[0, 0.02, 0]} material={materials.metal}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 20]} />
      </mesh>
      <TableObjects materials={materials} />
    </group>
  );
}

function TableObjects({ materials }: { materials: RoomMaterials }) {
  return (
    <group>
      <mesh position={[-0.16, 0.4, 0.02]} rotation={[0, 0.2, 0]} receiveShadow material={materials.metal}>
        <cylinderGeometry args={[0.1, 0.1, 0.012, 24]} />
      </mesh>
      <group position={[-0.16, 0.421, 0.02]}>
        <mesh castShadow material={materials.ceramic}>
          <cylinderGeometry args={[0.05, 0.038, 0.028, 20]} />
        </mesh>
        <mesh position={[0, 0.065, 0]} castShadow material={materials.ceramic}>
          <cylinderGeometry args={[0.066, 0.052, 0.1, 24]} />
        </mesh>
        <mesh position={[0, 0.132, 0]} castShadow material={materials.ceramic}>
          <cylinderGeometry args={[0.034, 0.046, 0.04, 20]} />
        </mesh>
      </group>
      <group position={[0.16, 0.405, 0.02]} rotation={[0, 0.35, 0]}>
        <mesh castShadow material={materials.clay}>
          <boxGeometry args={[0.18, 0.02, 0.24]} />
        </mesh>
        <mesh position={[0.01, 0.018, 0]} castShadow material={materials.fabricDeep}>
          <boxGeometry args={[0.16, 0.018, 0.21]} />
        </mesh>
        <mesh position={[-0.008, 0.034, 0.004]} castShadow material={materials.trim}>
          <boxGeometry args={[0.14, 0.014, 0.18]} />
        </mesh>
      </group>
    </group>
  );
}

function TallPlant({ materials }: { materials: RoomMaterials }) {
  const leaves = [
    { position: [0, 0.42, 0] as [number, number, number], scale: [0.16, 0.22, 0.1] as [number, number, number] },
    { position: [0.12, 0.5, 0.02] as [number, number, number], scale: [0.12, 0.16, 0.08] as [number, number, number] },
    { position: [-0.1, 0.48, 0.04] as [number, number, number], scale: [0.11, 0.15, 0.07] as [number, number, number] },
    { position: [0.04, 0.58, -0.02] as [number, number, number], scale: [0.09, 0.13, 0.06] as [number, number, number] },
    { position: [-0.02, 0.34, 0.06] as [number, number, number], scale: [0.1, 0.12, 0.07] as [number, number, number] },
  ];

  return (
    <group>
      <mesh position={[0, 0.08, 0]} castShadow material={materials.clay}>
        <cylinderGeometry args={[0.11, 0.09, 0.16, 16]} />
      </mesh>
      <mesh position={[0, 0.17, 0]} material={materials.clay}>
        <cylinderGeometry args={[0.125, 0.11, 0.03, 16]} />
      </mesh>
      <mesh position={[0, 0.28, 0]} material={materials.foliageDeep}>
        <cylinderGeometry args={[0.008, 0.01, 0.22, 6]} />
      </mesh>
      {leaves.map((leaf) => (
        <mesh key={leaf.position.join("-")} position={leaf.position} scale={leaf.scale} castShadow material={materials.foliage}>
          <sphereGeometry args={[1, 10, 8]} />
        </mesh>
      ))}
    </group>
  );
}

function CompactPlant({ materials }: { materials: RoomMaterials }) {
  const leaves = [
    { position: [0, 0.24, 0] as [number, number, number], scale: [0.16, 0.1, 0.14] as [number, number, number] },
    { position: [0.1, 0.22, 0.04] as [number, number, number], scale: [0.1, 0.08, 0.1] as [number, number, number] },
    { position: [-0.1, 0.2, 0.02] as [number, number, number], scale: [0.11, 0.08, 0.09] as [number, number, number] },
  ];

  return (
    <group>
      <mesh position={[0, 0.07, 0]} castShadow material={materials.clay}>
        <cylinderGeometry args={[0.16, 0.13, 0.12, 16]} />
      </mesh>
      <mesh position={[0, 0.14, 0]} material={materials.clay}>
        <cylinderGeometry args={[0.17, 0.15, 0.025, 16]} />
      </mesh>
      {leaves.map((leaf) => (
        <mesh key={leaf.position.join("-")} position={leaf.position} scale={leaf.scale} castShadow material={materials.foliage}>
          <sphereGeometry args={[1, 10, 8]} />
        </mesh>
      ))}
    </group>
  );
}
