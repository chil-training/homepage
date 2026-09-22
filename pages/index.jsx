import Navbar from "../src/components/Navbar";
import Dashboard from "../src/routes/Dashboard";
import Head from "next/head";
import { fetchPublicCollection } from "../src/utils/firestoreRest";
import { EVENTS } from "../src/data/events";
import { selectAllPublishedEvents, selectPublishedChallenges } from "../src/utils/events";

export default function HomePage({ events, challenges }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Civic Health Innovation Labs",
    alternateName: "CHIL",
    url: "https://chil-training.co.uk",
    areaServed: "Liverpool City Region",
    description: "Training, events, and collaborative health innovation challenges for Liverpool City Region.",
  };

  // A crawler that only sees the carousel would index one event, so every
  // upcoming event is also listed here as a linked item. Past events are
  // excluded from structured data even though they're still shown, greyed
  // out, in the "All events" grid below.
  const upcomingEvents = events.filter((event) => !event.isPast);
  const eventList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: upcomingEvents.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://chil-training.co.uk/events/${event.id}/`,
      name: event.title,
    })),
  };

  return <>
    <Head>
      <title>CHIL Training | Health Data Events and Hackathons in Liverpool</title>
      <meta name="description" content="Discover CHIL health data events and undergraduate-friendly health and life sciences hackathon challenges in Liverpool City Region." />
      <meta name="keywords" content="Liverpool health data, CHIL, health innovation, life sciences hackathon, health AI training" />
      <meta property="og:title" content="CHIL Training | Health Data Events and Hackathons in Liverpool" />
      <meta property="og:description" content="Training, upcoming events, and health innovation challenges from Civic Health Innovation Labs." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://chil-training.co.uk" />
      <meta name="twitter:card" content="summary" />
      <link rel="canonical" href="https://chil-training.co.uk" key="canonical" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {upcomingEvents.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventList) }} />}
    </Head>
    <Navbar />
    <Dashboard events={events} challenges={challenges} />
  </>;
}

// Static export bakes the challenges list in at build time: a challenge
// added, edited, or removed in the admin panel won't show up on the
// signed-out homepage until the next deploy rebuilds the site.
export async function getStaticProps() {
  const hackathonChallenges = await fetchPublicCollection("hackathonChallenges");

  return {
    props: {
      events: selectAllPublishedEvents(EVENTS),
      challenges: selectPublishedChallenges(hackathonChallenges),
    },
  };
}
