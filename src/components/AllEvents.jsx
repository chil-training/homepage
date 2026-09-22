import Link from "next/link";
import { formatDateRange } from "../utils/dates";
import { accentForIndex } from "../data/challengeAccents";

// The homepage carousel shows one event at a time; this lists every event
// (including past ones, greyed out) so nothing is only reachable by clicking
// through the carousel.
export default function AllEvents({ events }) {
  if (!events || events.length === 0) return null;

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => {
        const accent = accentForIndex(index);

        return (
          <li key={event.id}>
            <Link
              href={`/events/${event.id}`}
              className={`group block h-full rounded-2xl border p-6 shadow-sm transition ${
                event.isPast ? "opacity-60 grayscale hover:opacity-80 border-slate-200 bg-slate-100" : `hover:-translate-y-1 hover:shadow-lg ${accent.card}`
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className={`text-sm font-bold uppercase tracking-[0.2em] ${accent.label}`}>{event.eventType || "CHIL event"}</p>
                {event.isPast ? (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">Past event</span>
                ) : (
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-900/10">Open to all</span>
                )}
              </div>
              <h3 className="mt-2 text-xl font-bold text-slate-900 group-hover:underline">{event.title}</h3>
              {event.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{event.description}</p>}
              <p className="mt-4 text-sm font-semibold text-slate-700">
                <time dateTime={event.startAt || undefined}>{formatDateRange(event.startAt, event.endAt)}</time>
                {" · "}
                {event.location || "Location to be confirmed"}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
