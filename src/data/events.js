// The public CHIL hackathon series, hardcoded here instead of read from
// Firestore's `publicEvents` collection. This is now the single source of
// truth for /events, /events/[eventId], the homepage, and the sitemap — there
// is no admin UI or database document backing these any more, so edit this
// file directly to add, move, or reword an event.
//
// Every event must keep `published: true` and `organiser: "CHIL"`: those two
// fields are what `isPublishedEvent()` in `src/utils/events.js` checks, kept
// only because the shape used to come from Firestore and other code still
// filters on it.
//
// `cards` renders as a card grid on the event page (src/routes/PublicEvent.jsx)
// rather than a markdown article. Each card is either `{ title, body }` (a
// paragraph) or `{ title, schedule }` (a time-labelled list); `highlight` and
// `span: "full"` control its visual weight. buildCards() below keeps the
// "who should come" and "on the day" cards consistent across every event —
// these hackathons are deliberately open to anyone, not just specialists, so
// that message is baked into the shared template rather than left to each
// event to restate.

const REGISTER = (subject) =>
  `mailto:hds-training@liverpool.ac.uk?subject=${encodeURIComponent(subject)}%20Registration`;

// Every hackathon runs 3–7pm UK local time (see startAt/endAt below) — an
// evening slot chosen so people don't have to take a full day off to attend.
// Kept lean so building gets a full 3 of the 4 hours.
const DAY_SCHEDULE = [
  { time: "15:00", label: "Arrival and team formation" },
  { time: "15:15", label: "Problem briefings from our partners" },
  { time: "15:30", label: "Building and pitching begins" },
  { time: "18:30", label: "Demos, feedback, and networking to close" },
];

function buildCards({ problem, lookingFor, backgrounds }) {
  return [
    { title: "The problem", body: problem },
    { title: "What we're looking for", body: lookingFor },
    {
      title: "Who should come",
      highlight: true,
      span: "full",
      body: `Open to everyone, whatever your background or experience level — you don't need a health, data, or technical background to take part. We're deliberately bringing together a wide mix of people to pitch and build ideas together, including ${backgrounds}, and anyone else curious enough to get stuck in. No team, no idea, and no experience necessary — teams form on the day, so come solo or bring friends.`,
    },
    { title: "On the day", span: "full", schedule: DAY_SCHEDULE },
  ];
}

