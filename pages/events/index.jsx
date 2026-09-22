import Head from "next/head";
import Link from "next/link";
import Navbar from "../../src/components/Navbar";
import { EVENTS } from "../../src/data/events";
import { selectAllPublishedEvents } from "../../src/utils/events";
import { formatDateRange } from "../../src/utils/dates";

const siteUrl = "https://chil-training.co.uk";
const description = "Hackathons, workshops, and networking from Civic Health Innovation Labs in Liverpool City Region — including past events for reference.";

export default function EventsPage({ events }) {
  return (
    <>
      <Head>
        <title>Events | CHIL Training</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="Events | CHIL Training" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/events`} />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href={`${siteUrl}/events`} key="canonical" />
      </Head>
      <Navbar />
      <main className="bg-slate-50 px-4 pb-20 pt-36">
        <section className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">What&apos;s on</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950 md:text-6xl">Events at CHIL</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">{description}</p>

          {events.length === 0 ? (
            <p className="mt-10 text-slate-600">New CHIL events will be announced here shortly.</p>
          ) : (
            <ul className="mt-10 grid gap-4">
              {events.map((event) => (
                <li key={event.id}>
                  <Link
                    href={`/events/${event.id}`}
                    className={`group block rounded-2xl border p-6 transition ${
                      event.isPast
                        ? "border-slate-200 bg-slate-100 opacity-60 grayscale hover:opacity-80"
                        : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">{event.eventType || "CHIL event"}</p>
                      {event.isPast ? (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">Past event</span>
                      ) : (
                        <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-semibold text-cyan-700 ring-1 ring-inset ring-cyan-200">Open to all</span>
                      )}
                    </div>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900 group-hover:underline">{event.title}</h2>
                    {event.description && <p className="mt-2 text-slate-600">{event.description}</p>}
                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      <time dateTime={event.startAt || undefined}>{formatDateRange(event.startAt, event.endAt)}</time>
                      {" · "}
                      {event.location || "Location to be confirmed"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  return { props: { events: selectAllPublishedEvents(EVENTS) } };
}
