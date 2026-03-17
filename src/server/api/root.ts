import { modRouter } from "@/server/api/routers/mod";
import { weaponRouter } from "@/server/api/routers/weapon";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  weapon: weaponRouter,
  mod: modRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
