# Portfolio integration

SPACE and the personal site at [https://ghalaalshammari.sa](https://ghalaalshammari.sa) are separate repositories and separate Vercel projects. This file prepares the card and the case study. It does not edit the portfolio repository.

Add the project only after Gate C, when the production URL is known. Until then, leave the live link as a placeholder.

## Suggested project card

**Title:** SPACE — Interactive Interior Studio

**Subtitle:** An immersive 3D interior design experience.

**Category:** Creative Frontend Development, 3D Web Experience, UI/UX Design

**Summary:** A self-initiated conceptual studio. Three drawn studies, and a browser room where cloth, light, and furniture can be edited and saved on the device.

**Technologies:** Next.js, TypeScript, Tailwind CSS, Three.js, React Three Fiber, GSAP

## Links

| Slot | Value until launch | Value after Gate C |
| --- | --- | --- |
| Live demo | Placeholder. Do not invent a host. | The verified Vercel URL |
| Source | Placeholder | `https://github.com/<owner>/space-interior-studio` |

Suggested button labels: “View the studio” for the live site, and “View the source” for GitHub. Do not label it as a client project.

## Case study structure

Use `docs/PORTFOLIO_CASE_STUDY.md` as the source. Keep this order:

1. Project overview
2. Problem and opportunity
3. Design philosophy
4. Role
5. Technical architecture
6. Key interactive features
7. Technical challenges
8. Implementation decisions
9. Accessibility
10. Performance optimizations
11. Outcomes
12. Future improvements

State that the work is personal and self-initiated. Do not add clients, user research, awards, traffic, or measured Lighthouse scores. None of those exist for this project.

## Screenshots

Capture the running application. Do not draw stand-ins.

| Frame | What to show | Suggested size |
| --- | --- | --- |
| Homepage hero | Title, study plate, and both calls to action | 1440 × 900 |
| Studies | The three conceptual cards, or one study with its disclaimer | 1440 × 900 |
| Studio overview | The room in daylight, with the panel not covering the model | 1440 × 900 |
| Materials | A changed cloth or floor, camera still in place | 1440 × 900 |
| Evening | The corner lamp on and the daylight dimmed | 1440 × 900 |
| Furniture | A selected piece, the bronze floor frame, and the name in the panel | 1440 × 900 |
| Mobile studio | The room visible, Configure room collapsed or the directional controls open | 390 × 844 |

Crop out browser-tool overlays and any local account chrome. The captures in `docs/launch-screenshots/`, if present, are reference frames from local QA. Replace them with clean exports before publishing the card.

## Steps on the portfolio site, later

1. Confirm the SPACE production URL loads `/` and `/studio`.
2. Add a project entry with the card text above.
3. Attach the seven frames, with alt text that says they are conceptual studies and a browser model.
4. Link the live demo and the GitHub repository.
5. Paste or adapt the case study. Keep the disclaimer that the rooms are not commissioned work.
