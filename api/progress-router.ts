import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { chapterProgress, studyStreaks } from "@db/schema";
import { eq, and } from "drizzle-orm";
import { checkApiRateLimit } from "./lib/rate-limit";

export const progressRouter = createRouter({
  // ── Get all progress for current user ──────────────────────────
  getAll: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const rows = await db
      .select()
      .from(chapterProgress)
      .where(eq(chapterProgress.userId, ctx.user.id));
    return rows;
  }),

  // ── Upsert chapter progress ────────────────────────────────────
  save: authedQuery
    .input(
      z.object({
        chapterId: z.number().int().min(1).max(100),
        percentComplete: z.number().int().min(0).max(100),
        topicsCompleted: z.array(z.string().max(50)).max(50).optional(),
        quizScore: z.number().int().min(0).max(100).optional(),
        quizPassed: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Rate limit check
      const ip = ctx.req.headers.get("x-forwarded-for") || "unknown";
      const rate = checkApiRateLimit(`progress-save:${ctx.user.id}:${ip}`);
      if (!rate.allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Rate limit exceeded. Please try again later.",
        });
      }

      const db = getDb();
      const existing = await db
        .select()
        .from(chapterProgress)
        .where(
          and(
            eq(chapterProgress.userId, ctx.user.id),
            eq(chapterProgress.chapterId, input.chapterId),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        // Update — only increase progress, never decrease
        const current = existing[0];
        const newPct = Math.max(
          current.percentComplete,
          input.percentComplete,
        );
        const mergedTopics = [
          ...(current.topicsCompleted || []),
          ...(input.topicsCompleted || []),
        ];
        const uniqueTopics = [...new Set(mergedTopics)].slice(0, 50);

        await db
          .update(chapterProgress)
          .set({
            percentComplete: newPct,
            topicsCompleted: uniqueTopics,
            quizScore:
              input.quizScore !== undefined
                ? Math.max(input.quizScore, current.quizScore || 0)
                : current.quizScore,
            quizPassed: input.quizPassed || current.quizPassed || false,
          })
          .where(eq(chapterProgress.id, current.id));

        return { success: true, operation: "updated" };
      }

      // Insert new
      await db.insert(chapterProgress).values({
        userId: ctx.user.id,
        chapterId: input.chapterId,
        percentComplete: input.percentComplete,
        topicsCompleted: input.topicsCompleted || [],
        quizScore: input.quizScore,
        quizPassed: input.quizPassed || false,
      });

      return { success: true, operation: "created" };
    }),

  // ── Get study streak ───────────────────────────────────────────
  getStreak: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const rows = await db
      .select()
      .from(studyStreaks)
      .where(eq(studyStreaks.userId, ctx.user.id))
      .limit(1);
    return rows[0] || null;
  }),

  // ── Update study streak ────────────────────────────────────────
  recordStudy: authedQuery
    .input(
      z.object({
        minutes: z.number().int().min(0).max(480).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(studyStreaks)
        .where(eq(studyStreaks.userId, ctx.user.id))
        .limit(1);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (existing.length > 0) {
        const streak = existing[0];
        const lastDate = new Date(streak.lastStudyDate);
        const lastStudyDay = new Date(
          lastDate.getFullYear(),
          lastDate.getMonth(),
          lastDate.getDate(),
        );

        const diffDays =
          (today.getTime() - lastStudyDay.getTime()) / (1000 * 60 * 60 * 24);

        let newCurrent = streak.currentStreak;
        let newLongest = streak.longestStreak;
        let newTotalDays = streak.totalStudyDays;
        let newTotalMinutes =
          streak.totalMinutes + (input.minutes || 0);

        if (diffDays === 1) {
          // Continued streak
          newCurrent += 1;
          newTotalDays += 1;
        } else if (diffDays > 1) {
          // Streak broken
          newLongest = Math.max(newLongest, newCurrent);
          newCurrent = 1;
          newTotalDays += 1;
        }
        // diffDays === 0 means same day, no streak change

        newLongest = Math.max(newLongest, newCurrent);

        await db
          .update(studyStreaks)
          .set({
            currentStreak: newCurrent,
            longestStreak: newLongest,
            lastStudyDate: now,
            totalStudyDays: newTotalDays,
            totalMinutes: newTotalMinutes,
          })
          .where(eq(studyStreaks.id, streak.id));

        return { currentStreak: newCurrent, longestStreak: newLongest };
      }

      // Create new streak
      await db.insert(studyStreaks).values({
        userId: ctx.user.id,
        currentStreak: 1,
        longestStreak: 1,
        lastStudyDate: now,
        totalStudyDays: 1,
        totalMinutes: input.minutes || 0,
      });

      return { currentStreak: 1, longestStreak: 1 };
    }),
});
