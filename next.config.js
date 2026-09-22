/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  // GitHub Pages has no rewrite rules, so pretty URLs need `/page/index.html`
  // on disk rather than `/page.html`.
  trailingSlash: true,
};

export default nextConfig;
