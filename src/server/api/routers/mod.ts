import { z } from "zod";
import { unstable_cache } from "next/cache";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

const CACHE_TTL = 3600;

const getCachedModsByWeaponId = (weaponId: string) =>
  unstable_cache(
    async () => {
      const [linkedMods, universalMods] = await Promise.all([
        db.weaponMod.findMany({
          where: { weaponId },
          include: { mod: true },
          orderBy: { mod: { type: "asc" } },
        }),
        db.mod.findMany({
          where: { isUniversal: true },
          orderBy: { name: "asc" },
        }),
      ]);

      return {
        linkedMods: linkedMods.map((wm) => wm.mod),
        universalMods,
      };
    },
    [`mods-weapon-${weaponId}`],
    { revalidate: CACHE_TTL, tags: ["mods"] },
  )();

export const modRouter = createTRPCRouter({
  getByWeaponId: publicProcedure
    .input(z.object({ weaponId: z.string() }))
    .query(async ({ input }) => {
      return getCachedModsByWeaponId(input.weaponId);
    }),
});
