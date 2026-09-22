import Navbar from "../../src/components/Navbar";
import Theme from "../../src/routes/Theme";
import Head from "next/head";

export default function ThemePage() { return <><Head><meta name="robots" content="noindex,nofollow" /></Head><Navbar /><Theme /></>; }

export async function getServerSideProps() {
  return { props: {} };
}
