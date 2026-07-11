# Stack Research

Status: implementation recommendation
Captured: 2026-07-10
Scope: static, no-backend web app for Cosmic Calendar

## Recommendation

Build the first implementation as a Vite + React + TypeScript static SPA deployed to Cloudflare Pages.

This is the smallest stack that cleanly supports the product decisions already locked in `.planning/DECISIONS.md`: date-only input, no auth, no backend, pre-authored content, Hebrew-date conversion in the browser, approximate moon phase from Hebrew day-of-month, and share-card export.

## Current Package Snapshot

Package versions are volatile. These registry values were captured during the research pass and should be refreshed during implementation setup.

| Package | Latest seen | License seen | Relevant note |
|---|---:|---|---|
| `vite` | 8.1.4 | MIT | Modern static build tool; current Vite 8 requires recent Node, so use Node 22.12+ to avoid engine mismatch. |
| `react` | 19.2.7 | MIT | Good fit for interactive card UI, date input state, and share/export controls. |
| `@vitejs/plugin-react` | refresh at install | MIT | Use the current matching Vite plugin rather than pinning from this brief. |
| `typescript` | refresh at install | Apache-2.0 | Use strict mode for date normalization and month-key mapping. |
| `@hebcal/core` | 6.6.0 | GPL-2.0 | Technically suitable, but license needs explicit approval before production distribution. |
| `html-to-image` | refresh at install | MIT | Practical share-card DOM-to-PNG option; direct SVG/canvas is a viable fallback. |
| `astro` | 7.0.7 | MIT | Strong content-first option, but unnecessary ceremony for this app-like prototype. |
| `@sveltejs/kit` | 2.69.2 | MIT | Strong interactive option, but adds Svelte-specific conventions and static-adapter decisions. |

Registry source URLs:

- Vite: https://registry.npmjs.org/vite/latest
- React: https://registry.npmjs.org/react/latest
- `@hebcal/core`: https://registry.npmjs.org/%40hebcal%2Fcore/latest
- Astro: https://registry.npmjs.org/astro/latest
- SvelteKit: https://registry.npmjs.org/%40sveltejs%2Fkit/latest

## Framework Choice

Recommended: Vite + React + TypeScript.

Why:

- The app is an interactive tool, not a content site. It needs a responsive date flow, calculated state, month-card rendering, and export/share behavior.
- There is no backend, routing complexity, authenticated data, CMS, or SSR requirement.
- Vite's static output is a plain `dist/` directory, which matches Cloudflare Pages and keeps deploy risk low.
- React remains the safest team-default choice for component composition, browser APIs, and likely future design iteration.

Alternatives:

- Astro is attractive if the project becomes mostly editorial pages with small interactive islands. For the first implementation, it would add island/hydration choices without enough benefit.
- SvelteKit would produce a lean app, but it requires Svelte-specific implementation patterns and static adapter configuration. Use only if the execution owner strongly prefers Svelte.
- Next.js/Remix-style full-stack frameworks are unnecessary and add deployment and server-component concerns the product explicitly does not need.

## Hosting and Deploy Guard

Recommended host: Cloudflare Pages.

Deploy shape:

- Build command: `npm run build`
- Build output directory: `dist`
- Preview deployments from branch commits are enough for client review.
- Because Pages publishes the build output directory, repo-private files such as `.planning/`, `.codex/`, `AGENTS.md`, and the PRD are not served when the project builds to `dist`.

Guardrail:

- Keep the existing `.assetsignore` anyway. It is the safety net if the project ever changes to a root-served static asset configuration.
- If deploying through Workers Static Assets, set `assets.directory = "./dist"` in Wrangler. Do not set `assets.directory = "."`.
- If a future Cloudflare Worker truly must serve repo-root assets, re-check `.assetsignore` before deploy and ensure it excludes `.planning/`, `.codex/`, `.agents/`, `AGENTS.md`, the PRD, and GSD files.

Primary docs:

- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Cloudflare Workers Static Assets: https://developers.cloudflare.com/workers/static-assets/
- Workers asset ignore behavior: https://developers.cloudflare.com/workers/static-assets/binding/#ignoring-assets
- Wrangler assets config: https://developers.cloudflare.com/workers/wrangler/configuration/#assets

