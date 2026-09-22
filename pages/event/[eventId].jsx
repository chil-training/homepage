import Navbar from "../../src/components/Navbar";
import Event from "../../src/routes/Event";
import Head from "next/head";

export default function EventPage() { return <><Head><meta name="robots" content="noindex,nofollow" /></Head><Navbar /><Event /></>; }

export async function getServerSideProps() {
  return { props: {} };
}
