import type { MetadataRoute } from "next";
import { createAdminClient } from "@/utils/supabase/admin";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.authenticv.app";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques publiques
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                       lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/tarifs`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/login`,            lastModified: new Date(), changeFrequency: "yearly",  priority: 0.4 },
    { url: `${SITE_URL}/cgu`,              lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/confidentialite`,  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
  ];

  // CVs publics indexables
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("resumes")
      .select("share_slug, updated_at")
      .eq("is_public", true)
      .not("share_slug", "is", null)
      .order("updated_at", { ascending: false })
      .limit(5000);

    const cvRoutes: MetadataRoute.Sitemap = (data ?? []).map((r) => ({
      url: `${SITE_URL}/cv/${r.share_slug}`,
      lastModified: new Date(r.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...cvRoutes];
  } catch {
    return staticRoutes;
  }
}
