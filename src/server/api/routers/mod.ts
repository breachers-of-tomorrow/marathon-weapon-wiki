import { z } from "zod";
import { unstable_cache } from "next/cache";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const CACHE_TTL = 3600;

export const modRouter = createTRPCRouter({
  getByWeaponId: publicProcedure
    .input(z.object({ weaponId: z.string() }))
    .query(async ({ ctx, input }) => {
      return unstable_cache(
        async () => {
          const [linkedMods, universalMods] = await Promise.all([
            ctx.db.weaponMod.findMany({
              where: { weaponId: input.weaponId },
              include: { mod: true },
              orderBy: { mod: { type: "asc" } },
            }),
            ctx.db.mod.findMany({
              where: { isUniversal: true },
              orderBy: { name: "asc" },
            }),
          ]);

          return {
            linkedMods: linkedMods.map((wm) => wm.mod),
            universalMods,
          };
        },
        [`mods-weapon-${input.weaponId}`],
        { revalidate: CACHE_TTL, tags: ["mods"] },
      )();
    }),
});
