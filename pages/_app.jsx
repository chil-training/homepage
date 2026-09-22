import "../src/index.css";
import Head from "next/head";
import { AuthProvider } from "../src/context/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>CHIL Training | Civic Health Innovation Labs</title>
        <meta name="description" content="Training, events, and health innovation challenges from Civic Health Innovation Labs in Liverpool City Region." />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="canonical" href="https://chil-training.co.uk" key="canonical" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
