import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { quizResults } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { checkApiRateLimit } from "./lib/rate-limit";

export const quizRouter = createRouter({
  // ── Save quiz result ───────────────────────────────────────────
  save: authedQuery
    .input(
      z.object({
        chapterId: z.number().int().min(1).max(100),
        score: z.number().int().min(0).max(100),
        totalQuestions: z.number().int().min(1).max(50),
        correctAnswers: z.number().int().min(0).max(50),
        answers: z.record(z.string().max(10), z.number().min(0).max(3)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ip = ctx.req.headers.get("x-forwarded-for") || "unknown";
      const rate = checkApiRateLimit(`quiz-save:${ctx.user.id}:${ip}`);
      if (!rate.allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Rate limit exceeded. Please try again later.",
        });
      }

      // Validate score consistency
      if (input.correctAnswers > input.totalQuestions) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid score data: correctAnswers exceeds totalQuestions",
        });
      }
      const expectedScore = Math.round(
        (input.correctAnswers / input.totalQuestions) * 100,
      );
      if (Math.abs(expectedScore - input.score) > 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Score inconsistency detected",
        });
      }

      const db = getDb();
      await db.insert(quizResults).values({
        userId: ctx.user.id,
        chapterId: input.chapterId,
        score: input.score,
        totalQuestions: input.totalQuestions,
        correctAnswers: input.correctAnswers,
        answers: input.answers,
      });

      return { success: true };
    }),

  // ── Get user's quiz history ────────────────────────────────────
  history: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(quizResults)
      .where(eq(quizResults.userId, ctx.user.id))
      .orderBy(desc(quizResults.createdAt))
      .limit(100);
  }),

  // ── Get best score per chapter ─────────────────────────────────
  bestScores: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select({
        chapterId: quizResults.chapterId,
        bestScore: sql<number>`MAX(${quizResults.score})`,
        attempts: sql<number>`COUNT(*)`,
      })
      .from(quizResults)
      .where(eq(quizResults.userId, ctx.user.id))
      .groupBy(quizResults.chapterId);
  }),

  // ── Public leaderboard (top scores, anonymized) ────────────────
  leaderboard: publicQuery
    .input(
      z.object({
        chapterId: z.number().int().min(1).max(100).optional(),
        limit: z.number().int().min(1).max(50).default(20),
      }),
    )
    .query(async ({ input }) => {
      const db = getDb();
      let query = db
        .select({
          chapterId: quizResults.chapterId,
          bestScore: sql<number>`MAX(${quizResults.score})`,
          attempts: sql<number>`COUNT(*)`,
          userId: quizResults.userId,
        })
        .from(quizResults)
        .groupBy(quizResults.userId, quizResults.chapterId)
        .orderBy(sql`MAX(${quizResults.score}) DESC`)
        .limit(input.limit);

      if (input.chapterId) {
        query = query.where(eq(quizResults.chapterId, input.chapterId)) as typeof query;
      }

      const results = await query;

      // Anonymize user IDs - don't expose raw user IDs
      return results.map((r, i) => ({
        rank: i + 1,
        chapterId: r.chapterId,
        score: r.bestScore,
        attempts: r.attempts,
        userHash: `user_${Buffer.from(String(r.userId)).toString("base64").slice(0, 8)}`,
      }));
    }),
});
