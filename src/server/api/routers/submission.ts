import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const submissionRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        message: z.string().min(1).max(180),
        imageUrl: z.string().url(),
        pageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.submission.create({
        data: {
          message: input.message,
          imageUrl: input.imageUrl,
          pageUrl: input.pageUrl,
        },
      });
      return { success: true };
    }),
});
