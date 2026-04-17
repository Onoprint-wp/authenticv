import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  // Turbopack is the default in Next.js 16
  // @react-pdf/renderer is loaded only on the client via dynamic import
  // so no special bundler config is needed
  turbopack: {},
};

export default nextConfig;
