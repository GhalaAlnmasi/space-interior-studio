# Studio model

The room at `/studio` is a React Three Fiber scene. It is loaded with `next/dynamic` and `ssr: false` from `StudioStage`, so Three.js is not shipped with the other routes. There is no GLB, HDR, or downloaded texture.

## Scene

`RoomScene` builds the room from geometry:

- An oak floor slab, so the edge of the floor is visible.
- Two plaster walls meeting at a corner, thick enough to read as construction.
- An oak baseboard on both walls.
- A window on the back wall: a darker reveal, a pale glass plane, a wood frame, a meeting rail, and a projecting sill.
- A wool rug with thickness and a border drawn into its texture.
- A linen sofa: four legs, a rail, two seat cushions with rounded edges, a front piping line, three back cushions, two arms, and darker seams between the cushions.
- A travertine coffee table with a softened stone edge, brushed-metal legs and stretchers, a tray, a clay vessel, and three books.
- A clay pot and a small plant of low-segment leaves.

Furniture sits on the rug with a few centimetres of clear space between the sofa and the table. The plant stands in the open corner, off the rug.

## Materials

`useRoomMaterials` creates one set of materials for the whole scene.

| Surface | Material | Map |
| --- | --- | --- |
| Plaster | Standard, roughness 0.96 | 512 procedural, sRGB, tinted by the wall finish |
| Floor | Standard | 1024 oak, walnut, or ash, repeated 3.6 by 1.8 so the boards read long, plus a shared 512 roughness map |
| Upholstery | Standard | 512 linen, bouclé, or velvet, tinted by the cloth color |
| Travertine | Physical, clearcoat 0.18 | 512 stone, sRGB, with pits and crossing veins |
| Metal | Standard, roughness 0.48, metalness 0.55 | none |
| Clay and ceramic | Standard | none |
| Glass | Physical, opacity 0.22, no depth write | none |
| Rug | Standard, roughness 1 | 512 weave with a border |

Color maps use sRGB. The roughness map uses `NoColorSpace`. Floor anisotropy is capped at 8. Textures and materials are disposed when the canvas unmounts. The same material instance is reused across cushions, legs, and books.

## Light

Daylight is the starting light. Golden hour lowers and warms the same sun. Evening dims it and turns on a corner lamp. The recipes are in the configurator section below.

- One directional sun near the window, the only shadow caster. The shadow map is 1024², with a small bias and a radius of 3. The installed Three.js build no longer supports the old soft-shadow map, so this is the supported shadow. Golden hour uses the same sun, set lower.
- A hemisphere and a dim fill from the open side of the room. Neither casts a shadow.
- A practical lamp in the open corner. Its point light has no shadow map and falls off over 3.2 units.
- ACES filmic tone mapping at exposure 0.92. Exposure is not animated.

There is no environment map, bloom, ambient occlusion pass, or ray tracing. Walls do not cast shadows.

## Camera

Orbit limits and the three presets live in `lib/studio.ts`, which does not import Three.js, so the tests can check them directly.

| Preset | What it frames |
| --- | --- |
| Overview | The whole corner. This is also the pose Reset View restores. |
| Lounge Detail | Sofa, rug, and table, from closer in. |
| Architectural View | The window wall and the height of the room. |

Each preset is inside the distance, polar, and azimuth limits, including the slightly pulled-back pose used below 768px. The pull-back keeps the same target and the same viewing angle.

Choosing a preset eases position and target over 880ms with a smoothstep curve. A new choice replaces the active move. Dragging, scrolling, or pinching cancels it and clears the active preset. Reduced motion, the first pose, and Reset View are immediate. Reset View always returns to Overview and stores that pose for the orbit control.

The pixel ratio is `[1, 1.5]`, or `[1, 1.25]` on a narrow screen. `preserveDrawingBuffer` is off.

## Configurator

`lib/studio-config.ts` is the catalog. It does not import Three.js. The studio panel and the tests use it. The scene reads the same object.

| Choice | Options | What changes |
| --- | --- | --- |
| Fabric | Linen, Bouclé, Velvet | Shared upholstery map, roughness, and a little metalness on velvet |
| Color | Ivory, Sand, Sage, Terracotta, Charcoal | Upholstery color. Seams stay a darker copy of the same cloth |
| Floor | Natural oak, Dark walnut, Light ash | Floor map and roughness. Baseboard color follows. Window frame stays oak |
| Walls | Warm ivory, Sage, Soft clay | Plaster color on the same surface map |
| Light | Daylight, Golden hour, Evening | Sun color, height, and intensity, plus fill and a corner lamp in the evening |

Textures for the three cloths and three timbers are created once when the canvas mounts and then swapped. A color change does not allocate a new canvas or a new renderer. `applyFinish` writes into the existing materials.

The configuration state lives in `StudioStage`, separate from the camera command and from whether the mobile panel is open. React state is enough. Zustand is not installed.

Save design writes this shape to `localStorage` under `space-studio-config-v1`:

```json
{ "version": 1, "configuration": { "sofaFabric": "linen", "sofaColor": "sand", "floorFinish": "natural-oak", "wallFinish": "warm-ivory", "lightingMode": "daylight" } }
```

Missing storage, invalid JSON, a partial object, or a version other than 1 is ignored and the original finishes stay. Reset design restores those original finishes in the current visit. It does not delete the stored copy and it does not call Reset View. Randomize picks from six prepared combinations and does not write storage until Save design is used. A stored design is read on the client after the page is ready, so the server render stays on the defaults.

Light changes ease over 720ms. Reduced motion applies the target at once. Only the window sun casts a shadow. The lamp is a point light with a short range and no shadow map. Exposure is left at 0.92 so the renderer is not rewritten on each change. The window glass itself stays a pale pane. Evening reads as evening through the dimmer sun and the lamp, not through a second sky model.

## Furniture editing

The sofa, coffee table, and plant are the only movable objects. Their positions come from the layout in `lib/spatial.ts`, and the meshes are in `components/three/Furniture.tsx`. A drag writes the group position directly and commits one layout change when the pointer is released. The canvas is not remounted.

Collision, variants, undo, the v2 save format, and the camera bookmark are documented in `docs/SPATIAL_EDITOR.md`.

Phase 4 moved the saved design to `space-studio-config-v2`. The v1 record above is still read when v2 is absent. The migration is in `docs/SPATIAL_EDITOR.md`.

## Phase 5

The room is still procedural. Timber maps gained pores and short rays, plaster gained fine specks, and the stone gained a second set of veins. Cushion corners are rounder, and the modern sofa has a front piping line. Shadows use radius 3 on the same 1024 map. There is still no postprocessing.

A modeled GLB remains optional if a later pass needs photographed materials. Comparing two saved designs is also still later. It was not part of this visual pass.
