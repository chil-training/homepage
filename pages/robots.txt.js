export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/plain");
  res.write("User-agent: *\nAllow: /\nSitemap: https://chil-training.co.uk/sitemap.xml\n");
  res.end();
  return { props: {} };
}

export default function Robots() {
  return null;
}
