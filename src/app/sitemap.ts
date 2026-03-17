import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const getWeaponSlugs = unstable_cache(
  () =>
    db.weapon.findMany({
      select: { slug: true, updatedAt: true },
    }),
  ["weapons"],
  { revalidate: 3600, tags: ["weapons"] },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const weapons = await getWeaponSlugs();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...weapons.map((w) => ({
      url: `${siteUrl}/weapons/${w.slug}`,
      lastModified: w.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
