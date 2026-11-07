# Deployment

SPACE does not have a public URL yet. This note prepares a GitHub repository and a separate Vercel project. It does not create either one.

No environment variables are required. None are read by the application.

## Local setup

- Node.js 22 LTS. The release check used Node.js 22.23.4 (npm 10.9.9). Next.js also accepts Node.js 20.9 or newer; `engines` stays `>=20.9.0`. The nvm default on this machine was left on Node.js 23.2.0.
- npm, using the committed `package-lock.json`.

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run dev` serves the site at `http://localhost:3000`. That address is only for local development.

## Release gates

| Gate | What it means | Status |
| --- | --- | --- |
| A | Local audit, checks, and launch docs | Prepared in the working tree. Not committed. |
| B | GitHub repository and push to `main` | Waiting for approval. |
| C | Vercel import and a verified live URL | Waiting for approval. Do this after Gate B. |
| D | Portfolio card, live links, and screenshots on [ghalaalshammari.sa](https://ghalaalshammari.sa) | Waiting for the production URL. That site is a different repository. |

Do not skip a gate.

## GitHub

Suggested repository name: `space-interior-studio`.

Suggested description: “An immersive 3D interior design studio built with Next.js, TypeScript, and React Three Fiber.”

Before the first push:

- Confirm `.gitignore` still excludes `node_modules`, `.next`, `.env*`, and `.vercel`.
- Confirm no `.env` file is staged. The app does not need one.
- Review `git status`. The current `main` commit is only the Create Next App starting point. The studio work is still uncommitted.
- Commit only after the diff is reviewed. Do not force-push.

Suggested visibility is public if the project is meant for a portfolio. That choice belongs to the owner.

## Vercel

Create a new Vercel project. Do not attach this app to the portfolio project.

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Root directory | Project root |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output | Default Next.js output |
| Environment variables | None |

`next.config.ts` already builds on Vercel. It enables cache components and partial prefetching, and it points CSS through the Tailwind Turbopack loader. No `vercel.json` is required. Do not turn on experimental package tags. Stay on the locked React 19.3 and React Three Fiber 9 pair. Set the Vercel Node.js version to 22.x.

The build warning about a `package-lock.json` outside the repository comes from a lockfile in the parent home directory during local Turbopack. It is not an application dependency. On Vercel the project root is this repository, so that parent file is not present.

## Dependency audit

Checked with `npm audit` and `npm audit --omit=dev` on Node.js 22.23.4.

Production dependencies: no advisories.

Dev dependencies that were updated in place:

- `tinypool` is pinned to 2.2.0. Vitest 3.2.7 asked for 1.1.1, which was inside the critical prototype-pollution advisories GHSA-5gmw-xhrv-c9v3 and GHSA-85c8-ppgw-ccpr. The patched release is 2.1.2 or newer. Tests still pass on 2.2.0.
- The `minimatch` copy used by `@typescript-eslint/typescript-estree` is pinned to 11.0.5. Version 10.2.6 was inside GHSA-g3hv-75wg-m249. npm’s suggested fix was to downgrade `eslint-config-next` to 15.5.29, which does not match Next.js 16.4.5, so that downgrade was not applied.

Still open, dev-only, and left on Vitest 3.2.7:

- GHSA-82fw-gwwq-j7x9, moderate. Path traversal and arbitrary file read through `@vitest/mocker` when the test runner loads a redirect mock. Fixed in `@vitest/mocker` 4.1.12 and later.
- GHSA-qxg6-89mg-rqv8, moderate. Code injection through unauthenticated manual mock registration in the Vitest dev server. Fixed in `@vitest/mocker` 4.1.12 and later.

npm only offers those two fixes by moving to Vitest 5.1.0. That is two major versions past the runner this suite uses, and installing Vitest 4.1.12 failed in npm 10.9.9 with an arborist peer-resolution crash. The advisories are not in the production bundle. They matter if an untrusted project is opened in Vitest. They do not affect visitors of the built site.

## Production smoke test

After the first deployment, open the live origin and check:

1. `/`, `/spaces`, each study, `/studio`, and `/about` return the pages.
2. `/robots.txt` allows `/`.
3. The studio canvas starts, or the WebGL fallback is shown on a browser without WebGL.
4. A finish change and a furniture move do not move the camera.
5. Save design survives a reload. Reset design does not delete that copy until Save is used again.
6. The browser console has no hydration error from the application. Attributes injected by a browser tool, such as `data-cursor-ref`, are not application bugs.

## Metadata, after the URL exists

Do not guess the host before then.

1. Set `metadataBase` in `app/layout.tsx` to the real origin, for example `new URL("https://the-real-host")`.
2. Add that same origin as `metadataBase` before adding Open Graph images, so those URLs are absolute.
3. Add `app/sitemap.ts` with absolute URLs for `/`, `/spaces`, the three study paths, `/studio`, and `/about`.
4. Point `robots` at that sitemap.
5. Rebuild and confirm the canonical tags use the real host.

Until that change, titles and descriptions are set and there is no canonical URL.

## Rollback

Vercel keeps previous deployments. Promote the last known good deployment from the Vercel dashboard. Do not force-push `main` to imitate a rollback.

If a bad commit is already on `main`, revert it with a new commit after review. Do not rewrite published history unless that is explicitly requested.

## What stays local

Saved designs and the camera bookmark are `localStorage` keys in the visitor’s browser. A new deployment does not migrate or delete them. There is no server copy to back up.
