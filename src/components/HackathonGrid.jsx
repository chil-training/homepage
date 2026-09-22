import Link from "next/link";
import { accentFor } from "../data/challengeAccents";

// Challenges come from Firestore. The homepage reads them in
// getServerSideProps and passes them down, so the links are in the server
// HTML and each challenge page is reachable by a crawler.
export default function HackathonGrid({ challenges }) {
  if (!challenges || challenges.length === 0) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {challenges.map((challenge, index) => {
        const accent = accentFor(challenge.accent);

        return (
          <Link key={challenge.id} href={`/challenges/${challenge.id}`} className="group block">
            <article className={`flex h-full min-h-64 flex-col rounded-2xl border p-6 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg ${accent.card}`}>
              <p className={`text-sm font-bold ${accent.label}`}>Challenge {String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 text-xl font-bold text-slate-900">{challenge.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{challenge.summary}</p>
              <p className="mt-auto pt-6 text-sm font-semibold text-slate-900 group-hover:underline">Read the brief →</p>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
