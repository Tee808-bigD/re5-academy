import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { coachingSessions, coachingMessages, chapterProgress } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";
import { checkCoachingRateLimit } from "./lib/rate-limit";

// ─── AI Coach Knowledge Base ────────────────────────────────────────
const RE5_KNOWLEDGE = {
  chapterOverviews: [
    { id: 1, title: "FAIS Act Framework", tip: "Remember: FAIS follows a FUNCTIONAL approach, not institutional. The two core purposes are professionalisation and consumer protection." },
    { id: 2, title: "FSP Licensing", tip: "The 15-day notification rule is the most frequently tested timeframe. Display certified copies in EVERY premises." },
    { id: 3, title: "Key Individual", tip: "Category III KIs need 3 years specific + 1 year management experience. CPD: 18/12/6 hours pattern." },
    { id: 4, title: "Code of Conduct", tip: "Client funds within 1 business day. Immaterial interest = R1,000 max per third party per year." },
    { id: 5, title: "Record Keeping", tip: "5 years retention for both FAIS and FICA. FICA suspicious reports: 5 days. Cash reports: 2 days (R25k+)." },
    { id: 6, title: "Anti-Money Laundering", tip: "4 AML obligations: identify, keep records, report, adopt compliance measures. No anonymous clients allowed." },
    { id: 7, title: "FAIS Ombud", tip: "3-year limit from KNOWLEDGE (not event). R800,000 monetary limit. 2 weeks for warrant of execution." },
    { id: 8, title: "Representatives", tip: "RE5 within 2 years of appointment. 5-year experience lapsing rule. 8-week interruption triggers extra supervision." },
  ],
  timeframes: [
    { time: "5 Years", desc: "Record keeping" },
    { time: "15 Days", desc: "Notify Registrar" },
    { time: "21 Days", desc: "Representations" },
    { time: "60 Days", desc: "Rectify practice" },
    { time: "2 Days", desc: "Cash report FIC" },
    { time: "5 Days", desc: "Suspicious report" },
    { time: "6 Years", desc: "Max supervision" },
    { time: "1 Month", desc: "Response period" },
  ],
};

