# Spatial editor

The studio edits one room. Furniture moves on the floor. Finishes and light stay on the same materials and the same lights as Phase 3.

## Coordinates

The floor is the X/Z plane. Y is fixed for each piece: the sofa and table sit at 0.02, the plant at 0. Rotation is always zero, so every footprint is an axis-aligned rectangle around the piece's origin.

Usable floor, inside the plaster and short of the open edges:

| Edge | Limit |
| --- | --- |
| Left | x − width / 2 ≥ −2.42 |
| Right | x + width / 2 ≤ 2.42 |
| Window | z − depth / 2 ≥ −2.05 |
| Opening | z + depth / 2 ≤ 2.05 |

The window sill is above the furniture and is not a floor obstacle. The corner lamp is fixed at x −2.02, z −1.62, with a 0.28 by 0.28 base. Pieces keep an 8cm clearance from that base and from each other.

## Pieces

| ID | Default origin | Forms | Footprint (width × depth) |
| --- | --- | --- | --- |
| `sofa` | −0.08, −1.28 | `modern`, `rounded` | 2.10 × 0.86, 1.86 × 1.02 |
| `coffee-table` | −0.02, −0.36 | `rectangular`, `sculptural` | 1.22 × 0.72, 0.92 × 0.92 |
| `plant` | −2.12, 0.62 | `tall`, `compact` | 0.56 × 0.56, 0.40 × 0.40 |

`modern` is the long cushioned sofa. `rounded` is a lower lounge with thick arms. `rectangular` is the stone top on a metal frame. `sculptural` is a round top on a pedestal. `tall` is the upright plant. `compact` is a low pot and a dense crown. Cloth, stone, and clay materials are the ones already used by the configurator.

## Movement

`moveFurniture` walks from the current origin toward the pointer in 4cm steps. If a step would leave the floor, hit the lamp, or overlap another piece, that step stops. The piece can still slide along the blocked axis, and it stays at the last valid point. It does not jump past an obstacle.

On a wide screen, a second press on a selected piece drags it. The pointer keeps its offset from the origin, so the piece does not snap to the cursor. Orbit is turned off for that gesture and restored on pointer up, pointer cancel, or lost capture. A drag is one undo entry, written when the pointer is released.

Below 768px, drag is off so orbit stays reliable. The panel buttons, and the arrow keys while a piece is selected, move it 12cm at a time in room axes: left, right, toward the window, and toward the opening. A blocked step leaves the piece where it is and says so.

Selecting a piece draws a bronze rectangle on the floor and names it in the panel. Clicking the floor, a wall, or empty space clears the selection. Selection and opening the panel are not design edits.

## Variants

Changing form checks the new footprint at the current origin. If it fits, only the form changes. If it does not, the editor searches outward up to 64cm in eight directions. The first clear spot is used, and the panel says the piece shifted. If nothing within that radius is clear, the form stays as it was.

## Undo and Redo

History stores the finish set and the furniture layout together. It keeps 10 past designs. A new edit clears the redo list. An unchanged edit is ignored. Orbit, selection, and the camera bookmark are outside this history.

The buttons are Undo and Redo. Cmd/Ctrl+Z undoes. Cmd/Ctrl+Shift+Z redoes. The shortcuts do nothing while focus is in a text field. Reset design and Randomize are edits. Randomize changes finishes only and leaves the furniture where it is. Reset design restores the original finishes, light, and arrangement, and it does not move the camera or delete the saved copy.

## Saved design

Save design writes `space-studio-config-v2`:

```json
{
  "version": 2,
  "configuration": {
    "sofaFabric": "linen",
    "sofaColor": "sand",
    "floorFinish": "natural-oak",
    "wallFinish": "warm-ivory",
    "lightingMode": "daylight"
  },
  "layout": {
    "sofa": { "variant": "modern", "position": { "x": -0.08, "z": -1.28 } },
    "coffee-table": { "variant": "rectangular", "position": { "x": -0.02, "z": -0.36 } },
    "plant": { "variant": "tall", "position": { "x": -2.12, "z": 0.62 } }
  }
}
```

On load, a non-empty v2 value is used when the finishes, variants, and positions are valid and the layout does not overlap. An invalid v2 value is ignored, including unknown ids, non-finite coordinates, and pieces outside the room.

If v2 is missing, a valid `space-studio-config-v1` finish set is restored onto the original furniture arrangement. Saving then writes v2. The older key is left in place. Missing storage, invalid JSON, and a version other than 1 or 2 do not throw. The server render always starts from the original design, and the browser applies a saved design after hydration.

## Camera bookmark

Save perspective writes one pose to `space-studio-camera-v1`:

```json
{ "version": 1, "position": [1.35, 1.25, 1.9], "target": [-0.1, 0.42, -0.95] }
```

The pose must be finite and inside the existing orbit limits, so restore does not clip through the floor or swing outside the allowed view. Restore eases the camera unless reduced motion is requested, and it keeps the orbit target in step. It does not change finishes or furniture. Clear perspective removes the key. Save design does not write this key, and this key is not part of undo.

## Performance

One canvas, one shadow map, and the same procedural textures as Phase 3. Phase 5 redrew those textures and softened the shadow. It did not change footprints, collision, or history. Drag updates a group position and runs a few rectangle tests. It does not allocate materials, rebuild textures, or record a history entry per pointer sample. Temporary Three.js helpers for the ray live for the life of the canvas. The canvas column uses `min-w-0` so the drawing buffer cannot widen the page.

## Limits

Furniture cannot rotate, resize, or leave this room. The rug, vessel, books, and lamp stay with their current roles: the vessel and books ride on the table, and the lamp does not move. There is no physics engine and no second route.
