import { z } from "zod";
import { unstable_cache } from "next/cache";
import { WeaponType, WeaponSlot, AmmoType } from "../../../../generated/prisma";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

const CACHE_TTL = 3600; // 1 hour

const getCachedWeapons = (type?: WeaponType, slot?: WeaponSlot, ammoType?: AmmoType) =>
  unstable_cache(
    () =>
      db.weapon.findMany({
        where: {
          ...(type ? { type } : {}),
          ...(slot ? { slot } : {}),
          ...(ammoType ? { ammoType } : {}),
        },
        orderBy: { name: "asc" },
      }),
    [`weapons-all-${type ?? ""}-${slot ?? ""}-${ammoType ?? ""}`],
    { revalidate: CACHE_TTL, tags: ["weapons"] },
  )();

const getCachedWeaponBySlug = (slug: string) =>
  unstable_cache(
    () => db.weapon.findUnique({ where: { slug } }),
    [`weapon-${slug}`],
    { revalidate: CACHE_TTL, tags: ["weapons"] },
  )();

const getCachedWeaponTypes = () =>
  unstable_cache(
    () =>
      db.weapon
        .findMany({
          select: { type: true },
          distinct: ["type"],
          orderBy: { type: "asc" },
        })
        .then((w) => w.map((w) => w.type)),
    ["weapon-types"],
    { revalidate: CACHE_TTL, tags: ["weapons"] },
  )();

export const weaponRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          type: z.nativeEnum(WeaponType).optional(),
          slot: z.nativeEnum(WeaponSlot).optional(),
          ammoType: z.nativeEnum(AmmoType).optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return getCachedWeapons(input?.type, input?.slot, input?.ammoType);
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return getCachedWeaponBySlug(input.slug);
    }),

  getTypes: publicProcedure.query(async () => {
    return getCachedWeaponTypes();
  }),
});
