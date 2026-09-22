import Link from "next/link";
import { formatDateRange, toIsoString } from "../utils/dates";

const Detail = ({ term, children }) => (
  <div className="border-t border-white/15 pt-4">
    <dt className="text-sm font-semibold uppercase tracking-wide text-cyan-300">{term}</dt>
    <dd className="mt-1 text-lg text-white">{children}</dd>
  </div>
);

const Card = ({ title, highlight, span, children }) => (
  <div
    className={`rounded-2xl border p-6 shadow-sm ${span === "full" ? "sm:col-span-2" : ""} ${
      highlight ? "border-cyan-200 bg-cyan-50" : "border-slate-200 bg-white"
    }`}
  >
    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    <div className="mt-3 leading-relaxed text-slate-700">{children}</div>
  </div>
);

const PublicEvent = ({ event }) => (
  <>
    <header className="bg-slate-950 px-4 pb-16 pt-36 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-semibold text-cyan-300 hover:underline">← All CHIL events</Link>
        {event.isPast && (
          <p className="mt-6 inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-slate-300">
            This event has taken place
          </p>
        )}
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">{event.eventType || "CHIL event"}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">{event.title}</h1>
        {event.description && <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-200">{event.description}</p>}
        {!event.isPast && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-300 ring-1 ring-inset ring-cyan-300/30">
            Open to all backgrounds — no experience required
          </p>
        )}

        <dl className="mt-10 grid gap-6 sm:grid-cols-2">
          <Detail term="When">
            <time dateTime={toIsoString(event.startAt) || undefined}>{formatDateRange(event.startAt, event.endAt)}</time>
          </Detail>
          <Detail term="Where">{event.location || "Location to be confirmed"}</Detail>
        </dl>

        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex rounded-lg bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-200"
          >
            Register for this event
          </a>
        )}
      </div>
    </header>

    {event.cards && event.cards.length > 0 && (
      <main className="bg-slate-50 px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          {event.cards.map((card) => (
            <Card key={card.title} title={card.title} highlight={card.highlight} span={card.span}>
              {card.body && <p>{card.body}</p>}
              {card.schedule && (
                <ul className="space-y-3">
                  {card.schedule.map((slot) => (
                    <li key={slot.time} className="flex gap-4">
                      <span className="w-16 shrink-0 font-semibold text-slate-900">{slot.time}</span>
                      <span>{slot.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </main>
    )}
  </>
);

export default PublicEvent;