// ─── Simple AI Coach (rule-based with context) ──────────────────────
function generateCoachResponse(
  userMessage: string,
  progress: typeof chapterProgress.$inferSelect[],
): string {
  const msg = userMessage.toLowerCase().trim();

  // Calculate weak areas
  const weakChapters = progress
    .filter((p) => p.percentComplete < 50)
    .sort((a, b) => a.percentComplete - b.percentComplete);

  const completedChapters = progress.filter(
    (p) => p.percentComplete >= 100,
  );

  // Motivation & encouragement
  if (msg.includes("motivat") || msg.includes("encourage") || msg.includes("stuck")) {
    if (completedChapters.length > 0) {
      return `You've already mastered ${completedChapters.length} chapter${completedChapters.length > 1 ? "s" : ""} — that's real progress. Financial services regulation is complex material, and every chapter you complete puts you closer to passing RE5. The professionals who succeed aren't the ones who never struggle; they're the ones who keep showing up. Which chapter would you like to tackle next?`;
    }
    return `Starting is always the hardest part. Remember — every expert in this industry once sat exactly where you are now. Break your study into 25-minute focused sessions, and celebrate each slide you complete. The RE5 exam is passable with disciplined preparation. Would you like me to suggest a study plan?`;
  }

  // Study plan
  if (msg.includes("plan") || msg.includes("where") || msg.includes("start") || msg.includes("schedule")) {
    if (weakChapters.length > 0) {
      const next = RE5_KNOWLEDGE.chapterOverviews.find(
        (c) => c.id === weakChapters[0].chapterId,
      );
      return `Based on your progress, I recommend focusing on **Chapter ${next?.id}: ${next?.title}** next. You're at ${weakChapters[0].percentComplete}% completion — pushing this to 100% will significantly boost your overall readiness.\n\nSuggested 7-day plan:\n• Days 1–2: Watch all video lectures for this chapter\n• Day 3: Review Key Summaries tab\n• Days 4–5: Take the practice quiz twice\n• Day 6: Focus on missed questions\n• Day 7: Move to the next weakest chapter`;
    }
    return `I recommend starting with **Chapter 1: The FAIS Act as a Regulatory Framework** — it's the foundation everything else builds on. Start with the video lectures, then review the Key Summaries before attempting the quiz. Master the functional vs institutional approach and the two core purposes (professionalisation and consumer protection).`;
  }

  // Timeframes / memory aid
  if (msg.includes("time") || msg.includes("day") || msg.includes("remember") || msg.includes("date")) {
    return `The most critical timeframes for RE5:\n\n**High-frequency exam items:**\n• **15 days** — Notify Registrar of changes (most tested!)\n• **5 years** — Record keeping (FAIS & FICA)\n• **2 days** — Report cash >R25,000 to FIC\n\n**Medium-frequency:**\n• **5 days** — Suspicious transaction reports\n• **21 days** — Representations on undesirable practices\n• **60 days** — Rectify after direction\n\nPro tip: The 15-day rule appears in almost every exam. Know it cold.`;
  }

  // Exam tips
  if (msg.includes("exam") || msg.includes("test") || msg.includes("tip") || msg.includes("trick")) {
    return `**Exam Strategy Tips:**\n\n1. **Read the question twice** — many wrong answers come from misreading.\n2. **Eliminate obviously wrong options first** — usually one answer is clearly incorrect.\n3. **Watch for "ALL/ONLY/NEVER"** — absolutes are often wrong in regulatory questions.\n4. **Timeframes are gold** — if a question mentions days/months/years, the timeframe is likely the answer.\n5. **Functional vs Institutional** — when in doubt, FAIS uses a functional approach.\n6. **The FSP is responsible** — for representatives' actions, compliance, record keeping.\n\nYou've completed ${completedChapters.length}/8 chapters. Keep building that momentum.`;
  }

  // Specific chapter questions
  for (const ch of RE5_KNOWLEDGE.chapterOverviews) {
    if (msg.includes(`chapter ${ch.id}`) || msg.includes(ch.title.toLowerCase())) {
      const userProgress = progress.find((p) => p.chapterId === ch.id);
      if (userProgress) {
        return `**Chapter ${ch.id}: ${ch.title}** — You're at ${userProgress.percentComplete}% completion.\n\n${ch.tip}\n\n${userProgress.quizPassed ? "✓ Quiz passed!" : "⚠ Quiz not yet passed — take the assessment when ready."}`;
      }
      return `**Chapter ${ch.id}: ${ch.title}** — You haven't started this chapter yet.\n\n${ch.tip}\n\nWould you like a focused study plan for this chapter?`;
    }
  }

  // Default: contextual response based on progress
  const overallPct =
    progress.length > 0
      ? Math.round(
          progress.reduce((s, p) => s + p.percentComplete, 0) / 8,
        )
      : 0;

  if (overallPct > 75) {
    return `You're at ${overallPct}% overall completion — excellent progress! You're in the final stretch. I recommend reviewing your weakest chapters and retaking quizzes where you scored below 80%. Focus on the Critical Timeframes reference card and practice identifying which FAIS section applies to different scenarios. You're almost exam-ready.`;
  } else if (overallPct > 40) {
    return `You're making solid progress at ${overallPct}% overall completion. The chapters you've completed are building a strong foundation. ${weakChapters.length > 0 ? `I'd recommend focusing on Chapter ${weakChapters[0].chapterId} next — you're at ${weakChapters[0].percentComplete}% there.` : "Keep pushing through the remaining chapters systematically."} Consistency beats intensity — even 20 minutes daily compounds rapidly. How can I help you stay on track?`;
  }

  return `Welcome to your RE5 study coaching. I'm here to help you prepare for the Regulatory Examination with personalized guidance based on your progress.\n\nYou can ask me about:\n• **Study plans** — "Create a study plan for me"\n• **Exam tips** — "Give me exam tips"\n• **Timeframes** — "Help me remember timeframes"\n• **Specific chapters** — "Tell me about Chapter 3"\n• **Motivation** — "I need encouragement"\n\nWhat would you like to focus on today?`;
}

