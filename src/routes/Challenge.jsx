import Link from "next/link";
import Markdown from "react-markdown";
import { accentFor } from "../data/challengeAccents";
import CPDTrainingCard from "../components/CPDTrainingCard";

const Challenge = ({ challenge, position, related }) => {
  const accent = accentFor(challenge.accent);

  return (
    <>
      <header className={`bg-gradient-to-tr px-4 pb-16 pt-36 text-white ${accent.hero}`}>
        <div className="mx-auto max-w-5xl">
          <Link href="/challenges" className="text-sm font-semibold text-white/80 hover:underline">← All hackathon challenges</Link>
          {position && <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-white/80">Challenge {String(position).padStart(2, "0")}</p>}
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">{challenge.title}</h1>
          {challenge.summary && <p className="mt-6 max-w-3xl text-xl leading-relaxed text-white/90">{challenge.summary}</p>}
          {challenge.audience && (
            <p className="mt-8 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">{challenge.audience}</p>
          )}
        </div>
      </header>

      <main className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          {challenge.markdown_content ? (
            <article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg">
              <Markdown>{challenge.markdown_content}</Markdown>
            </article>
          ) : (
            <p className="text-lg text-slate-600">A full brief for this challenge is coming soon.</p>
          )}

          {related && related.length > 0 && (
            <section className="mt-16 border-t border-slate-200 pt-10">
              <h2 className="text-2xl font-bold text-slate-900">Other challenges</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => {
                  const itemAccent = accentFor(item.accent);
                  return (
                    <Link key={item.id} href={`/challenges/${item.id}`} className="group block">
                      <article className={`h-full rounded-2xl border p-5 transition group-hover:-translate-y-1 group-hover:shadow-lg ${itemAccent.card}`}>
                        <h3 className="font-bold text-slate-900">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.summary}</p>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <CPDTrainingCard />
        </div>
      </main>
    </>
  );
};

export default Challenge;
