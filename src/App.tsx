import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { CHAPTERS } from "./data/chapters";
import type { Chapter } from "./data/chapters";
import ChapterCard from "./components/ChapterCard";
import StudyRoom from "./components/StudyRoom";
import Coaching from "./pages/Coaching";
import Login from "./pages/Login";
import { getLocalProgress } from "./data/storage";

// ─── INTRO SCREEN ──────────────────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#0A0A0F" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 60%)",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative text-center max-w-lg px-8 z-10">
        <div className="mb-8 fade-up">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mx-auto"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.03))",
              border: "1px solid rgba(201,168,76,0.15)",
              boxShadow: "0 8px 40px rgba(201,168,76,0.08)",
            }}
          >
            ⚖️
          </div>
        </div>

        <div className="fade-up delay-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "#C9A84C" }}>
            South African Regulatory Examination
          </div>
          <h1 className="font-serif text-5xl font-bold text-white leading-tight mb-4">
            RE5 <span className="gold-shimmer">Academy</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed mb-2 max-w-sm mx-auto">
            The professional learning platform for Financial Services Representatives
          </p>
          <p className="text-white/20 text-xs mb-12">Complete coverage of the official RE5 Self-Study Guide</p>
        </div>

        <div className="fade-up delay-2 grid grid-cols-3 gap-3 mb-10 max-w-xs mx-auto">
          {[["8", "Chapters"], ["50+", "Topics"], ["60+", "Questions"]].map(([n, l]) => (
            <div key={l} className="rounded-lg py-3 px-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="font-serif text-xl font-bold text-white mb-0.5">{n}</div>
              <div className="text-white/25 text-[10px] uppercase tracking-wider">{l}</div>
            </div>
          ))}
        </div>

        <div className="fade-up delay-3">
          <button onClick={onStart} className="px-10 py-3.5 rounded-xl text-sm font-semibold btn-premium">
            Begin Your Journey
          </button>
          <p className="text-white/15 text-[10px] mt-4 uppercase tracking-[0.2em]">Free &middot; Comprehensive &middot; Professional</p>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────
