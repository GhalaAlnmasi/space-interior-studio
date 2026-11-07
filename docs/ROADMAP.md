# SPACE roadmap

## Phase 1 — Foundation

Completed in this repository.

- Next.js App Router, TypeScript strict mode, and Tailwind CSS with the SPACE tokens.
- Shared header, footer, buttons, type, and page frames.
- Homepage with a cinematic study-plate hero, philosophy, featured studies, studio teaser, principles, and footer.
- Routes for the study index, each study, the studio, about, and a designed not-found state.
- A real React Three Fiber room at `/studio`: floor, two walls, sofa made of separate rounded solids, coffee table, rug, vessel, books, and a plant.
- Orbit controls with distance, polar, and azimuth limits, mouse and touch input, a loading skeleton, a WebGL fallback, and a Reset View control that restores the saved camera.
- GSAP ScrollTrigger on selected homepage and about sections, with a reduced-motion path.
- Typed local study data. No backend, accounts, or forms.
- Design-system and roadmap notes, plus unit tests for archive data, navigation rules, camera limits, WebGL detection, the header, and project cards.

Intentionally not in Phase 1: room customization, material switching, day and night lighting, photographed project plates, and any persisted design state.

## Phase 2 — Architectural realism

Completed in this repository.

- Refined room geometry: thicker walls, oak baseboards, a framed window with a sill, a thicker rug, and more deliberate furniture spacing.
- Linen sofa rebuilt as separate seat, back, and arm cushions, with a visible seam.
- Travertine table, brushed-metal legs, clay vessel, tray, and three books.
- Procedural physically based surfaces for oak, plaster, cloth, stone, and the rug. No external texture files.
- Daylight aimed from the window, with a lower exposure so the plaster stays out of the whites.
- Three camera presets — Overview, Lounge Detail, and Architectural View — with eased moves, immediate moves when reduced motion is requested, and Reset View returning to the original overview.
- Studio toolbar with keyboard-reachable preset buttons and a visible active state.
- Each study now carries a conceptual disclaimer, a philosophy, finish notes, and a plan and section drawing. The drawings are labeled as illustrations, not construction documents.
- Short page-enter motion, removed when reduced motion is requested.

Still open, and not part of this phase: licensed photography. No photograph was verified for reuse, so the original study drawings remain. Do not replace them with unlabeled stock photos.

## Phase 3 — Interactive configurator

Completed in this repository.

- Typed finish catalog for linen, bouclé, and velvet, five upholstery colors, three floors, three walls, and three light settings.
- Those choices update the live materials and lights. The canvas is not remounted, and the camera stays where it is.
- Daylight, golden hour, and evening. Evening adds a warm corner lamp. Light changes ease over 720ms, or snap when reduced motion is requested.
- Save design writes `space-studio-config-v1` in localStorage. Invalid data and older schema versions are ignored. Reset design restores the original finishes without moving the camera or deleting the saved copy. Randomize picks a prepared combination and does not save it. Phase 4 still reads a valid v1 record and places it on the original furniture.
- The studio is a viewport plus a finish panel. On a narrow screen the panel is collapsed until Configure room is opened.

There is no account and no server.

## Phase 4 — Interactive furniture

Completed in this repository.

- The sofa, coffee table, and plant can be selected in the scene or from the panel.
- Each can move on the floor. Desktop drag uses the pointer. Narrow screens, and anyone using a keyboard, move them with directional buttons. Arrow keys do the same when a piece is selected.
- Movement stops at the walls, the open floor edges, the corner lamp, and the other pieces. Footprints are axis-aligned. Furniture does not rotate.
- Each piece has two forms: a low sofa or a rounded lounge, a rectangular stone table or a round pedestal, a tall plant or a compact one. A form that does not fit shifts slightly or is refused.
- Undo and Redo keep the last 10 design edits. A drag is one edit. Orbiting the camera is not. Cmd/Ctrl+Z and Cmd/Ctrl+Shift+Z match the buttons.
- Save design writes `space-studio-config-v2`, including finishes and furniture. A valid v1 finish set migrates onto the original arrangement. Invalid layouts are ignored.
- Save perspective stores one camera pose in `space-studio-camera-v1`. Restoring it does not change the design.

## Phase 4 notes that stay open

A shelf and an extra chair were considered and left out. The corner lamp is already part of the evening light and is a fixed obstacle, not a movable piece.

## Phase 5 — Cinematic polish

Completed in this repository.

- Homepage hero keeps its type and plate, with a scroll cue, a short plate drift, and a clearer studio invitation: furniture, materials, light, and camera.
- Editorial sections stagger on scroll. Project cards keep a quiet image scale and a bronze rule. Studies stay labeled as conceptual drawings.
- The room uses the same geometry budget: rounder cushions, a sofa piping line, longer timber repeat, plaster specks, stone veins, a lower golden-hour sun, a shorter lamp falloff, and a softer shadow on the existing 1024 map.
- The studio tools are unchanged. The furniture group sits in its own field, and the canvas column can shrink on a narrow screen.
- Open Graph title and description are set. No public production URL is invented.
- A portfolio write-up lives in `docs/PORTFOLIO_CASE_STUDY.md`.

## Phase 6 — Production launch

Prepared locally. Not published.

- The metadata description states that SPACE is a self-initiated conceptual studio. Open Graph uses that description. No `metadataBase`, canonical URL, or sitemap is set, because there is no production host yet.
- `app/robots.ts` allows indexing. `app/icon.svg` is the icon.
- No environment variables are required. `.env*` stays gitignored.
- Launch, Vercel, rollback, and portfolio steps are in `docs/DEPLOYMENT.md` and `docs/PORTFOLIO_INTEGRATION.md`.
- Gate A is the local preparation. Gate B (GitHub), Gate C (Vercel), and Gate D (the separate portfolio site) wait for approval.

## Later

- Compare two saved material and camera states side by side, and keep a private collection of those views on the device. Decide only then whether any of that state needs a server.
- A modeled GLB is still optional if procedural surfaces are not enough.
- Move the existing string modules into a translation dictionary. The components are already written as complete phrases.
- Run an accessibility pass on a phone, a tablet, and a desktop keyboard beyond the local browser checks.
- Measure a performance budget for the studio route before quoting scores.
- Confirm the Vercel deployment itself only after Gate C is approved.
