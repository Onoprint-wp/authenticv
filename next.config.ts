import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // Turbopack is the default in Next.js 16
  // @react-pdf/renderer is loaded only on the client via dynamic import
  // so no special bundler config is needed
  serverExternalPackages: ["@prisma/client", "@prisma/client/edge"],
  turbopack: {},
};

export default nextConfig;