## Hebrew Date and Month Logic

Use `@hebcal/core` for civil-date to Hebrew-date conversion if the GPL-2.0 license is approved.

Relevant API behavior from Hebcal docs:

- `HDate` represents Hebrew date only: year, month, and day; it does not include time or location.
- `new HDate(new Date(...))` converts a Gregorian `Date` to a Hebrew date.
- `getFullYear()`, `getMonth()`, `getMonthName()`, and `getDate()` supply the Hebrew year/month/day.
- Static helpers such as `monthsInYear()`, `daysInMonth()`, `daysInYear()`, `longCheshvan()`, and `shortKislev()` cover variable calendar lengths.
- `HebrewCalendar.calendar()` can generate holidays, Rosh Chodesh, molad-related events, and other Jewish-calendar data, but the locked app scope does not require that for the first version.

Implementation pattern:

```ts
const civilDate = new Date(year, monthIndex, day, 12);
const hebrewDate = new HDate(civilDate);
const hebrewDay = hebrewDate.getDate();
const hebrewMonthName = hebrewDate.getMonthName();
const contentMonthKey = normalizeHebrewMonth(hebrewMonthName);
```

Avoid `new Date("YYYY-MM-DD")`. JavaScript date-only strings are parsed as UTC in modern engines and can shift the civil day in local time zones. Split the input value and construct `new Date(year, monthIndex, day, 12)` instead.

Hebcal docs:

- HDate: https://hebcal.github.io/api/core/classes/HDate.html
- HebrewCalendar: https://hebcal.github.io/api/core/classes/HebrewCalendar.html
- Module index: https://hebcal.github.io/api/core/modules.html

## Moon Phase Approximation

The project decision says to infer moon phase from Hebrew day-of-month, not to calculate astronomical lunar phase.

Recommended mapping:

| Hebrew day | App phase |
|---:|---|
| 1-2 | new / first crescent |
| 3-7 | waxing crescent |
| 8-12 | waxing half-to-gibbous |
| 13-17 | full moon window |
| 18-23 | waning gibbous-to-half |
| 24-28 | waning crescent |
| 29-30 | dark moon / new moon threshold |

Use `daysInMonth()` to handle 29-day and 30-day Hebrew months gracefully. Label the result as a symbolic or Hebrew-calendar moon phase, not an astronomical phase.

## Share Image Export

Preferred first implementation:

- Render a fixed share card component at a known aspect ratio, e.g. 1080 x 1920 or 1080 x 1350.
- Use `html-to-image` to export the DOM node to a PNG blob.
- Wait for `document.fonts.ready` before capture.
- Keep all fonts and images same-origin or CORS-enabled to avoid canvas tainting.
- Use `navigator.canShare({ files })` before `navigator.share({ files })`.
- Fallback to a preview image plus download if Web Share with files is unavailable.

If the visual design remains simple, direct SVG-to-canvas or pure Canvas export may be more deterministic than DOM capture. Choose that if `html-to-image` struggles with fonts, filters, or background effects.

Relevant docs:

- Web Share API: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- `navigator.canShare`: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare
- Canvas tainting / CORS images: https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image
- `HTMLCanvasElement.toBlob()`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
- Font readiness: https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/ready
- `html-to-image`: https://github.com/bubkoo/html-to-image

## Open Risk: `@hebcal/core` GPL-2.0

`@hebcal/core` is the obvious technical choice but the package metadata reports GPL-2.0. Since this will run in a distributed client bundle, production use needs an explicit license decision before implementation ships.

Options:

- Accept GPL obligations if the client/project license allows it.
- Replace it with a permissively licensed Hebrew-date conversion library after legal review.
- Implement the needed Hebrew-date conversion internally from permissive/public-domain algorithms, which adds correctness risk.
- Keep `@hebcal/core` for prototype only and mark production replacement as a milestone checkpoint.

Recommendation: raise a licensing checkpoint before the implementation phase installs dependencies. Technically, the stack remains Vite + React + TypeScript either way.

## Starter Dependency Shape

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hebcal/core": "REVIEW_LICENSE_BEFORE_INSTALL",
    "html-to-image": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "latest",
    "typescript": "latest",
    "vite": "latest"
  }
}
```
