import { modRouter } from "@/server/api/routers/mod";
import { submissionRouter } from "@/server/api/routers/submission";
import { weaponRouter } from "@/server/api/routers/weapon";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  weapon: weaponRouter,
  mod: modRouter,
  submission: submissionRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
