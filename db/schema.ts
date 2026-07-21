import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  boolean,
  bigint,
  json,
} from "drizzle-orm/mysql-core";

// ─── USERS ────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── CHAPTER PROGRESS ────────────────────────────────────────────────
export const chapterProgress = mysqlTable("chapter_progress", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull(),
  chapterId: int("chapterId").notNull(),
  percentComplete: int("percentComplete").notNull().default(0),
  topicsCompleted: json("topicsCompleted").$type<string[]>(),
  quizScore: int("quizScore"),
  quizPassed: boolean("quizPassed").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ChapterProgress = typeof chapterProgress.$inferSelect;

// ─── QUIZ RESULTS ────────────────────────────────────────────────────
export const quizResults = mysqlTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull(),
  chapterId: int("chapterId").notNull(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  correctAnswers: int("correctAnswers").notNull(),
  answers: json("answers").$type<Record<number, number>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizResult = typeof quizResults.$inferSelect;

// ─── COACHING SESSIONS ───────────────────────────────────────────────
export const coachingSessions = mysqlTable("coaching_sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull().default("Study Session"),
  status: mysqlEnum("status", ["active", "archived"])
    .default("active")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type CoachingSession = typeof coachingSessions.$inferSelect;

// ─── COACHING MESSAGES ───────────────────────────────────────────────
export const coachingMessages = mysqlTable("coaching_messages", {
  id: serial("id").primaryKey(),
  sessionId: bigint("sessionId", { mode: "number", unsigned: true })
    .notNull(),
  role: mysqlEnum("role", ["user", "coach"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CoachingMessage = typeof coachingMessages.$inferSelect;

// ─── STUDY STREAKS ───────────────────────────────────────────────────
export const studyStreaks = mysqlTable("study_streaks", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .unique(),
  currentStreak: int("currentStreak").notNull().default(0),
  longestStreak: int("longestStreak").notNull().default(0),
  lastStudyDate: timestamp("lastStudyDate").defaultNow().notNull(),
  totalStudyDays: int("totalStudyDays").notNull().default(0),
  totalMinutes: int("totalMinutes").notNull().default(0),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type StudyStreak = typeof studyStreaks.$inferSelect;

// ─── SECURITY AUDIT LOG ──────────────────────────────────────────────
export const auditLog = mysqlTable("audit_log", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }),
  details: json("details").$type<Record<string, unknown>>(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: varchar("userAgent", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLog.$inferSelect;
