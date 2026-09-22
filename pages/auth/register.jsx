import Register from "../../src/routes/Register";
import Head from "next/head";

export default function RegisterPage() { return <><Head><meta name="robots" content="noindex,nofollow" /></Head><Register /></>; }

export async function getServerSideProps() {
  return { props: {} };
}
