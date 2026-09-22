import { fetchPublicCollection } from "../src/utils/firestoreRest";
import { EVENTS } from "../src/data/events";
import { selectAllPublishedEvents, selectPublishedChallenges } from "../src/utils/events";
import { toIsoString } from "../src/utils/dates";

const siteUrl = "https://chil-training.co.uk";

// Authenticated routes (/theme, /guide, /event, /admin) are deliberately absent:
// they are noindexed and their content is behind a login.
const staticPaths = ["/", "/events", "/challenges", "/auth/login", "/auth/register"];

export async function getServerSideProps({ res }) {
  const hackathonChallenges = await fetchPublicCollection("hackathonChallenges");

  const entries = [
    ...staticPaths.map((path) => ({ path })),
    ...selectAllPublishedEvents(EVENTS).map((event) => ({
      path: `/events/${event.id}`,
      lastmod: toIsoString(event.updatedAt),
    })),
    ...selectPublishedChallenges(hackathonChallenges).map((challenge) => ({
      path: `/challenges/${challenge.id}`,
      lastmod: toIsoString(challenge.updatedAt),
    })),
  ];

  const body = entries
    .map(({ path, lastmod }) =>
      `<url><loc>${siteUrl}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`)
    .join("");

  res.setHeader("Content-Type", "application/xml");
  res.write(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`);
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
