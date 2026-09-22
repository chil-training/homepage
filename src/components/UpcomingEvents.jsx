import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate } from "../utils/dates";
import { accentForIndex } from "../data/challengeAccents";

export default function UpcomingEvents({ initialEvents }) {
  // Events are static (src/data/events.js), server-rendered via getServerSideProps,
  // and passed straight through — no client refetch needed.
  const events = useMemo(() => (initialEvents || []).filter((event) => !event.isPast), [initialEvents]);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeEvent = events[activeIndex] || events[0];
  const accent = accentForIndex(activeIndex);

  if (!activeEvent) {
    return <p className="text-slate-600">New CHIL events will be announced here shortly.</p>;
  }

  const previous = () => setActiveIndex((index) => (index - 1 + events.length) % events.length);
  const next = () => setActiveIndex((index) => (index + 1) % events.length);

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-xl transition-colors duration-500 md:p-10 ${accent.hero}`}>
      <div className={`absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl transition-colors duration-500 ${accent.heroGlow}`} />
      <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <article>
          <p className={`mb-3 text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${accent.heroLabel}`}>{activeEvent.eventType || "CHIL event"}</p>
          <h3 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            <Link href={`/events/${activeEvent.id}`} className="hover:underline">{activeEvent.title}</Link>
          </h3>
          {activeEvent.description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-200">{activeEvent.description}</p>}
          <dl className="mt-7 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
            <div><dt className="font-semibold text-white">When</dt><dd>{formatDate(activeEvent.startAt)}</dd></div>
            <div><dt className="font-semibold text-white">Where</dt><dd>{activeEvent.location || "Location to be confirmed"}</dd></div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/events/${activeEvent.id}`} className={`inline-flex rounded-lg px-5 py-3 font-bold transition-colors duration-500 ${accent.heroButton}`}>
              Event details
            </Link>
            {activeEvent.registrationUrl && (
              <a href={activeEvent.registrationUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-lg border border-white/30 px-5 py-3 font-bold text-white transition hover:bg-white/10">
                Register
              </a>
            )}
          </div>
        </article>
        {events.length > 1 && (
          <div className="flex items-center gap-3" aria-label="Event carousel controls">
            <button type="button" onClick={previous} className="rounded-full border border-white/30 px-4 py-2 font-bold hover:bg-white/10" aria-label="Previous event">←</button>
            <span className="text-sm text-slate-300">{activeIndex + 1} / {events.length}</span>
            <button type="button" onClick={next} className="rounded-full border border-white/30 px-4 py-2 font-bold hover:bg-white/10" aria-label="Next event">→</button>
          </div>
        )}
      </div>
    </div>
  );
}
