# Common Era — Vibe Coding Sprint
**July 10–11, 2026 · Los Angeles**

This repo is the shared codebase for five prototypes built during the Common Era vibe coding sprint.

## How to use this repo

Each project lives in its own folder within the repo. Make a folder and push your work to your folder only — don't touch anyone else's directory.

bmitzvah-coach/
cosmic-calendar/
digital-shabbat/

etc

**Recommended workflow:** create your own branch, commit your work there, and open a PR into `main` at the end — avoids clobbering others' work on a shared branch.

When you're done, your folder should contain your full project code plus a `README.md` with a brief description of what you built, what works, what's rough, what tools/models you used, and what you'd do next if you had additional time.

## Deliverables checklist

See here: https://docs.google.com/document/d/1-FM5nA3n9IBApQ28xMknZo6epechSapeRrOtGJuTF28/edit?tab=t.0

Questions? Reach out to Kris — kbudelis@gmail.com

---

## Deployment (GitHub Pages)

One Pages site serves the whole repo: a neutral **gallery** at `/commonera/`
links to every project at `/commonera/<folder>/`. On each push to `main`, the
`deploy-pages` workflow rebuilds **all** projects into one site — teams never
overwrite each other, and a project that fails to build is skipped (it shows
as an "in progress" stub card), never blocking the rest.

To make your project appear:
- **Static site**: just have an `index.html` in your folder — it's copied as-is.
- **Built site** (Vite/webpack/etc.): have a `build` script in `package.json`.
  The workflow runs it with `BASE_PATH=/commonera/<your-folder>/` — point your
  bundler's base/publicPath at that env var (Vite: `base: process.env.BASE_PATH ?? '/'`).
  Output is auto-detected from `dist/`, `build/`, `out/`, or `_site/`.
- **Gallery card** (optional): add `project.json` with `{ "name", "emoji", "description" }`.

One-time setup (repo admin): Settings → Pages → Source: **GitHub Actions**.
