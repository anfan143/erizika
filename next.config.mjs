/** @type {import("next").NextConfig} */
const nextConfig = {
  // @react-pdf/renderer sa nesmie bundliť do serverless funkcie (fontkit/yoga) — necháme ho ako externý balík
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
};
export default nextConfig;