export const EVENTS = [
  {
    id: "healthier-starts-hackathon",
    title: "Healthier Starts Hackathon",
    description:
      "A CHIL hackathon at Liverpool Science Park designing tools that help families access early-years, maternity, nutrition, and vaccination support. Open to everyone — no experience needed.",
    eventType: "Hackathon",
    organiser: "CHIL",
    published: true,
    location: "Liverpool Science Park",
    startAt: "2026-10-14T14:00:00.000Z",
    endAt: "2026-10-14T18:00:00.000Z",
    registrationUrl: REGISTER("Healthier Starts Hackathon"),
    updatedAt: "2026-09-21T12:00:00.000Z",
    cards: buildCards({
      problem:
        "Families eligible for early-years, maternity, nutrition, and vaccination support often don't know it exists, or hit friction trying to access it — and the services themselves rarely have a joined-up view of who needs help.",
      lookingFor:
        "Tools that connect families to the early-years support they're entitled to, or that help services spot who's falling through the gaps.",
      backgrounds: "midwives and health visitors, parents and carers, designers, students, and developers",
    }),
  },
  {
    id: "cardiovascular-prevention-hackathon",
    title: "Cardiovascular Prevention Hackathon",
    description:
      "A CHIL hackathon at Liverpool Science Park building tools to catch cardiovascular risk earlier. Open to everyone — no experience needed.",
    eventType: "Hackathon",
    organiser: "CHIL",
    published: true,
    location: "Liverpool Science Park",
    startAt: "2026-11-14T15:00:00.000Z",
    endAt: "2026-11-14T19:00:00.000Z",
    registrationUrl: REGISTER("Cardiovascular Prevention Hackathon"),
    updatedAt: "2026-09-21T12:00:00.000Z",
    cards: buildCards({
      problem:
        "High blood pressure and cholesterol often go undetected until a cardiac event forces the issue, even though the risk factors are usually visible in routine data years earlier.",
      lookingFor:
        "Tools that surface cardiovascular risk earlier — from primary care records, community screening, or wearable data — and help people act on it.",
      backgrounds: "cardiologists and GPs, data scientists, patients and carers, students, and designers",
    }),
  },
  {
    id: "ageing-well-at-home-hackathon",
    title: "Ageing Well at Home Hackathon",
    description:
      "A CHIL hackathon at Liverpool Science Park building technology that helps older people live independently at home. Open to everyone — no experience needed.",
    eventType: "Hackathon",
    organiser: "CHIL",
    published: true,
    location: "Liverpool Science Park",
    startAt: "2027-02-14T15:00:00.000Z",
    endAt: "2027-02-14T19:00:00.000Z",
    registrationUrl: REGISTER("Ageing Well at Home Hackathon"),
    updatedAt: "2026-09-21T12:00:00.000Z",
    cards: buildCards({
      problem:
        "Falls, isolation, and missed early warning signs keep older residents out of their own homes for longer than necessary. Health and care data that could flag risk early is scattered across services that don't talk to each other.",
      lookingFor:
        "Prototypes that use sensor, wearable, or care-record data to support independence at home — fall detection, activity monitoring, medication adherence, or tools that connect older residents to carers and family.",
      backgrounds: "occupational therapists, carers and family members, technologists, designers, and older residents themselves",
    }),
  },
  {
    id: "prepared-communities-hackathon",
    title: "Prepared Communities Hackathon",
    description:
      "A CHIL hackathon at Liverpool Science Park building tools that help communities prepare for and respond to health emergencies. Open to everyone — no experience needed.",
    eventType: "Hackathon",
    organiser: "CHIL",
    published: true,
    location: "Liverpool Science Park",
    startAt: "2027-03-14T15:00:00.000Z",
    endAt: "2027-03-14T19:00:00.000Z",
    registrationUrl: REGISTER("Prepared Communities Hackathon"),
    updatedAt: "2026-09-21T12:00:00.000Z",
    cards: buildCards({
      problem:
        "When a health emergency hits — a heatwave, an outbreak, a flood — the communities most at risk are often the last to get support, because the data that shows who's vulnerable isn't in the hands of the people who respond first.",
      lookingFor:
        "Tools that help identify vulnerable communities ahead of an emergency, or that speed up how quickly support reaches them.",
      backgrounds: "emergency planners, community organisers, public health teams, students, and developers",
    }),
  },
  {
    id: "mental-health-early-intervention-hackathon",
    title: "Mental Health Early Intervention Hackathon",
    description:
      "A CHIL hackathon at Liverpool Science Park building tools to spot mental health need earlier. Open to everyone — no experience needed.",
    eventType: "Hackathon",
    organiser: "CHIL",
    published: true,
    location: "Liverpool Science Park",
    startAt: "2027-04-14T14:00:00.000Z",
    endAt: "2027-04-14T18:00:00.000Z",
    registrationUrl: REGISTER("Mental Health Early Intervention Hackathon"),
    updatedAt: "2026-09-21T12:00:00.000Z",
    cards: buildCards({
      problem:
        "By the time many people reach crisis services, earlier signs were often visible — in school data, primary care contacts, or self-reported wellbeing — but not connected or acted on.",
      lookingFor:
        "Tools that help identify mental health need earlier and route people to the right support before crisis point.",
      backgrounds: "mental health practitioners, school and university staff, people with lived experience, students, and developers",
    }),
  },
  {
    id: "healthy-places-hackathon",
    title: "Healthy Places Hackathon",
    description:
      "A CHIL hackathon at Liverpool Science Park mapping how the built environment shapes health. Open to everyone — no experience needed.",
    eventType: "Hackathon",
    organiser: "CHIL",
    published: true,
    location: "Liverpool Science Park",
    startAt: "2027-05-14T14:00:00.000Z",
    endAt: "2027-05-14T18:00:00.000Z",
    registrationUrl: REGISTER("Healthy Places Hackathon"),
    updatedAt: "2026-09-21T12:00:00.000Z",
    cards: buildCards({
      problem:
        "Where you live shapes your health — green space, walkability, food access, and housing quality all move the needle — but that data rarely reaches the planners and communities who could act on it.",
      lookingFor:
        "Tools that map the health impact of place: identifying cold spots for green space or healthy food access, or making the case for local interventions with data.",
      backgrounds: "urban planners, community groups, public health teams, students, and developers",
    }),
  },
  {
    id: "air-quality-action-hackathon",
    title: "Air Quality Action Hackathon",
    description:
      "A CHIL hackathon at Liverpool Science Park turning air quality data into tools that protect respiratory health. Open to everyone — no experience needed.",
    eventType: "Hackathon",
    organiser: "CHIL",
    published: true,
    location: "Liverpool Science Park",
    startAt: "2027-06-14T14:00:00.000Z",
    endAt: "2027-06-14T18:00:00.000Z",
    registrationUrl: REGISTER("Air Quality Action Hackathon"),
    updatedAt: "2026-09-21T12:00:00.000Z",
    cards: buildCards({
      problem:
        "Poor air quality drives asthma attacks and COPD flare-ups, but the people most at risk rarely see the data in time to act.",
      lookingFor:
        "Tools that turn air quality readings into timely, actionable alerts — for schools, clinicians, or individuals managing respiratory conditions.",
      backgrounds: "environmental scientists, respiratory clinicians, residents of affected areas, students, and developers",
    }),
  },
  {
    id: "cancer-screening-access-hackathon",
    title: "Cancer Screening Access Hackathon",
    description:
      "A CHIL hackathon at Liverpool Science Park addressing barriers to cancer screening uptake. Open to everyone — no experience needed.",
    eventType: "Hackathon",
    organiser: "CHIL",
    published: true,
    location: "Liverpool Science Park",
    startAt: "2027-07-14T14:00:00.000Z",
    endAt: "2027-07-14T18:00:00.000Z",
    registrationUrl: REGISTER("Cancer Screening Access Hackathon"),
    updatedAt: "2026-09-21T12:00:00.000Z",
    cards: buildCards({
      problem:
        "Screening saves lives, but uptake varies sharply by postcode, language, and access to transport — and the people least likely to attend are often the hardest to reach with reminders.",
      lookingFor:
        "Ideas that close the gap between invitation and attendance: smarter reminder systems, transport and access tools, or ways to surface where uptake is falling behind.",
      backgrounds: "public health analysts, screening service staff, community outreach workers, students, and developers",
    }),
  },
  {
    id: "one-health-amr-hackathon",
    title: "One Health AMR Hackathon",
    description:
      "A CHIL hackathon at Liverpool Science Park tackling antimicrobial resistance across human, animal, and environmental health. Open to everyone — no experience needed.",
    eventType: "Hackathon",
    organiser: "CHIL",
    published: true,
    location: "Liverpool Science Park",
    startAt: "2027-08-14T14:00:00.000Z",
    endAt: "2027-08-14T18:00:00.000Z",
    registrationUrl: REGISTER("One Health AMR Hackathon"),
    updatedAt: "2026-09-21T12:00:00.000Z",
    cards: buildCards({
      problem:
        "Antimicrobial resistance doesn't respect the boundaries between human medicine, veterinary practice, and the environment, but the data tracking it usually does — making it hard to see the full picture.",
      lookingFor:
        "Tools that bring human, animal, and environmental AMR data together, or that help clinicians and farmers make better-informed prescribing decisions.",
      backgrounds: "microbiologists, vets, environmental scientists, clinicians, students, and developers",
    }),
  },
];
