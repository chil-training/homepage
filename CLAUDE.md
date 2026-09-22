# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # next dev on http://localhost:3000
npm run build    # next build --webpack (the --webpack flag is required; Turbopack is not used), then a postbuild
                  # step (scripts/generate-seo-files.js) writes out/sitemap.xml and out/robots.txt
npm run start    # serve the static export in ./out (npx serve out) — there is no Next server to start
npm run lint     # eslint .
```

There is no test framework in this project.

## Architecture

Next.js 16 **pages router** + React 19 + Tailwind v4 (via `@tailwindcss/postcss`, no `tailwind.config`; `src/index.css` is `@import "tailwindcss"` plus CSS variables). Firebase (Auth + Firestore) is the only backend — there is no API layer and no server-side auth.

**This site is a static export** (`next.config.js` sets `output: "export"`, `trailingSlash: true`) deployed to GitHub Pages, which serves static files only. That rules out `getServerSideProps`, API routes, and `getStaticPaths` with `fallback: true`/`'blocking'` — see "Deployment" below.

### Two kinds of page

The split that matters is **public vs. authenticated**, and it decides how data is fetched.

**Authenticated pages** (`/`, `/admin`, `/theme`, `/guide`, `/event`) are three files deep:

1. `pages/**` — a thin shell: `<Head>` metadata, `<Navbar />`, and the route component. No data-fetching function at all — the page is prerendered once at build time with no props, and all real content loads client-side after hydration.
2. `src/routes/*.jsx` — the page component. Reads `AuthContext`, reads route params via `useRouter().query`, fetches from Firestore in a `useEffect`, renders the gate/loading/content branches.
3. `src/components/*.jsx`, `src/layouts/*.jsx` — presentational.

Route params are passed as a **query string**, not a path segment: `/theme?themeId=...`, `/guide?guideId=...`, `/event?eventId=...`. `Theme.jsx`, `Guide.jsx` and `Event.jsx` read `router.query.themeId`/`guideId`/`eventId` — that works identically whether the value came from a path segment or a query string, which is what makes these three routes indifferent to the switch. They are **not** file-based dynamic routes (no `[themeId].jsx`): a static export must resolve every dynamic-route path at build time via `getStaticPaths`, which isn't possible here since theme/guide/event IDs are created live through the admin panel behind an authenticated Firestore read. A single static `pages/theme.jsx` sidesteps that — one prerendered shell serves every ID, resolved client-side.

**Public pages** (`/events`, `/events/*`, `/challenges`, `/challenges/*`, and the signed-out homepage) instead fetch in `getStaticProps` (`getStaticPaths` + `getStaticProps` for the dynamic ones) and pass data down as props, because a crawler or link preview that sees only an empty shell defeats the point of the page. They carry per-page `<title>`, description, OG tags, canonical and JSON-LD. Because this data is resolved at build time, not per-request, **editing a challenge in the admin panel does not appear on the public site until the next push to `main` rebuilds and redeploys it.**

### Public events are static data, not Firestore

Unlike everything else, public CHIL events are **not** stored in Firestore. They are hardcoded in `src/data/events.js` (the `EVENTS` array) and imported directly by `pages/events/index.jsx`, `pages/events/[eventId].jsx`, `pages/index.jsx`, and `scripts/generate-seo-files.js`. Edit that file to add, move, or reword an event — there is no admin UI or database document behind it. See `FIREBASE_PUBLIC_EVENTS.md` for the field shape.

`src/utils/events.js` holds `selectAllPublishedEvents()`, which filters to `published`/`organiser: "CHIL"` events and tags each with an `isPast` boolean (based on `endAt`/`startAt` vs. now) so listing pages can grey out past events instead of hiding them. `UpcomingEvents` (the homepage carousel) filters `isPast` events out entirely; `/events` and the homepage's "All events" grid show everything, past events dimmed.

### Build-time Firestore reads

The Firebase JS SDK is browser-only here, so `src/utils/firestoreRest.js` reads Firestore over its REST API for `getStaticProps`/`getStaticPaths` (and for `scripts/generate-seo-files.js`, run as a plain Node script — see "Deployment"). It decodes Firestore's typed value wrappers and returns timestamps as ISO strings (props must be JSON-serialisable; `asDate()` in `src/utils/dates.js` accepts both those strings and real `Timestamp` objects). Because these run at `next build` time rather than per-request, their output is only as fresh as the last deploy.

This works **only for collections whose rules allow unauthenticated reads** — currently just `hackathonChallenges` (public events moved to static data, see above). It has no user credentials, so never route authenticated course content through it. Read failures return `null`/`[]` rather than throwing, so a missing rule degrades to a hidden section (or, for `getStaticPaths`, zero generated pages) rather than a broken build.

### Firebase is browser-only

`src/firebase_config.js` exports `auth` and `db` as `null` when `typeof window === "undefined"` so the page shell can render at build time. Any new module touching Firebase must tolerate `null` (`if (!db) return`, `auth?.signOut()`), or it will crash the static export. Build-time reads go through the REST helper above instead. It is a plain `.js` file (not `.jsx`, despite having no JSX in it) specifically so `scripts/generate-seo-files.js` — a plain Node ESM script that isn't run through webpack — can `import` it by its literal extension; Node's module resolution doesn't do the extensionless/`.jsx` resolution that bundlers do.

For the same reason, `src/utils/events.js` and `src/utils/firestoreRest.js` — both reachable from `scripts/generate-seo-files.js` — import their siblings with an explicit `.js` extension (`from "./dates.js"`, not `"./dates"`). Everything else in the codebase can stay extensionless since webpack resolves those; only files on that Node script's import graph need it.

### Auth and authorisation are entirely client-side

`src/context/AuthContext.jsx` (mounted in `pages/_app.jsx`) subscribes to `onAuthStateChanged` and, on sign-in, loads `users/{uid}` into `userMeta`. Everything downstream branches on these two values:

- `user` — Firebase auth user. Falsy → routes render a "please log in" message.
- `userMeta` — the Firestore user doc: `{ nickname, course_code, interests, organisation, first_time, admin }`. `null` while loading (render a loading state, never "access denied").
- `userMeta.admin` — the only thing gating `/admin`. `userMeta.course_code` — the only thing scoping a user to course content.

Because this is client-side only, Firestore security rules are the real access control. Never assume a check in a component is enforcement.

The registration flow is two-step: `RegisterBox` creates the auth user and writes `users/{uid}` with only `{ first_time: true }`; `FirstTimeSetup` (rendered by `TrainingApp` when `first_time` is true) collects the rest, merges it with `first_time: false, admin: false`, then calls `router.reload()`.

### Firestore data model

```
courses/{course_code}                      { title, description }
  themes/{theme_id}                        { title, description, index, audience? }
    guides/{guide_id}                      { title, index, videoId, markdown_content }
  events/{event_id}                        { title, description, audience, location, when, link, markdown_content? }
users/{uid}                                { nickname, course_code, interests, organisation, first_time, admin }
hackathonChallenges/{slug}                 public, world-readable — see FIREBASE_HACKATHON_CHALLENGES.md
```

Public CHIL events are **not** a Firestore collection — see "Public events are static data, not Firestore" above and `src/data/events.js`.

`themes.index` drives ordering; **index 0 is the "primary" theme** given hero treatment by `DAALayout`.

`hackathonChallenges` must allow unauthenticated reads or `/challenges` builds with zero challenge pages (see "Build-time Firestore reads" — a denied read degrades to an empty `getStaticPaths` list, not a build failure). Challenge colours are stored as an accent **name** (`rose`, `sky`, …) resolved through the static map in `src/data/challengeAccents.js` — never as class strings, because Tailwind only ships classes it finds written out in source, and a class name built from a database value would be missing from the CSS.

### Underscore-joined slugs

Nested Firestore paths are flattened into a single query-string value joined by `_` and split back with `.split("_")`:

- `/theme?themeId={course_code}_{theme_id}`
- `/guide?guideId={course_code}_{theme_id}_{guide_id}`
- `/event?eventId={course_code}_{event_id}`

**Document IDs must therefore never contain an underscore** — the split is positional and will silently mis-address the document.

Note the singular/plural distinction: **`/event` is the authenticated course event** (Firestore, underscore-joined `eventId` query param, noindexed), while **`/events/*` is the public CHIL hackathon series** (static data from `src/data/events.js`, plain `id` path segment, indexed). They are different data sources, different fetch strategies, and different URL shapes (query string vs. path segment).

### Logged-in vs. logged-out homepage

`src/routes/Dashboard.jsx` renders `HomeHero` (public CHIL marketing page: `UpcomingEvents` carousel plus `HackathonGrid`) when signed out, and `TrainingApp` (the user's course) when signed in. `pages/index.jsx` reads `src/data/events.js` (static) and `hackathonChallenges` (Firestore) in `getStaticProps` and threads them through `Dashboard` to `HomeHero`; the signed-in branch ignores them. `UpcomingEvents` takes that build-time list as `initialEvents` and renders it directly — no client refetch, and no refresh until the next deploy.

`src/components/Course.jsx` dispatches on the **exact course title string** `"Data Action Accelerator 2025/2026"` to select `DAALayout`; anything else gets a generic fallback layout. Renaming that course in Firestore silently changes the layout.

### Admin panel

`src/routes/Admin.jsx` is a single ~1000-line file holding its own mini UI kit (`Input`, `Select`, `Checkbox`, `Textarea`, `Btn`, `Modal`, `ConfirmModal`, `StatusBanner`) plus `CoursesTab` / `ThemesTab` / `GuidesTab` / `ChallengesTab`. Each tab is a self-contained CRUD form writing directly to Firestore with `setDoc(..., { merge: true })` and `deleteDoc`. Deletes are **not** recursive — deleting a course leaves its `themes`/`guides` subcollections orphaned.

`ChallengesTab` edits the public `hackathonChallenges` collection and, on an empty collection, offers a seed button that writes the ten defaults from `src/data/defaultChallenges.js`, skipping any that already exist.

## Deployment

The site is a Next.js **static export** (`output: "export"` in `next.config.js`), built and pushed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`. `npm run build` writes to `out/` (not `.next/` — that's the intermediate build cache, still gitignored) and `upload-pages-artifact` uploads `./out` directly.

Two GitHub-Pages-specific fixes live in `public/` (Next copies its contents into `out/` root verbatim):

- `public/CNAME` — `chil-training.co.uk`. Without it GitHub Pages serves the default `*.github.io` domain instead of the custom domain. This file was accidentally dropped in the Vite→Next migration and needs to exist for the custom domain to keep working.
- `public/.nojekyll` — GitHub Pages runs Jekyll by default, which silently deletes any `_next/` folder (Jekyll ignores underscore-prefixed paths) and breaks every JS/CSS asset. This file disables that.

`npm run build` also runs `scripts/generate-seo-files.js` as a `postbuild` step: static export has no server, so the old `pages/sitemap.xml.js`/`pages/robots.txt.js` (which wrote raw XML/text via `getServerSideProps`'s `res`) can't work any more — that script re-derives the same data and writes `out/sitemap.xml`/`out/robots.txt` as literal files after the export.

Because there's no server, `getServerSideProps`, API routes, and `getStaticPaths` with `fallback: true`/`'blocking'` are all unavailable — every page is either fully static (no data function), or uses `getStaticProps`/`getStaticPaths` with `fallback: false`, resolved once at build time. See "Two kinds of page" above.

`next.config.js` sets `trailingSlash: true` (emits `/page/index.html` instead of `/page.html`) because GitHub Pages has no rewrite rules to fall back from an extensionless URL to a matching `.html` file — every internal link and canonical URL should carry a trailing slash to match.

`npm run start`/`npm run preview` serve `./out` with `npx serve` — there is no `next start` to run against a static export.

## SEO conventions

The indexed surface is `/`, `/events`, `/events/*`, `/challenges` and `/challenges/*`. Every authenticated route — `/admin`, `/theme`, `/guide`, `/event`, `/auth/*` — sets `<meta name="robots" content="noindex,nofollow" />`. Keep new private routes noindexed.

`scripts/generate-seo-files.js` enumerates the static public paths, then adds a URL per event (from `src/data/events.js`) and per challenge (from Firestore `hackathonChallenges`), with `updatedAt` as `<lastmod>`, and writes `out/sitemap.xml`/`out/robots.txt` after `next build` (see "Deployment"). All canonical/OG/sitemap URLs carry a trailing slash to match `trailingSlash: true`.

`_app.jsx` supplies site-wide `<Head>` defaults. `next/head` dedupes `<meta name>` automatically but **not `<link>`**, so the site-wide canonical and every page-level canonical carry `key="canonical"` to make the page's value win. A new indexed page must use that same key, or it will emit two canonicals and search engines will ignore both.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
