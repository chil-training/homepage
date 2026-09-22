// The rule for what appears on the public site, kept in one place because both
// the browser (UpcomingEvents) and the server (homepage, sitemap, detail pages)
// have to agree on it. Documented for editors in FIREBASE_PUBLIC_EVENTS.md.

import { asDate, timeOf } from "./dates";

export function isPublishedEvent(event) {
  return event?.published === true && event?.organiser === "CHIL";
}

export function isUpcomingEvent(event, now = new Date()) {
  const end = asDate(event?.endAt || event?.startAt);
  return Boolean(end && end >= now);
}

export function isPastEvent(event, now = new Date()) {
  return !isUpcomingEvent(event, now);
}

// Keeps past events in the list (tagged with isPast) so listing pages can
// grey them out instead of hiding them.
export function selectAllPublishedEvents(events, now = new Date()) {
  return (events || [])
    .filter(isPublishedEvent)
    .sort((a, b) => timeOf(a.startAt) - timeOf(b.startAt))
    .map((event) => ({ ...event, isPast: isPastEvent(event, now) }));
}

export function selectPublishedChallenges(challenges) {
  return (challenges || [])
    .filter((challenge) => challenge?.published === true)
    .sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
}
