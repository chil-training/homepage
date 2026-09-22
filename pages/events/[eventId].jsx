import Head from "next/head";
import Navbar from "../../src/components/Navbar";
import PublicEvent from "../../src/routes/PublicEvent";
import { EVENTS } from "../../src/data/events";
import { isPastEvent, isPublishedEvent } from "../../src/utils/events";

const siteUrl = "https://chil-training.co.uk";

export default function PublicEventPage({ event }) {
  const canonical = `${siteUrl}/events/${event.id}/`;
  const description = event.description || `A CHIL event in Liverpool City Region: ${event.title}.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description,
    url: canonical,
    startDate: event.startAt,
    endDate: event.endAt || undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: event.location || "To be confirmed" },
    organizer: { "@type": "Organization", name: "Civic Health Innovation Labs", url: siteUrl },
    ...(event.registrationUrl && { offers: { "@type": "Offer", url: event.registrationUrl } }),
  };

  return (
    <>
      <Head>
        <title>{`${event.title} | CHIL Training`}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content={event.title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href={canonical} key="canonical" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>
      <Navbar />
      <PublicEvent event={event} />
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: EVENTS.filter(isPublishedEvent).map((event) => ({ params: { eventId: event.id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const event = EVENTS.find((candidate) => candidate.id === params.eventId) || null;

  // Unpublished and non-CHIL events must not be reachable by guessing the URL.
  if (!event || !isPublishedEvent(event)) return { notFound: true };

  return { props: { event: { ...event, isPast: isPastEvent(event) } } };
}
