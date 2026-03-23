import { unstable_cache } from "next/cache";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

const CACHE_TTL = 3600; // 1 hour

/**
 * Fetches a lightweight index of ALL weapons + mods in a single cached call.
 * The client does fuzzy filtering locally — no per-keystroke DB queries.
 */
const getCachedSearchIndex = () =>
  unstable_cache(
    async () => {
      const [weapons, mods] = await Promise.all([
        db.weapon.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            slot: true,
            rarity: true,
            imageUrl: true,
          },
          orderBy: { name: "asc" },
        }),
        db.mod.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            rarity: true,
            isUniversal: true,
          },
          orderBy: { name: "asc" },
        }),
      ]);

      return { weapons, mods };
    },
    ["search-index"],
    { revalidate: CACHE_TTL, tags: ["weapons", "mods"] },
  )();

export const searchRouter = createTRPCRouter({
  getIndex: publicProcedure.query(async () => {
    return getCachedSearchIndex();
  }),
});
