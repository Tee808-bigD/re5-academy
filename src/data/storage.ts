// ─── Local Storage Keys ────────────────────────────────────────────
const KEYS = {
  progress: "re5_progress",
  quizResults: "re5_quiz_results",
  streak: "re5_streak",
  syncedAt: "re5_synced_at",
} as const;

// ─── Types ─────────────────────────────────────────────────────────
export interface LocalChapterProgress {
  chapterId: number;
  percentComplete: number;
  topicsCompleted: string[];
  quizScore?: number;
  quizPassed?: boolean;
  updatedAt: number;
}

export interface LocalQuizResult {
  chapterId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: Record<string, number>;
  timestamp: number;
}

export interface LocalStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  totalStudyDays: number;
  totalMinutes: number;
}

// ─── Helpers ───────────────────────────────────────────────────────
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("[storage] Failed to write to localStorage:", e);
  }
}

// ─── Chapter Progress ──────────────────────────────────────────────
export function getLocalProgress(): LocalChapterProgress[] {
  return safeGet<LocalChapterProgress[]>(KEYS.progress, []);
}

export function getLocalProgressForChapter(
  chapterId: number,
): LocalChapterProgress | null {
  const all = getLocalProgress();
  return all.find((p) => p.chapterId === chapterId) ?? null;
}

export function saveLocalProgress(data: {
  chapterId: number;
  percentComplete: number;
  topicsCompleted: string[];
  quizScore?: number;
  quizPassed?: boolean;
}): void {
  const all = getLocalProgress();
  const idx = all.findIndex((p) => p.chapterId === data.chapterId);

  const entry: LocalChapterProgress = {
    chapterId: data.chapterId,
    percentComplete: data.percentComplete,
    topicsCompleted: data.topicsCompleted,
    quizScore: data.quizScore,
    quizPassed: data.quizPassed,
    updatedAt: Date.now(),
  };

  if (idx >= 0) {
    // Merge — never decrease progress
    const existing = all[idx];
    all[idx] = {
      ...existing,
      percentComplete: Math.max(existing.percentComplete, entry.percentComplete),
      topicsCompleted: [
        ...new Set([...existing.topicsCompleted, ...entry.topicsCompleted]),
      ],
      quizScore:
        entry.quizScore !== undefined
          ? Math.max(entry.quizScore, existing.quizScore || 0)
          : existing.quizScore,
      quizPassed: entry.quizPassed || existing.quizPassed || false,
      updatedAt: Date.now(),
    };
  } else {
    all.push(entry);
  }

  safeSet(KEYS.progress, all);
}

// ─── Quiz Results ──────────────────────────────────────────────────
export function getLocalQuizResults(chapterId?: number): LocalQuizResult[] {
  const all = safeGet<LocalQuizResult[]>(KEYS.quizResults, []);
  if (chapterId !== undefined) {
    return all.filter((r) => r.chapterId === chapterId);
  }
  return all;
}

export function saveLocalQuizResult(data: {
  chapterId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: Record<string, number>;
}): void {
  const all = getLocalQuizResults();
  all.push({
    ...data,
    timestamp: Date.now(),
  });
  safeSet(KEYS.quizResults, all);
}

// ─── Study Streak ──────────────────────────────────────────────────
export function getLocalStreak(): LocalStreak | null {
  return safeGet<LocalStreak | null>(KEYS.streak, null);
}

export function recordLocalStudy(minutes: number): LocalStreak {
  const existing = getLocalStreak();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let streak: LocalStreak;

  if (existing) {
    const lastDate = new Date(existing.lastStudyDate);
    const lastDay = new Date(
      lastDate.getFullYear(),
      lastDate.getMonth(),
      lastDate.getDate(),
    );
    const diffDays =
      (today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24);

    let newCurrent = existing.currentStreak;
    let newLongest = existing.longestStreak;
    let newTotalDays = existing.totalStudyDays;

    if (diffDays === 1) {
      newCurrent += 1;
      newTotalDays += 1;
    } else if (diffDays > 1) {
      newLongest = Math.max(newLongest, newCurrent);
      newCurrent = 1;
      newTotalDays += 1;
    }
    // diffDays === 0: same day, no streak change

    newLongest = Math.max(newLongest, newCurrent);

    streak = {
      currentStreak: newCurrent,
      longestStreak: newLongest,
      lastStudyDate: now.toISOString(),
      totalStudyDays: newTotalDays,
      totalMinutes: existing.totalMinutes + minutes,
    };
  } else {
    streak = {
      currentStreak: 1,
      longestStreak: 1,
      lastStudyDate: now.toISOString(),
      totalStudyDays: 1,
      totalMinutes: minutes,
    };
  }

  safeSet(KEYS.streak, streak);
  return streak;
}

// ─── Sync to Server ────────────────────────────────────────────────
/**
 * Upload all locally-saved progress to the server via tRPC mutations.
 * Call this when a user authenticates (e.g., in StudyRoom on mount).
 *
 * Note: The mutation objects already have onSuccess handlers that invalidate
 * the relevant server queries, so we don't need to invalidate here.
 */
export async function syncLocalProgressToServer(mutations: {
  saveProgress: {
    mutate: (data: {
      chapterId: number;
      percentComplete: number;
      topicsCompleted: string[];
      quizScore?: number;
      quizPassed?: boolean;
    }) => void;
  };
  recordStudy: {
    mutate: (data: { minutes: number }) => void;
  };
  saveQuiz: {
    mutate: (data: {
      chapterId: number;
      score: number;
      totalQuestions: number;
      correctAnswers: number;
      answers: Record<string, number>;
    }) => void;
  };
}): Promise<void> {
  // Check if we've already synced
  const lastSynced = safeGet<string | null>(KEYS.syncedAt, null);
  if (lastSynced) {
    // Check if there's new unsynced data by comparing timestamps
    const localProgress = getLocalProgress();
    const hasNewData = localProgress.some(
      (p) => p.updatedAt > new Date(lastSynced).getTime(),
    );
    if (!hasNewData) return;
  }

  const localProgress = getLocalProgress();
  const localStreak = getLocalStreak();

  // Sync chapter progress
  for (const p of localProgress) {
    mutations.saveProgress.mutate({
      chapterId: p.chapterId,
      percentComplete: p.percentComplete,
      topicsCompleted: p.topicsCompleted,
      quizScore: p.quizScore,
      quizPassed: p.quizPassed,
    });
  }

  // Sync quiz results
  const localQuizResults = getLocalQuizResults();
  for (const q of localQuizResults) {
    mutations.saveQuiz.mutate({
      chapterId: q.chapterId,
      score: q.score,
      totalQuestions: q.totalQuestions,
      correctAnswers: q.correctAnswers,
      answers: q.answers,
    });
  }

  // Sync streak (estimate total minutes from local data)
  if (localStreak && localStreak.totalMinutes > 0) {
    mutations.recordStudy.mutate({
      minutes: Math.min(localStreak.totalMinutes, 480),
    });
  }

  // Mark as synced
  safeSet(KEYS.syncedAt, new Date().toISOString());
}

/**
 * Mark all local data as synced (used when user is already authenticated
 * and we just saved directly to the server).
 */
export function markSynced(): void {
  safeSet(KEYS.syncedAt, new Date().toISOString());
}

// ─── Clear ─────────────────────────────────────────────────────────
export function clearLocalProgress(): void {
  try {
    localStorage.removeItem(KEYS.progress);
    localStorage.removeItem(KEYS.quizResults);
    localStorage.removeItem(KEYS.streak);
    localStorage.removeItem(KEYS.syncedAt);
  } catch {
    // ignore
  }
}