function Dashboard({ onOpenChapter }: { onOpenChapter: (ch: Chapter) => void }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load progress from API if authenticated
  const { data: serverProgress } = trpc.progress.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: streak } = trpc.progress.getStreak.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Merge server progress with local fallback
  const chapterProgress: Record<number, number> = {};
  if (serverProgress) {
    for (const row of serverProgress) {
      chapterProgress[row.chapterId] = row.percentComplete;
    }
  } else if (!isAuthenticated) {
    // Use localStorage progress for unauthenticated users
    const localProgress = getLocalProgress();
    for (const row of localProgress) {
      chapterProgress[row.chapterId] = row.percentComplete;
    }
  }

  const completedCount = Object.values(chapterProgress).filter((v) => v >= 100).length;
  const totalProgress = CHAPTERS.length > 0
    ? Math.round(Object.values(chapterProgress).reduce((s, v) => s + v, 0) / CHAPTERS.length)
    : 0;

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0F" }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b" style={{ background: "rgba(10,10,15,0.98)", backdropFilter: "blur(20px)", borderColor: "rgba(201,168,76,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.03))", border: "1px solid rgba(201,168,76,0.15)" }}>
              ⚖️
            </div>
            <div>
              <div className="text-white font-semibold text-sm font-serif leading-none">RE5 Academy</div>
              <div className="text-white/20 text-[10px] uppercase tracking-wider mt-0.5">Professional Study Platform</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && streak && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.1)" }}>
                <span className="text-xs">🔥</span>
                <span className="text-[#C9A84C] text-[10px] font-semibold">{streak.currentStreak} day streak</span>
              </div>
            )}
            <button
              onClick={() => navigate("/coaching")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
              style={{ background: "rgba(201,168,76,0.06)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.1)" }}
            >
              🎓 Coach
            </button>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {user.avatar && (
                  <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />
                )}
                <span className="text-white/50 text-[10px] hidden sm:inline">{user.name || "User"}</span>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-[10px] text-white/30 hover:text-[#C9A84C] transition-colors uppercase tracking-wider"
              >
                Sign In
              </button>
            )}
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5">Mastery</div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${totalProgress}%`, background: "linear-gradient(90deg, #C9A84C, #E8D5A3)" }} />
                </div>
                <span className="text-white text-[10px] font-bold font-mono">{totalProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="rounded-xl p-8 mb-10 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #111118 0%, #0D0D14 100%)", border: "1px solid rgba(201,168,76,0.08)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 60%)", top: "-20%", right: "10%", filter: "blur(50px)" }} />
          </div>
          <div className="relative z-10">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "#C9A84C" }}>RE5 — Representatives Examination</div>
            <h1 className="font-serif text-4xl font-bold text-white mb-3">
              Your Path to <span className="gold-shimmer">RE5 Success</span>
            </h1>
            <p className="text-white/35 text-sm leading-relaxed max-w-xl mb-8">
              Comprehensive study platform built from the official RE5 Self-Study Guide. Every regulation, every timeframe, every exam tip.
            </p>
            <div className="flex flex-wrap gap-3">
              {[{ icon: "📋", label: "8 Chapters", sub: "Complete syllabus" }, { icon: "🎬", label: "Video Lectures", sub: "With audio" }, { icon: "🧠", label: "60+ Questions", sub: "RE5 exam style" }, { icon: "💡", label: "Key Facts", sub: "Exam-targeted" }].map(({ icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-base">{icon}</span>
                  <div>
                    <div className="text-white/70 text-xs font-semibold">{label}</div>
                    <div className="text-white/20 text-[10px]">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Chapters Complete", value: `${completedCount}/${CHAPTERS.length}`, sub: completedCount === CHAPTERS.length ? "All done" : `${CHAPTERS.length - completedCount} remaining`, color: "#C9A84C" },
            { label: "Topics Available", value: `${CHAPTERS.reduce((s, c) => s + c.topics.length, 0)}`, sub: "Video lectures", color: "#C9A84C" },
            { label: "Practice Questions", value: `${CHAPTERS.reduce((s, c) => s + c.questions.length, 0)}`, sub: "Exam format", color: "#C9A84C" },
            { label: "Overall Progress", value: `${totalProgress}%`, sub: totalProgress >= 80 ? "Exceptional" : totalProgress >= 50 ? "On track" : "Building momentum", color: totalProgress >= 80 ? "#10B981" : "#C9A84C" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="rounded-xl p-5" style={{ background: "linear-gradient(160deg, #111118, #0D0D14)", border: "1px solid rgba(201,168,76,0.06)" }}>
              <div className="font-serif text-2xl font-bold mb-1" style={{ color }}>{value}</div>
              <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">{label}</div>
              <div className="text-white/20 text-[10px]">{sub}</div>
            </div>
          ))}
        </div>

        {/* Chapters Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-white text-xl font-bold">Curriculum</h2>
              <p className="text-white/25 text-xs mt-0.5">Select a chapter to begin your study session</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {CHAPTERS.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} onClick={() => onOpenChapter(chapter)} progress={chapterProgress[chapter.id] || 0} />
            ))}
          </div>
        </div>

        {/* Timeframes */}
        <div className="rounded-xl p-6 mb-8" style={{ background: "linear-gradient(160deg, #111118, #0D0D14)", border: "1px solid rgba(201,168,76,0.06)" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.12)" }}>⏱</div>
            <h3 className="font-serif text-white font-bold text-sm">Critical Timeframes</h3>
            <span className="text-white/15 text-[10px] uppercase tracking-wider ml-1">Quick Reference</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { time: "5 Years", desc: "Record keeping" }, { time: "15 Days", desc: "Notify Registrar" },
              { time: "21 Days", desc: "Representations" }, { time: "60 Days", desc: "Rectify practice" },
              { time: "2 Days", desc: "Cash report FIC" }, { time: "5 Days", desc: "Suspicious report" },
              { time: "6 Years", desc: "Max supervision" }, { time: "1 Month", desc: "Response period" },
            ].map(({ time, desc }) => (
              <div key={time} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="font-serif text-sm font-bold mb-1" style={{ color: "#C9A84C" }}>{time}</div>
                <div className="text-white/30 text-[11px] leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-8">
          <div className="w-8 h-px mx-auto mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)" }} />
          <p className="text-white/10 text-[10px] uppercase tracking-[0.2em]">RE5 Academy &middot; Official SA RE5 Self-Study Guide &middot; September 2018</p>
        </div>
      </div>
    </div>
  );
}

// ─── STUDY ROUTE ───────────────────────────────────────────────────
function StudyRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const chapterId = parseInt(new URLSearchParams(location.search).get("ch") || "1");
  const chapter = CHAPTERS.find((c) => c.id === chapterId);

  if (!chapter) {
    navigate("/");
    return null;
  }

  return <StudyRoom chapter={chapter} onBack={() => navigate("/")} />;
}

// ─── MAIN APP ──────────────────────────────────────────────────────
export default function RE5Academy() {
  const [showIntro, setShowIntro] = useState(() => {
    return !localStorage.getItem("re5-intro-shown");
  });
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem("re5-intro-shown", "true");
    setShowIntro(false);
  };

  const handleOpenChapter = (chapter: Chapter) => {
    navigate(`/study?ch=${chapter.id}`);
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/coaching" element={<Coaching />} />
      <Route path="/study" element={<StudyRoute />} />
      <Route
        path="/"
        element={
          showIntro ? (
            <IntroScreen onStart={handleStart} />
          ) : (
            <Dashboard onOpenChapter={handleOpenChapter} />
          )
        }
      />
      <Route path="*" element={<div />} />
    </Routes>
  );
}
