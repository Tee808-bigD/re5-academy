import { authRouter } from "./auth-router";
import { progressRouter } from "./progress-router";
import { quizRouter } from "./quiz-router";
import { coachingRouter } from "./coaching-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  progress: progressRouter,
  quiz: quizRouter,
  coaching: coachingRouter,
});

export type AppRouter = typeof appRouter;
