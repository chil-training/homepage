// Event dates arrive in two shapes: a Firestore Timestamp when the browser SDK
// read them, or an ISO string when getServerSideProps read them over REST.
// Everything downstream goes through asDate so neither caller has to care.

export function asDate(value) {
  if (!value) return null;
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
}

export function timeOf(value) {
  return asDate(value)?.valueOf() ?? 0;
}

export function formatDate(value) {
  const date = asDate(value);
  if (!date) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Collapses a start/end pair into one line, dropping the repeated date when an
// event begins and ends on the same day.
export function formatDateRange(startAt, endAt) {
  const start = asDate(startAt);
  const end = asDate(endAt);
  if (!start) return "Date to be confirmed";
  if (!end) return formatDate(start);

  const sameDay = start.toDateString() === end.toDateString();
  const endFormat = sameDay
    ? new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" })
    : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return `${formatDate(start)} – ${endFormat.format(end)}`;
}

// Machine-readable value for <time dateTime> and JSON-LD.
export function toIsoString(value) {
  return asDate(value)?.toISOString() ?? null;
}
