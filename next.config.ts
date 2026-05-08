import type { NextConfig } from "next";

const PROD_DOMAIN = "www.authenticv.app";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/client/edge", "@react-pdf/renderer"],
  turbopack: {},

  async redirects() {
    return [
      // Redirect *.vercel.app previews → production (301 permanent)
      {
        source: "/:path*",
        has: [{ type: "host", value: "authenticv(?:-[a-z0-9]+)*\\.vercel\\.app" }],
        destination: `https://${PROD_DOMAIN}/:path*`,
        permanent: true,
      },
      // Redirect apex authenticv.app → www.authenticv.app
      {
        source: "/:path*",
        has: [{ type: "host", value: "authenticv\\.app" }],
        destination: `https://${PROD_DOMAIN}/:path*`,
        permanent: true,
      },
      // Redirect /pricing → /tarifs (canonical FR URL)
      {
        source: "/pricing",
        destination: "/tarifs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
