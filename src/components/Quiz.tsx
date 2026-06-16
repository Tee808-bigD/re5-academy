import { useState } from "react";
import type { Chapter } from "../data/chapters";

interface QuizProps {
  chapter: Chapter;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export default function Quiz({ chapter, onClose, onComplete }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const q = chapter.questions[current];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === q.correct;
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current < chapter.questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  const pct = Math.round((score / chapter.questions.length) * 100);

  if (finished) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center fade-in"
        style={{ background: "rgba(10,10,15,0.96)", backdropFilter: "blur(10px)" }}
      >
        <div
          className="w-full max-w-md mx-4 rounded-xl overflow-hidden scale-in"
          style={{
            background: "linear-gradient(160deg, #111118, #0D0D14)",
            border: "1px solid rgba(201,168,76,0.12)",
          }}
        >
          {/* Gold top line */}
          <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />

          <div className="p-8 text-center">
            {/* Trophy or icon */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
              style={{
                background: pct >= 80 ? "rgba(16,185,129,0.1)" : pct >= 60 ? "rgba(201,168,76,0.1)" : "rgba(239,68,68,0.1)",
                border: `1px solid ${pct >= 80 ? "rgba(16,185,129,0.3)" : pct >= 60 ? "rgba(201,168,76,0.3)" : "rgba(239,68,68,0.3)"}`,
              }}
            >
              {pct >= 80 ? "🏆" : pct >= 60 ? "🥇" : "📚"}
            </div>

            <div className="font-serif text-3xl font-bold text-white mb-2">
              {pct >= 80 ? "Outstanding" : pct >= 60 ? "Well Done" : "Keep Building"}
            </div>
            <div className="text-white/40 text-sm mb-8">
              {score} of {chapter.questions.length} correct ({pct}%)
            </div>

            {/* Score circle */}
            <div className="mb-8">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={pct >= 80 ? "#10B981" : pct >= 60 ? "#C9A84C" : "#EF4444"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${pct * 2.64} 264`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-3xl font-bold text-white">{pct}%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 py-3 rounded-lg font-semibold text-sm text-white/70 transition-all hover:text-white hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Retry Quiz
              </button>
              <button
                onClick={() => { onComplete(pct); onClose(); }}
                className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all btn-premium"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center fade-in"
      style={{ background: "rgba(10,10,15,0.96)", backdropFilter: "blur(10px)" }}
    >
      <div
        className="w-full max-w-2xl mx-4 rounded-xl overflow-hidden scale-in"
        style={{
          background: "linear-gradient(160deg, #111118, #0D0D14)",
          border: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-1 rounded-md"
              style={{ background: "rgba(201,168,76,0.08)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.12)" }}
            >
              Assessment
            </div>
            <span className="text-white/30 text-xs">
              {current + 1} / {chapter.questions.length}
            </span>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors text-lg">✕</button>
        </div>

        <div className="p-6">
          {/* Progress bar */}
          <div className="w-full rounded-full overflow-hidden mb-8" style={{ height: "3px", background: "rgba(255,255,255,0.04)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((current) / chapter.questions.length) * 100}%`,
                background: "linear-gradient(90deg, #C9A84C, #E8D5A3)",
              }}
            />
          </div>

          {/* Question */}
          <h3 className="font-serif text-white text-lg mb-6 leading-relaxed">
            {q.q}
          </h3>

          {/* Options */}
          <div className="space-y-2.5 mb-6">
            {q.opts.map((opt, i) => {
              let bg = "transparent";
              let border = "rgba(255,255,255,0.06)";
              let textColor = "text-white/70";
              let letterBg = "rgba(255,255,255,0.05)";

              if (answered) {
                if (i === q.correct) {
                  bg = "rgba(16,185,129,0.08)";
                  border = "rgba(16,185,129,0.3)";
                  textColor = "text-emerald-300";
                  letterBg = "rgba(16,185,129,0.15)";
                } else if (i === selected && i !== q.correct) {
                  bg = "rgba(239,68,68,0.06)";
                  border = "rgba(239,68,68,0.25)";
                  textColor = "text-red-300";
                  letterBg = "rgba(239,68,68,0.12)";
                }
              } else if (selected === i) {
                bg = "rgba(201,168,76,0.06)";
                border = "rgba(201,168,76,0.3)";
                textColor = "text-white";
                letterBg = "rgba(201,168,76,0.15)";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${textColor}`}
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                      style={{ background: letterBg }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm leading-relaxed">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div
              className="rounded-lg p-4 mb-5 slide-in-right"
              style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.1)" }}
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-2">
                Explanation
              </div>
              <div className="text-white/50 text-sm leading-relaxed">
                {q.exp}
              </div>
            </div>
          )}

          {/* Next button */}
          {answered && (
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-all btn-premium"
            >
              {current < chapter.questions.length - 1 ? "Next Question" : "View Results"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
