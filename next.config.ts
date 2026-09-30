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
      // Redirect /recruteurs & /recruteur → /recruiter
      {
        source: "/recruteurs",
        destination: "/recruiter",
        permanent: true,
      },
      {
        source: "/recruteur",
        destination: "/recruiter",
        permanent: true,
      },
      {
        source: "/recruteurs/:path*",
        destination: "/recruiter/:path*",
        permanent: true,
      },
      {
        source: "/recruteur/:path*",
        destination: "/recruiter/:path*",
        permanent: true,
      },
      // Campus, Student & Internship ad landing page aliases (Facebook Ads & SEO safety net)
      {
        source: "/programme-campus",
        destination: "/campus",
        permanent: true,
      },
      {
        source: "/campus-programme",
        destination: "/campus",
        permanent: true,
      },
      {
        source: "/programmecampus",
        destination: "/campus",
        permanent: true,
      },
      {
        source: "/offre-campus",
        destination: "/campus",
        permanent: true,
      },
      {
        source: "/offres-campus",
        destination: "/campus",
        permanent: true,
      },
      {
        source: "/cv-stage",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/cv-stages",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/cvstage",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/stage",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/stages",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/etudiant",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/etudiants",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/cvetudiant",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/campus-stage",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/cv/etudiant",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/cv/stage",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/cv/stages",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/cv/campus",
        destination: "/campus",
        permanent: true,
      },
      {
        source: "/promo-campus",
        destination: "/cv-etudiant",
        permanent: true,
      },
      {
        source: "/tarifs-campus",
        destination: "/cv-etudiant",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
