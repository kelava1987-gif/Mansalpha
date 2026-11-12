import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  getWorkspace,
  saveWorkspace,
  saveWorkspaceInputSchema,
} from "./workspace";
import { z } from "zod";
import { getEditorialRecords } from "./editorial";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  workspace: router({
    // This optional value partitions client caches only; it never selects an owner.
    get: publicProcedure
      .input(z.object({ cacheScope: z.string().max(100) }).optional())
      .query(({ ctx }) => getWorkspace(ctx.user?.id ?? null)),
    save: protectedProcedure
      .input(saveWorkspaceInputSchema)
      .mutation(({ ctx, input }) => saveWorkspace(ctx.user.id, input)),
  }),
  editorial: router({
    get: publicProcedure.query(() => getEditorialRecords()),
  }),
});

export type AppRouter = typeof appRouter;
