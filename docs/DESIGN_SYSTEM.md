# SPACE design system

Warm architectural minimalism. The interface should feel like an editorial interior monograph: large type, wide margins, hairline rules, and very little chrome.

## Color

Brand colors are defined as CSS variables on `:root` and exposed to Tailwind through `@theme`.

| Token | Hex | Use |
| --- | --- | --- |
| Ivory | `#F5F1E9` | Page background |
| Sand | `#D8CCBA` | Warm fields, selection, text on charcoal |
| Sage | `#777F67` | Large color fields and the hero emphasis only |
| Charcoal | `#242820` | Text, primary buttons, the studio band |
| Bronze | `#A77C55` | Large italic emphasis and active underlines |

Sage on ivory is about 3.7:1. Bronze on ivory is about 3.3:1. Both are reserved for large display type and fills. They are not used for body copy, navigation, or small labels.

Functional tones, derived for contrast and documented so they are not mistaken for extra brand colors:

| Token | Hex | Use |
| --- | --- | --- |
| Sage deep | `#4A5140` | Small labels and secondary text on ivory (about 7.3:1) |
| Bronze deep | `#6E4E32` | Focus rings and text links on ivory (about 6.7:1) |
| Ivory deep | `#E7E0D4` | Study-plate and model wells |
| Ink soft | `#3A4036` | Body copy |

The site is light only. `color-scheme: light` is set so the browser UI does not invert it.

## Typography

- **Manrope** (`next/font`, CSS variable `--font-manrope`) is the UI face: navigation, labels, buttons, and body.
- **Cormorant Garamond** (`--font-cormorant`) is the editorial face: page titles, project names, and the footer wordmark. Italic is used for a single emphasis word, not for whole paragraphs of UI.
- Labels are 11px, medium, uppercase, with tracking around `0.22em`–`0.32em`.
- Display titles use tight leading (`0.84`–`0.95`) and slight negative tracking.
- `text-wrap: balance` is applied to headings and `text-wrap: pretty` to paragraphs.

## Spacing and layout

- Page measure: `max-w-[90rem]` with gutters of 20px, 32px, then 48px.
- Sections breathe: `py-24` on small screens and `py-32` from the `md` breakpoint.
- The grid is 12 columns from `lg`. Feature content often occupies 7 columns, with the remainder left as margin or a second column. That asymmetry is intentional.
- Corners are square. Borders are 1px at roughly 10–15% charcoal so the line is visible on ivory without becoming a box.
- Touch targets are at least 44px (`min-h-11` or `size-11`).

## Motion

- The hero reveal is a CSS stagger (`hero-rise`). A one-pixel scroll cue under the hero is CSS only. Both are disabled under `prefers-reduced-motion`.
- A global reduced-motion rule also shortens CSS transitions and animations.
- GSAP ScrollTrigger reveals the homepage philosophy, featured studies, and principles, the study index, and the about story. Marked lines can stagger. The hero plate drifts a short distance while it scrolls. Content is visible before JavaScript runs. If the user prefers reduced motion, these tweens are skipped and cleaned up on unmount.
- Route changes use a short fade (`page-enter`). It is removed under `prefers-reduced-motion`.
- The 3D camera does not move on its own. Choosing a view eases the camera and its target over 880ms. That move is immediate when reduced motion is requested, and Reset View is always immediate. Orbit damping is turned off when reduced motion is requested. Dragging the model cancels an in-progress move.
- Changing a finish or a piece of furniture does not move the camera. Light settings ease intensity and color over 720ms, and that ease is skipped when reduced motion is requested. Restoring a saved perspective uses the same rule.
- Furniture selection is a bronze floor outline plus the piece name in the panel. Movement on a narrow screen is a set of labeled buttons.
- Hover feedback is a color change, a hairline, or a very small image scale. No bouncing or looping decoration.

## Components

- `Button` — primary (charcoal), secondary (outline), inverse (ivory on charcoal). Renders a link when `href` is set.
- `SectionLabel` — index, rule, and name. `tone="dark"` switches the ink to sand.
- `StudyPlate` — original SVG spatial studies. These are drawings, not photographs.
- `ProjectCard` — one link for the whole study, with a plate, place, type, title, and excerpt.
- `SiteHeader` — fixed. Transparent at the top of the page and solid ivory with a hairline after a short scroll. The mobile menu is a disclosure with Escape to close.
- `SiteFooter` — wordmark plus working links to pages and studies.

Focus is always visible: a 2px bronze-deep outline with a 3px offset. Mouse clicks do not show that ring (`:focus-visible`).

## 3D materials

Surfaces are `MeshStandardMaterial` or `MeshPhysicalMaterial`. Color maps are drawn on canvas at runtime, kept between 512 and 1024 pixels, and marked sRGB. The oak roughness map stays in linear color space. The floor uses anisotropy up to 8. Materials and textures are created once for the scene and disposed when the canvas unmounts.

- Plaster walls, warm ivory, matte
- Oak floor and baseboards, low gloss
- Sand linen upholstery by default, with bouclé and velvet maps and five cloth colors
- Oak, walnut, or ash floor. The baseboard follows the floor. The window frame stays oak
- Warm ivory, sage, or soft clay plaster
- Travertine table with a light clearcoat and a softened edge
- Brushed bronze-toned metal
- Matte clay vessel and a wool rug

Lighting has three settings on the same sun: daylight, golden hour, and evening. Evening turns on one practical lamp that does not cast a shadow. Exposure stays at 0.92. One 1024² shadow map is used, with radius 3. Pixel ratio is capped at 1.5, and at 1.25 on narrow screens. There is no postprocessing and no environment map.

Finish choices, the storage key, and the light recipes are listed in `docs/3D_ARCHITECTURE.md`.

Camera presets and the scene graph are described in `docs/3D_ARCHITECTURE.md`.
