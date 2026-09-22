import Head from "next/head";
import Navbar from "../../src/components/Navbar";
import Challenge from "../../src/routes/Challenge";
import { fetchPublicCollection } from "../../src/utils/firestoreRest";
import { selectPublishedChallenges } from "../../src/utils/events";

const siteUrl = "https://chil-training.co.uk";

export default function ChallengePage({ challenge, position, related }) {
  const canonical = `${siteUrl}/challenges/${challenge.id}`;
  const description = challenge.summary || `A CHIL health and life sciences hackathon challenge: ${challenge.title}.`;

  return (
    <>
      <Head>
        <title>{`${challenge.title} | CHIL Hackathon Challenge`}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content={`${challenge.title} | CHIL Hackathon Challenge`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href={canonical} key="canonical" />
      </Head>
      <Navbar />
      <Challenge challenge={challenge} position={position} related={related} />
    </>
  );
}

// The whole collection is read so the page knows its position in the numbered
// set and can offer the others; it is ten small documents.
export async function getServerSideProps({ params }) {
  const challenges = selectPublishedChallenges(await fetchPublicCollection("hackathonChallenges"));
  const index = challenges.findIndex((item) => item.id === params.challengeId);

  if (index === -1) return { notFound: true };

  return {
    props: {
      challenge: challenges[index],
      position: index + 1,
      related: challenges.filter((item) => item.id !== params.challengeId).slice(0, 3),
    },
  };
}