// ─── Router ─────────────────────────────────────────────────────────
export const coachingRouter = createRouter({
  // ── List sessions ──────────────────────────────────────────────
  sessions: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(coachingSessions)
      .where(
        and(
          eq(coachingSessions.userId, ctx.user.id),
          eq(coachingSessions.status, "active"),
        ),
      )
      .orderBy(desc(coachingSessions.updatedAt));
  }),

  // ── Create session ─────────────────────────────────────────────
  createSession: authedQuery
    .input(
      z.object({
        title: z.string().min(1).max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [session] = await db.insert(coachingSessions).values({
        userId: ctx.user.id,
        title: input.title || "Study Session",
      }).$returningId();

      const newSession = await db
        .select()
        .from(coachingSessions)
        .where(eq(coachingSessions.id, session.id))
        .limit(1);

      // Add welcome message
      const progress = await db
        .select()
        .from(chapterProgress)
        .where(eq(chapterProgress.userId, ctx.user.id));

      const welcomeMsg = generateCoachResponse("hello", progress);

      await db.insert(coachingMessages).values({
        sessionId: session.id,
        role: "coach",
        content: welcomeMsg,
      });

      return newSession[0];
    }),

  // ── Get messages for a session ─────────────────────────────────
  messages: authedQuery
    .input(z.object({ sessionId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();

      // Verify session belongs to user
      const session = await db
        .select()
        .from(coachingSessions)
        .where(eq(coachingSessions.id, input.sessionId))
        .limit(1);

      if (!session.length || session[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      return db
        .select()
        .from(coachingMessages)
        .where(eq(coachingMessages.sessionId, input.sessionId))
        .orderBy(coachingMessages.createdAt);
    }),

  // ── Send message (with AI response) ────────────────────────────
  sendMessage: authedQuery
    .input(
      z.object({
        sessionId: z.number().int().positive(),
        content: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Rate limit
      const ip = ctx.req.headers.get("x-forwarded-for") || "unknown";
      const rate = checkCoachingRateLimit(`coach:${ctx.user.id}:${ip}`);
      if (!rate.allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many coaching requests. Please wait a moment.",
        });
      }

      const db = getDb();

      // Verify session belongs to user
      const session = await db
        .select()
        .from(coachingSessions)
        .where(eq(coachingSessions.id, input.sessionId))
        .limit(1);

      if (!session.length || session[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      // Sanitize input
      const sanitized = input.content
        .replace(/[<>]/g, "") // Strip HTML tags
        .trim()
        .slice(0, 2000);

      // Save user message
      await db.insert(coachingMessages).values({
        sessionId: input.sessionId,
        role: "user",
        content: sanitized,
      });

      // Get progress for context
      const progress = await db
        .select()
        .from(chapterProgress)
        .where(eq(chapterProgress.userId, ctx.user.id));

      // Generate AI response
      const coachResponse = generateCoachResponse(sanitized, progress);

      // Save coach message
      await db.insert(coachingMessages).values({
        sessionId: input.sessionId,
        role: "coach",
        content: coachResponse,
      });

      // Update session timestamp
      await db
        .update(coachingSessions)
        .set({ updatedAt: new Date() })
        .where(eq(coachingSessions.id, input.sessionId));

      return { success: true };
    }),

  // ── Archive session ────────────────────────────────────────────
  archive: authedQuery
    .input(z.object({ sessionId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(coachingSessions)
        .set({ status: "archived" })
        .where(
          and(
            eq(coachingSessions.id, input.sessionId),
            eq(coachingSessions.userId, ctx.user.id),
          ),
        );
      return { success: true };
    }),
});
