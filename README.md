# SPACE — Interactive Interior Studio

An immersive 3D interior design studio built with Next.js, TypeScript, and React Three Fiber.

SPACE is a self-initiated conceptual project. The studies are original drawings, not commissioned rooms. The studio route is a working model: finishes, light, and three pieces of furniture can be changed in the browser and kept on that device.

Suggested GitHub description: “An immersive 3D interior design studio built with Next.js, TypeScript, and React Three Fiber.”

Suggested repository name: `space-interior-studio`.

## Overview

The site is an editorial front for three conceptual studies, plus one interactive room at `/studio`. There is no account, no database, and no required environment variable.

## Key features

- Editorial pages for the practice, the studies, and the model
- A procedural plaster room with orbit controls and three camera presets
- Sofa cloth and color, three floors, three walls, and three light settings
- Selection and floor movement for the sofa, coffee table, and plant, with collision
- Two forms for each of those pieces
- Undo and redo for the last 10 design edits
- Save design and one saved camera perspective, both in `localStorage`
- Reduced-motion support and a written fallback when WebGL is unavailable

## Tech stack

- Next.js 16.4.5 App Router
- React 19.3.0 and TypeScript
- Tailwind CSS 4
- Three.js, React Three Fiber 9.8.2, and Drei 10.7.9
- GSAP for a few scroll reveals
- Vitest

React Three Fiber 9.8 requires React 19 below 19.4, so React stays on 19.3. Node.js 20.9 or newer is required.

## 3D architecture

`/studio` loads one canvas with `next/dynamic` and `ssr: false`. Other routes do not ship Three.js. Surfaces are generated on canvas at runtime. There is no GLB, HDR, or downloaded texture. The scene graph, lighting, and performance limits are in `docs/3D_ARCHITECTURE.md`.

## Interactive configurator

Finish options and light recipes live in `lib/studio-config.ts`. Changing a finish updates the existing materials. The canvas is not remounted, and the camera stays where it is.

## Furniture editing

Footprints, movement, and collision live in `lib/spatial.ts` and do not import Three.js. Pieces stay on the floor, do not rotate, and stop at the walls, the lamp, and each other. The editing model is in `docs/SPATIAL_EDITOR.md`.

## Camera system

Overview, Lounge Detail, and Architectural View ease into place, or jump when reduced motion is requested. Reset View returns to the original overview. Save perspective stores one pose in `space-studio-camera-v1`. Restoring it does not change the design.

## Local persistence

Save design writes `space-studio-config-v2`. A valid `space-studio-config-v1` finish set is still read and placed on the original furniture until the visitor saves again. Invalid data is ignored. Reset design does not delete the stored copy.

## Accessibility

Skip link, visible focus, 44px targets, and names on the furniture controls. Movement has buttons and arrow keys, so it is not drag-only. `prefers-reduced-motion` skips scroll motion, camera eases, and light eases.

## Performance decisions

One canvas, one 1024 shadow map, pixel ratio capped at 1.5 (1.25 on a narrow screen), and no postprocessing. Drag updates the mesh and commits one history entry on release. Lighthouse and frame-rate numbers have not been measured.

## Getting started

Node.js 22 LTS is the version used for the release check. Node.js 20.9 or newer also matches `engines`.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

| Command | Purpose |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm test` | Vitest, once |
| `npm run build` | Production build |
| `npm start` | Serve the production build |

## Deployment

No environment variables are required. Import the repository on Vercel as a Next.js project, with root directory `.`, install command `npm ci`, and build command `npm run build`. Do not deploy until that step is approved. The full checklist, smoke test, metadata update, and rollback notes are in `docs/DEPLOYMENT.md`.

There is no public production URL yet. Open Graph uses the title and description only. `metadataBase`, a canonical URL, and a sitemap should be added only after the real host exists.

## Project structure

```text
app/                  routes, metadata, icon, robots
components/layout/    header, footer, page header
components/home/      homepage sections
components/ui/        button, type, plates, cards
components/three/     studio stage, canvas, room
lib/                  typed copy, studies, camera, collision, storage
tests/                unit tests
docs/                 design system, architecture, launch notes
```

## Known limitations

- The room is one shared prototype. It is not a model of a specific study. Furniture does not rotate or resize.
- Study plates are drawings. Licensed photography has not been added.
- Saved designs and the camera bookmark stay in the browser that saved them.
- There is no contact form, account, or server.

## Credits and asset licensing

Study plates, plans, and the icon are original drawings for this project. Procedural surfaces are generated in the browser. Fonts are loaded with `next/font`. Details are in `docs/ASSET_LICENSES.md`.

The portfolio write-up is `docs/PORTFOLIO_CASE_STUDY.md`. How to place it on a separate portfolio site is `docs/PORTFOLIO_INTEGRATION.md`.
