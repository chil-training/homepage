// Static export has no server, so pages/sitemap.xml.js and pages/robots.txt.js
// (which used to write raw XML/text via getServerSideProps's `res`) can't work
// any more — `next build` only ever produces HTML documents. This script
// re-runs the same data selection after the export and writes the literal
// files into `out/` instead.
//
// Run via the `postbuild` npm script, so `npm run build` always produces both.

import { writeFile } from "node:fs/promises";
import { EVENTS } from "../src/data/events.js";
import { selectAllPublishedEvents, selectPublishedChallenges } from "../src/utils/events.js";
import { fetchPublicCollection } from "../src/utils/firestoreRest.js";
import { toIsoString } from "../src/utils/dates.js";

const siteUrl = "https://chil-training.co.uk";
const outDir = "out";

// Authenticated routes (/theme, /guide, /event, /admin) are deliberately
// absent: they are noindexed and their content is behind a login.
const staticPaths = ["/", "/events/", "/challenges/", "/auth/login/", "/auth/register/"];

async function generateSitemap() {
  const hackathonChallenges = await fetchPublicCollection("hackathonChallenges");

  const entries = [
    ...staticPaths.map((path) => ({ path })),
    ...selectAllPublishedEvents(EVENTS).map((event) => ({
      path: `/events/${event.id}/`,
      lastmod: toIsoString(event.updatedAt),
    })),
    ...selectPublishedChallenges(hackathonChallenges).map((challenge) => ({
      path: `/challenges/${challenge.id}/`,
      lastmod: toIsoString(challenge.updatedAt),
    })),
  ];

  const body = entries
    .map(({ path, lastmod }) => `<url><loc>${siteUrl}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`)
    .join("");

  await writeFile(
    `${outDir}/sitemap.xml`,
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
  );
}

async function generateRobots() {
  await writeFile(`${outDir}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

await generateSitemap();
await generateRobots();
