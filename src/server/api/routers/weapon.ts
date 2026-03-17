import { z } from "zod";
import { unstable_cache } from "next/cache";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const CACHE_TTL = 3600; // 1 hour

export const weaponRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          type: z.string().optional(),
          slot: z.string().optional(),
          ammoType: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = `weapons-all-${input?.type ?? ""}-${input?.slot ?? ""}-${input?.ammoType ?? ""}`;

      return unstable_cache(
        async () => {
          return ctx.db.weapon.findMany({
            where: {
              ...(input?.type ? { type: input.type as never } : {}),
              ...(input?.slot ? { slot: input.slot as never } : {}),
              ...(input?.ammoType ? { ammoType: input.ammoType as never } : {}),
            },
            orderBy: { name: "asc" },
          });
        },
        [cacheKey],
        { revalidate: CACHE_TTL, tags: ["weapons"] },
      )();
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return unstable_cache(
        async () => {
          return ctx.db.weapon.findUnique({
            where: { slug: input.slug },
          });
        },
        [`weapon-${input.slug}`],
        { revalidate: CACHE_TTL, tags: ["weapons"] },
      )();
    }),

  getTypes: publicProcedure.query(async ({ ctx }) => {
    return unstable_cache(
      async () => {
        const weapons = await ctx.db.weapon.findMany({
          select: { type: true },
          distinct: ["type"],
          orderBy: { type: "asc" },
        });
        return weapons.map((w) => w.type);
      },
      ["weapon-types"],
      { revalidate: CACHE_TTL, tags: ["weapons"] },
    )();
  }),
});
