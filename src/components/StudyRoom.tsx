import { useState, useEffect } from "react";
import type { Chapter } from "../data/chapters";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import VideoPlayer from "./VideoPlayer";
import Quiz from "./Quiz";

interface StudyRoomProps {
  chapter: Chapter;
  onBack: () => void;
}

export default function StudyRoom({ chapter, onBack }: StudyRoomProps) {
  const { isAuthenticated } = useAuth();
  const [activeVideo, setActiveVideo] = useState<Chapter["topics"][number] | null>(null);
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"topics" | "notes">("topics");
  const utils = trpc.useUtils();

  // Load server progress
  const { data: serverProgress } = trpc.progress.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const saveProgress = trpc.progress.save.useMutation({
    onSuccess: () => utils.progress.getAll.invalidate(),
  });
  const recordStudy = trpc.progress.recordStudy.useMutation({
    onSuccess: () => utils.progress.getStreak.invalidate(),
  });
  const saveQuiz = trpc.quiz.save.useMutation({
    onSuccess: () => {
      utils.quiz.history.invalidate();
      utils.quiz.bestScores.invalidate();
    },
  });

  // Sync local state with server progress on load
  useEffect(() => {
    if (serverProgress) {
      const chapterData = serverProgress.find((p) => p.chapterId === chapter.id);
      if (chapterData?.topicsCompleted) {
        const topics = Array.isArray(chapterData.topicsCompleted)
          ? chapterData.topicsCompleted
          : [];
        setCompletedTopics(new Set(topics));
      }
    }
  }, [serverProgress, chapter.id]);

  const handleTopicComplete = (topicId: string) => {
    setCompletedTopics((prev) => {
      const next = new Set(prev);
      next.add(topicId);
      return next;
    });

    // Calculate percentage
    const allTopics = new Set([...Array.from(completedTopics), topicId]);
    const pct = Math.round((allTopics.size / chapter.topics.length) * 100);

    // Persist to server if authenticated
    if (isAuthenticated) {
      saveProgress.mutate({
        chapterId: chapter.id,
        percentComplete: pct,
        topicsCompleted: Array.from(allTopics),
      });
      recordStudy.mutate({ minutes: 5 });
    }
  };

  const handleQuizComplete = (score: number) => {
    const correct = Math.round((score / 100) * chapter.questions.length);

    // Save quiz result
    if (isAuthenticated) {
      saveQuiz.mutate({
        chapterId: chapter.id,
        score,
        totalQuestions: chapter.questions.length,
        correctAnswers: correct,
        answers: {},
      });

      if (score >= 70) {
        saveProgress.mutate({
          chapterId: chapter.id,
          percentComplete: 100,
          topicsCompleted: Array.from(completedTopics),
          quizScore: score,
          quizPassed: true,
        });
      } else {
        saveProgress.mutate({
          chapterId: chapter.id,
          percentComplete: Math.max(
            Math.round((completedTopics.size / chapter.topics.length) * 100),
            50,
          ),
          topicsCompleted: Array.from(completedTopics),
          quizScore: score,
        });
      }
      recordStudy.mutate({ minutes: 10 });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0F" }}>
      {activeVideo && (
        <VideoPlayer
          topic={activeVideo}
          chapter={chapter}
          onClose={() => {
            setActiveVideo(null);
            handleTopicComplete(activeVideo.id);
          }}
        />
      )}
      {activeQuiz && (
        <Quiz
          chapter={chapter}
          onClose={() => setActiveQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b"
        style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", borderColor: "rgba(201,168,76,0.06)" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center gap-4">
          <button onClick={onBack} className="text-white/30 hover:text-[#C9A84C] transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-semibold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
            </svg>
            Back
          </button>
          <div className="w-px h-4" style={{ background: "rgba(201,168,76,0.15)" }} />
          <div className="flex items-center gap-2">
            <span className="text-sm">{chapter.icon}</span>
            <div>
              <div className="text-[10px] text-white/25 uppercase tracking-[0.15em]">Chapter {chapter.id}</div>
              <div className="text-white/80 text-xs font-semibold font-serif">{chapter.shortTitle}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Chapter Hero */}
        <div className="rounded-xl p-8 mb-8 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #111118 0%, #0D0D14 100%)", border: "1px solid rgba(201,168,76,0.08)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${chapter.color}08 0%, transparent 70%)`, filter: "blur(40px)", transform: "translate(30%, -30%)" }} />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${chapter.color}10`, border: `1px solid ${chapter.color}25` }}>
                {chapter.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded" style={{ background: "rgba(201,168,76,0.08)", color: "#C9A84C" }}>Chapter {chapter.id}</span>
                </div>
                <h1 className="font-serif text-xl font-bold text-white">{chapter.title}</h1>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-2xl">{chapter.description}</p>
            <div className="flex gap-2">
              {[{ key: "topics" as const, label: "Study Topics", icon: "📚" }, { key: "notes" as const, label: "Key Summaries", icon: "📝" }].map(({ key, label, icon }) => (
                <button key={key} onClick={() => setActiveTab(key)} className="px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2"
                  style={activeTab === key ? { background: "rgba(201,168,76,0.1)", color: "#E8D5A3", border: "1px solid rgba(201,168,76,0.2)" } : { background: "transparent", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span>{icon}</span>{label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === "topics" && (
          <>
            <div className="space-y-3 mb-8">
              {chapter.topics.map((topic, i) => {
                const done = completedTopics.has(topic.id);
                return (
                  <div key={topic.id} className="rounded-xl p-5 transition-all duration-300" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))", border: `1px solid ${done ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)"}` }}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all"
                          style={{ background: done ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${done ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)"}`, color: done ? "#34D399" : "rgba(255,255,255,0.3)" }}>
                          {done ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12" /></svg>
                          ) : (i + 1)}
                        </div>
                        <div>
                          <div className="text-white text-sm font-semibold font-serif mb-0.5">{topic.title}</div>
                          <div className="flex items-center gap-3 text-[11px] text-white/25">
                            <span>{topic.slides.length} slides</span>
                            <span className="text-white/10">|</span>
                            <span>{topic.duration}</span>
                            {done && <span className="text-emerald-400/70 font-medium">Completed</span>}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setActiveVideo(topic)} className="px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0"
                        style={done ? { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.06)" } : { background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08))", color: "#E8D5A3", border: "1px solid rgba(201,168,76,0.2)" }}>
                        {done ? "Review" : "Start Lecture"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quiz CTA */}
            <div className="rounded-xl p-8 text-center relative overflow-hidden" style={{ background: "linear-gradient(160deg, #111118, #0D0D14)", border: "1px solid rgba(201,168,76,0.08)" }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)", filter: "blur(20px)" }} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>🧠</div>
                <h3 className="font-serif text-white text-lg font-bold mb-1">Test Your Knowledge</h3>
                <p className="text-white/30 text-xs mb-6">{chapter.questions.length} RE5-style assessment questions</p>
                <button onClick={() => setActiveQuiz(true)} className="px-8 py-2.5 rounded-lg text-xs font-semibold transition-all btn-premium">Begin Assessment</button>
              </div>
            </div>
          </>
        )}

        {activeTab === "notes" && (
          <div className="space-y-3">
            {chapter.topics.map((topic) => (
              <div key={topic.id} className="rounded-xl overflow-hidden" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="px-5 py-3.5 border-b border-white/5"><div className="text-white/80 text-sm font-semibold font-serif">{topic.title}</div></div>
                <div className="p-5 space-y-3">
                  {topic.slides.map((slide, i) => (
                    <div key={i} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "#C9A84C" }}>{slide.heading}</div>
                      <div className="text-white/50 text-sm leading-[1.7] whitespace-pre-line mb-3">{slide.body}</div>
                      <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.08)" }}>
                        <span className="text-xs mt-0.5">💡</span>
                        <div className="text-xs text-white/40 leading-relaxed">{slide.keyFact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
