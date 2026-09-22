// Tailwind builds its stylesheet by scanning source files for literal class
// names. Challenge and event colours live in Firestore (or are picked by
// index) as a short accent key ("rose"), never as class strings — a class
// name assembled from a database value would not be found by the scanner and
// would be missing from the production CSS.
// Every class below must therefore stay written out in full.

export const CHALLENGE_ACCENTS = {
  rose: { card: "border-rose-200 bg-rose-50 hover:border-rose-400", label: "text-rose-800", hero: "from-rose-700 to-rose-950", chip: "bg-rose-100 text-rose-800", heroLabel: "text-rose-300", heroGlow: "bg-rose-400/20", heroButton: "bg-rose-300 text-rose-950 hover:bg-rose-200" },
  violet: { card: "border-violet-200 bg-violet-50 hover:border-violet-400", label: "text-violet-800", hero: "from-violet-700 to-violet-950", chip: "bg-violet-100 text-violet-800", heroLabel: "text-violet-300", heroGlow: "bg-violet-400/20", heroButton: "bg-violet-300 text-violet-950 hover:bg-violet-200" },
  red: { card: "border-red-200 bg-red-50 hover:border-red-400", label: "text-red-800", hero: "from-red-700 to-red-950", chip: "bg-red-100 text-red-800", heroLabel: "text-red-300", heroGlow: "bg-red-400/20", heroButton: "bg-red-300 text-red-950 hover:bg-red-200" },
  lime: { card: "border-lime-200 bg-lime-50 hover:border-lime-400", label: "text-lime-800", hero: "from-lime-700 to-lime-950", chip: "bg-lime-100 text-lime-800", heroLabel: "text-lime-300", heroGlow: "bg-lime-400/20", heroButton: "bg-lime-300 text-lime-950 hover:bg-lime-200" },
  sky: { card: "border-sky-200 bg-sky-50 hover:border-sky-400", label: "text-sky-800", hero: "from-sky-700 to-sky-950", chip: "bg-sky-100 text-sky-800", heroLabel: "text-sky-300", heroGlow: "bg-sky-400/20", heroButton: "bg-sky-300 text-sky-950 hover:bg-sky-200" },
  fuchsia: { card: "border-fuchsia-200 bg-fuchsia-50 hover:border-fuchsia-400", label: "text-fuchsia-800", hero: "from-fuchsia-700 to-fuchsia-950", chip: "bg-fuchsia-100 text-fuchsia-800", heroLabel: "text-fuchsia-300", heroGlow: "bg-fuchsia-400/20", heroButton: "bg-fuchsia-300 text-fuchsia-950 hover:bg-fuchsia-200" },
  amber: { card: "border-amber-200 bg-amber-50 hover:border-amber-400", label: "text-amber-800", hero: "from-amber-700 to-amber-950", chip: "bg-amber-100 text-amber-800", heroLabel: "text-amber-300", heroGlow: "bg-amber-400/20", heroButton: "bg-amber-300 text-amber-950 hover:bg-amber-200" },
  teal: { card: "border-teal-200 bg-teal-50 hover:border-teal-400", label: "text-teal-800", hero: "from-teal-700 to-teal-950", chip: "bg-teal-100 text-teal-800", heroLabel: "text-teal-300", heroGlow: "bg-teal-400/20", heroButton: "bg-teal-300 text-teal-950 hover:bg-teal-200" },
  indigo: { card: "border-indigo-200 bg-indigo-50 hover:border-indigo-400", label: "text-indigo-800", hero: "from-indigo-700 to-indigo-950", chip: "bg-indigo-100 text-indigo-800", heroLabel: "text-indigo-300", heroGlow: "bg-indigo-400/20", heroButton: "bg-indigo-300 text-indigo-950 hover:bg-indigo-200" },
  orange: { card: "border-orange-200 bg-orange-50 hover:border-orange-400", label: "text-orange-800", hero: "from-orange-700 to-orange-950", chip: "bg-orange-100 text-orange-800", heroLabel: "text-orange-300", heroGlow: "bg-orange-400/20", heroButton: "bg-orange-300 text-orange-950 hover:bg-orange-200" },
  slate: { card: "border-slate-200 bg-slate-50 hover:border-slate-400", label: "text-slate-800", hero: "from-slate-700 to-slate-950", chip: "bg-slate-100 text-slate-800", heroLabel: "text-slate-300", heroGlow: "bg-slate-400/20", heroButton: "bg-slate-300 text-slate-950 hover:bg-slate-200" },
};

export const ACCENT_KEYS = Object.keys(CHALLENGE_ACCENTS);

export function accentFor(key) {
  return CHALLENGE_ACCENTS[key] || CHALLENGE_ACCENTS.slate;
}

// Deterministic colour per position, for lists (events, challenges without an
// explicit accent) where each item should read as visually distinct.
export function accentForIndex(index) {
  return accentFor(ACCENT_KEYS[index % ACCENT_KEYS.length]);
}
