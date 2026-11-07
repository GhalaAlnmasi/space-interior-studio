# SPACE — Interactive Interior Studio

**Subtitle:** An immersive 3D interior design experience.

A personal, self-initiated concept project. It is not a commission. The three studies are not built rooms, and there is no commercial deployment.

## Category

Creative Frontend Development. 3D Web Experience. UI/UX Design.

## Technology

Next.js, TypeScript, Tailwind CSS, Three.js, React Three Fiber, and GSAP.

## 1. Project overview

SPACE is an editorial site with one working room. The pages introduce a quiet interior practice. The studio route lets a visitor change cloth, floor, plaster, and light, then select and move the sofa, coffee table, and plant. The design and one camera view stay in the browser.

The palette is ivory, sand, sage, charcoal, and bronze. Manrope is the interface face. Cormorant Garamond is the editorial face.

## 2. Problem and opportunity

A page of still images can describe a room, but it cannot show a material change, a blocked move, or a saved view. The opportunity was to put a small, reliable editor inside an editorial site without turning the page into a generic dashboard or adding a backend.

## 3. Design philosophy

The interface stays close to an architectural monograph: large type, wide margins, square corners, and hairline rules. Motion is short and skips itself when reduced motion is requested. The studies are labeled as drawings. The room is labeled as a shared study model, not a reconstruction of a project.

## 4. My role

I designed and built the site: the editorial pages, the design system, the procedural room, the configurator, the furniture editor, the tests, and the launch notes. There was no client and no team.

## 5. Technical architecture

Server Components render the pages. Three.js loads only on `/studio`, through `next/dynamic` with server rendering off. Finish data, camera limits, collision, undo, and storage are plain TypeScript modules with no Three.js import, so they can be tested without a canvas.

The saved design is `space-studio-config-v2` in `localStorage`. A valid v1 finish set migrates onto the original furniture. The camera bookmark is a separate key and is not part of undo. No environment variable is required.

## 6. Key interactive features

- Three camera presets, orbit limits, reset, and one saved perspective.
- Sofa fabric and color, three floors, three walls, and daylight, golden hour, and evening.
- Selection in the scene or the panel. Floor drag on a wide screen. Directional buttons and arrow keys on any width.
- Two forms for each movable piece. A form that does not fit is shifted slightly or refused.
- Undo and redo for the last 10 design edits. A drag counts once, on release.
- Save, reset, and randomize. Reset does not delete the stored copy or move the camera.

## 7. Technical challenges

- The canvas drawing buffer can force a grid column wider than the screen.
- A furniture drag must not orbit the camera, and it must not write a history entry for every pointer sample.
- Older saved finishes had to keep working after the layout was added to the save file.
- A production URL did not exist, so canonical metadata could not be set honestly.

## 8. Implementation decisions

- The studio column uses `min-w-0`, and the canvas is capped to that column.
- Orbit is disabled for the drag gesture. The layout commits when the pointer is released.
- v1 is still read when v2 is missing. An invalid v2 value does not fall through to v1.
- Titles and descriptions are set. `metadataBase`, a canonical URL, and a sitemap wait for the real host.
- Surfaces stay procedural. A photographed GLB was not added.

## 9. Accessibility

- Skip link, visible focus, and 44px targets.
- Furniture can be selected and moved without a drag.
- Status text names the selected piece. The bronze marker is an extra signal.
- `prefers-reduced-motion` skips the hero cue, the plate drift, the scroll reveals, camera eases, and light eases.
- The studio explains itself in text when WebGL is unavailable.

## 10. Performance optimizations

- One canvas. Drag writes the group position and commits React state on release.
- Textures are created when the canvas mounts and swapped when a finish changes. Maps stay between 512 and 1024 pixels.
- One 1024 shadow map. Pixel ratio is capped at 1.5, and at 1.25 below 768px. There is no postprocessing.
- ScrollTrigger is loaded on the pages that use it and reverted on unmount.
- No smooth-scroll library and no new runtime dependency for this launch pass.

Lighthouse and frame-rate numbers were not measured.

## 11. Outcomes

The working tree contains an editorial front, three labeled conceptual studies, and a room that can be finished and furnished in the browser. Automated checks cover navigation, camera limits, finish parsing, collision, history, and storage. A production host is not live yet. Nothing is presented as a commissioned building.

## 12. Future improvements

- Publish the repository and the Vercel project after review, then set `metadataBase` to that origin.
- Add the project card to the separate portfolio site, with the live URL and source link.
- Keep a small on-device collection of named designs, and compare two of them.
- Move the existing phrase modules into a translation dictionary.
- Consider a GLB only if a measured pass shows the procedural surfaces are the limit.

## Screenshot checklist

Capture the running app. Do not invent clients, awards, or built photography. Sizes and placement notes are in `docs/PORTFOLIO_INTEGRATION.md`.

1. Homepage hero.
2. Featured conceptual studies.
3. Studio overview in daylight.
4. A material change.
5. Evening lighting.
6. A selected piece of furniture.
7. The studio on a narrow screen.
