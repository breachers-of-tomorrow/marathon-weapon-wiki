import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const buildRouter = createTRPCRouter({
  getByWeaponSlug: publicProcedure
    .input(
      z.object({
        weaponSlug: z.string(),
        type: z.enum(["PVP", "PVE", "PVEVP"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const builds = await ctx.db.build.findMany({
        where: {
          weapon: { slug: input.weaponSlug },
          ...(input.type ? { type: input.type } : {}),
        },
        orderBy: [{ score: "desc" }, { createdAt: "desc" }],
        include: {
          author: { select: { id: true, name: true, image: true } },
          mods: {
            include: {
              mod: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  rarity: true,
                },
              },
            },
          },
        },
      });

      let userVotes: Record<string, number> = {};
      if (ctx.session?.user) {
        const votes = await ctx.db.buildVote.findMany({
          where: {
            buildId: { in: builds.map((b) => b.id) },
            userId: ctx.session.user.id,
          },
        });
        userVotes = Object.fromEntries(votes.map((v) => [v.buildId, v.value]));
      }

      return builds.map((build) => ({
        ...build,
        userVote: (userVotes[build.id] as 1 | -1) ?? null,
      }));
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        type: z.enum(["PVP", "PVE", "PVEVP"]),
        weaponSlug: z.string(),
        modIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const weapon = await ctx.db.weapon.findUnique({
        where: { slug: input.weaponSlug },
      });
      if (!weapon) throw new TRPCError({ code: "NOT_FOUND", message: "Weapon not found" });

      // Validate mods: each must be linked to weapon or universal, no duplicate types
      const mods = await ctx.db.mod.findMany({
        where: { id: { in: input.modIds } },
      });
      if (mods.length !== input.modIds.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid mod selection" });
      }

      // Check for duplicate mod types
      const modTypes = mods.map((m) => m.type);
      if (new Set(modTypes).size !== modTypes.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Only one mod per type allowed" });
      }

      // Verify each mod is linked to weapon or is universal
      const linkedModIds = await ctx.db.weaponMod.findMany({
        where: { weaponId: weapon.id, modId: { in: input.modIds } },
        select: { modId: true },
      });
      const linkedSet = new Set(linkedModIds.map((wm) => wm.modId));
      for (const mod of mods) {
        if (!mod.isUniversal && !linkedSet.has(mod.id)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Mod "${mod.name}" is not available for this weapon`,
          });
        }
      }

      return ctx.db.$transaction(async (tx) => {
        const build = await tx.build.create({
          data: {
            title: input.title,
            type: input.type,
            weaponId: weapon.id,
            authorId: ctx.session.user.id,
          },
        });

        if (mods.length > 0) {
          await tx.buildMod.createMany({
            data: mods.map((mod) => ({
              buildId: build.id,
              modId: mod.id,
              modType: mod.type,
            })),
          });
        }

        return build;
      });
    }),

  vote: protectedProcedure
    .input(
      z.object({
        buildId: z.string(),
        value: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        if (input.value === 0) {
          await tx.buildVote.deleteMany({
            where: { buildId: input.buildId, userId: ctx.session.user.id },
          });
        } else {
          await tx.buildVote.upsert({
            where: {
              buildId_userId: {
                buildId: input.buildId,
                userId: ctx.session.user.id,
              },
            },
            create: {
              buildId: input.buildId,
              userId: ctx.session.user.id,
              value: input.value,
            },
            update: { value: input.value },
          });
        }

        const result = await tx.buildVote.aggregate({
          where: { buildId: input.buildId },
          _sum: { value: true },
        });

        const newScore = result._sum.value ?? 0;
        await tx.build.update({
          where: { id: input.buildId },
          data: { score: newScore },
        });

        return { score: newScore };
      });
    }),

  delete: protectedProcedure
    .input(z.object({ buildId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const build = await ctx.db.build.findUnique({
        where: { id: input.buildId },
      });
      if (!build) throw new TRPCError({ code: "NOT_FOUND" });
      if (build.authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.db.build.delete({ where: { id: input.buildId } });
      return { success: true };
    }),
});
