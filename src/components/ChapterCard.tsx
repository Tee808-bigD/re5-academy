import type { Chapter } from "../data/chapters";

interface ChapterCardProps {
  chapter: Chapter;
  onClick: () => void;
  progress: number;
}

export default function ChapterCard({ chapter, onClick, progress }: ChapterCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl overflow-hidden transition-all duration-300 group"
      style={{
        background: "linear-gradient(160deg, #111118 0%, #0D0D14 100%)",
        border: "1px solid rgba(201,168,76,0.07)",
      }}
    >
      {/* Gold accent top line */}
      <div className="h-[2px] relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${chapter.color}, ${chapter.color}88, transparent)`,
            opacity: 0.6,
          }}
        />
      </div>

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
            style={{
              background: `${chapter.color}15`,
              border: `1px solid ${chapter.color}30`,
            }}
          >
            {chapter.icon}
          </div>
          <div
            className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-md"
            style={{
              background: "rgba(201,168,76,0.08)",
              color: "#C9A84C",
              border: "1px solid rgba(201,168,76,0.12)",
            }}
          >
            Ch. {chapter.id}
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-serif text-white text-[15px] leading-snug mb-2 group-hover:text-[#E8D5A3] transition-colors duration-300"
        >
          {chapter.title}
        </h3>

        {/* Description */}
        <p className="text-white/35 text-xs leading-relaxed mb-4 line-clamp-2">
          {chapter.description}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-between text-[11px] mb-3">
          <span className="text-white/30">
            {chapter.topics.length} topics &middot; {chapter.questions.length} questions
          </span>
          <span
            className="font-semibold"
            style={{ color: progress >= 100 ? "#10B981" : "#C9A84C" }}
          >
            {progress}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: "3px", background: "rgba(255,255,255,0.04)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background:
                progress >= 100
                  ? "linear-gradient(90deg, #10B981, #34D399)"
                  : "linear-gradient(90deg, #C9A84C, #E8D5A3)",
            }}
          />
        </div>
      </div>
    </button>
  );
}
