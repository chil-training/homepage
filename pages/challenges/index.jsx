import Head from "next/head";
import Navbar from "../../src/components/Navbar";
import HackathonGrid from "../../src/components/HackathonGrid";
import { fetchPublicCollection } from "../../src/utils/firestoreRest";
import { selectPublishedChallenges } from "../../src/utils/events";

const siteUrl = "https://chil-training.co.uk";
const description = "Health and life sciences hackathon challenges from Civic Health Innovation Labs, drawn from Liverpool City Region health priorities.";

export default function ChallengesPage({ challenges }) {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: challenges.map((challenge, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/challenges/${challenge.id}`,
      name: challenge.title,
    })),
  };

  return (
    <>
      <Head>
        <title>Hackathon Challenges | CHIL Training</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="Hackathon Challenges | CHIL Training" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/challenges`} />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href={`${siteUrl}/challenges`} key="canonical" />
        {challenges.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />}
      </Head>
      <Navbar />
      <main className="bg-slate-50 px-4 pb-20 pt-36">
        <section className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Hackathon challenges</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950 md:text-6xl">Pick a challenge to take on</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">{description} Open to undergraduates and the public; no prior health experience needed.</p>
          <div className="mt-10">
            {challenges.length > 0
              ? <HackathonGrid challenges={challenges} />
              : <p className="text-slate-600">Challenges will be published here shortly.</p>}
          </div>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  return { props: { challenges: selectPublishedChallenges(await fetchPublicCollection("hackathonChallenges")) } };
}
