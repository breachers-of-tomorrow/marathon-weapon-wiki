import { buildRouter } from "@/server/api/routers/build";
import { modRouter } from "@/server/api/routers/mod";
import { searchRouter } from "@/server/api/routers/search";
import { submissionRouter } from "@/server/api/routers/submission";
import { weaponRouter } from "@/server/api/routers/weapon";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  weapon: weaponRouter,
  mod: modRouter,
  search: searchRouter,
  submission: submissionRouter,
  build: buildRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
