# Public CHIL events: static data

Public events are **not** stored in Firestore any more. They're hardcoded in
`src/data/events.js`, exported as the `EVENTS` array. Edit that file directly
to add, move, or reword an event — there is no admin UI or database record
behind it.

The homepage carousel shows only events that are `published: true`,
`organiser: "CHIL"`, and not yet past (`endAt`/`startAt` in the future).
`/events` and the homepage's "All events" grid show every published event,
past ones included, but with a grey "Past event" treatment (`isPast`, added
by `selectAllPublishedEvents()` in `src/utils/events.js`).

Every published event also gets its own page at
`https://chil-training.co.uk/events/<id>`, using the event object's `id` as
the URL segment — so `id` should read well in a URL and must stay unique. An
event with `published: false`, or an `organiser` other than `CHIL`, 404s.

## Fields for every event object

| Field | Type | Required | Value |
| --- | --- | --- | --- |
| `id` | string | Yes | URL slug, e.g. `"healthy-places-hackathon"` — no underscores, must be unique |
| `title` | string | Yes | Public event title |
| `description` | string | No | Plain-language event summary |
| `organiser` | string | Yes | `"CHIL"` exactly |
| `eventType` | string | No | For example: `"Workshop"`, `"Talk"`, `"Hackathon"`, or `"Networking"` |
| `published` | boolean | Yes | `true` to show the event; `false` to hide it without deleting |
| `startAt` | ISO string | Yes | Event start, e.g. `"2027-05-14T08:30:00.000Z"` — always UTC |
| `endAt` | ISO string | Recommended | Event end; this is what decides whether the event is "past" |
| `location` | string | No | Venue or `"Online"`; omitted values show "Location to be confirmed" |
| `registrationUrl` | string | No | Full registration URL, or a `mailto:` link |
| `updatedAt` | ISO string | Recommended | Last-reviewed date; used as `<lastmod>` in the sitemap |
| `cards` | array | No | Card-grid detail content shown below the header — see below |

## `cards`: the detail-page card grid

The event page (`src/routes/PublicEvent.jsx`) renders `cards` as a grid, not a
markdown article. Each entry is one of two shapes:

- `{ title, body }` — a text card. A paragraph.
- `{ title, schedule }` — a schedule card. `schedule` is an array of
  `{ time, label }`, rendered as a time-labelled list.

Either shape can add `highlight: true` (tints the card, for the message that
most needs to stand out) and `span: "full"` (makes the card take the full
grid width instead of sharing a row).

`buildCards({ problem, lookingFor, backgrounds })` in `src/data/events.js`
builds the standard four cards for a hackathon — "The problem", "What we're
looking for", a highlighted "Who should come" card, and a shared "On the day"
schedule — from just those three inputs, so most new events only need to
supply `problem`, `lookingFor`, and `backgrounds` (a short, non-exhaustive
list of example backgrounds — the "who should come" wording is deliberately
inclusive: these events are open to everyone regardless of background or
experience, and `backgrounds` is inspiration, not a gate).

## Copyable event template

```js
{
  id: "<url-slug>",
  title: "<public event title>",
  description: "<short public description>",
  eventType: "<Workshop | Talk | Hackathon | Networking>",
  organiser: "CHIL",
  published: true,
  location: "<venue or Online>",
  startAt: "<YYYY-MM-DDTHH:mm:ss.000Z>",
  endAt: "<YYYY-MM-DDTHH:mm:ss.000Z>",
  registrationUrl: "<https://... or mailto:...>",
  updatedAt: "<YYYY-MM-DDTHH:mm:ss.000Z>",
  cards: buildCards({
    problem: "<what's broken, and for whom>",
    lookingFor: "<the kind of idea or prototype you want to see>",
    backgrounds: "<a few example backgrounds, e.g. 'nurses, designers, and students'>",
  }),
}
```

`startAt`/`endAt` are always given in UTC. To get UK local time right, work
out whether the date falls in BST (roughly late March–late October, UTC+1)
or GMT (UTC+0) and offset accordingly — e.g. 09:30 local time on a June date
(BST) is `08:30:00.000Z`, while 09:30 local time on a December date (GMT) is
`09:30:00.000Z`.
