/** @type {import('next').NextConfig} */
const preview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // `npm run preview:build` makes a static copy (no server) for browsing locally.
  ...(preview ? { output: "export", trailingSlash: true, distDir: ".next-preview" } : {}),
};
export default nextConfig;
