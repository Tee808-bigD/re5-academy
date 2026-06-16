import { relations } from "drizzle-orm";
import {
  users,
  chapterProgress,
  quizResults,
  coachingSessions,
  coachingMessages,
  studyStreaks,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  progress: many(chapterProgress),
  quizResults: many(quizResults),
  coachingSessions: many(coachingSessions),
  studyStreak: many(studyStreaks),
}));

export const chapterProgressRelations = relations(chapterProgress, ({ one }) => ({
  user: one(users, { fields: [chapterProgress.userId], references: [users.id] }),
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  user: one(users, { fields: [quizResults.userId], references: [users.id] }),
}));

export const coachingSessionsRelations = relations(coachingSessions, ({ one, many }) => ({
  user: one(users, { fields: [coachingSessions.userId], references: [users.id] }),
  messages: many(coachingMessages),
}));

export const coachingMessagesRelations = relations(coachingMessages, ({ one }) => ({
  session: one(coachingSessions, {
    fields: [coachingMessages.sessionId],
    references: [coachingSessions.id],
  }),
}));
