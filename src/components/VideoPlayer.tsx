import { useState, useEffect, useRef, useCallback } from "react";
import type { Topic, Chapter } from "../data/chapters";

interface VideoPlayerProps {
  topic: Topic;
  chapter: Chapter;
  onClose: () => void;
}

const AUDIO_TRACKS = [
  "/audio/lecture-ambient-1.mp3",
  "/audio/lecture-ambient-2.mp3",
  "/audio/lecture-ambient-3.mp3",
];

export default function VideoPlayer({ topic, chapter, onClose }: VideoPlayerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showKeyFact, setShowKeyFact] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const totalDuration = topic.slides.length * 15;
  const slide = topic.slides[currentSlide];

  // Pick a deterministic audio track based on topic id
  const audioTrack = AUDIO_TRACKS[topic.id.length % AUDIO_TRACKS.length];

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(audioTrack);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
    audio.addEventListener("canplaythrough", () => setAudioLoaded(true));
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [audioTrack]);

  // Sync audio with play state
  useEffect(() => {
    if (!audioRef.current || !audioLoaded) return;
    if (playing && audioEnabled) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [playing, audioEnabled, audioLoaded]);

  // Reset on topic change
  useEffect(() => {
    setCurrentSlide(0);
    setProgress(0);
    setElapsed(0);
    setPlaying(false);
    setShowKeyFact(false);
  }, [topic]);

  // Playback interval
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          const next = e + 0.1;
          const pct = (next / totalDuration) * 100;
          setProgress(Math.min(pct, 100));
          const slideIdx = Math.floor((next / totalDuration) * topic.slides.length);
          const newSlide = Math.min(slideIdx, topic.slides.length - 1);
          setCurrentSlide(newSlide);
          if (Math.floor(next % 15) === 7) setShowKeyFact(true);
          else if (Math.floor(next % 15) === 0) setShowKeyFact(false);
          if (next >= totalDuration) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setPlaying(false);
            return totalDuration;
          }
          return next;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, topic, totalDuration]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

  const goToSlide = useCallback(
    (n: number) => {
      const clamped = Math.max(0, Math.min(topic.slides.length - 1, n));
      setCurrentSlide(clamped);
      setElapsed((clamped / topic.slides.length) * totalDuration);
    },
    [topic.slides.length, totalDuration]
  );

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center fade-in"
      style={{ background: "rgba(10,10,15,0.96)", backdropFilter: "blur(10px)" }}
    >
      <div
        className="relative w-full max-w-4xl mx-4 rounded-xl overflow-hidden scale-in"
        style={{
          background: "linear-gradient(160deg, #111118, #0D0D14)",
          border: "1px solid rgba(201,168,76,0.1)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.04)",
        }}
      >
        {/* Gold top line */}
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${chapter.color}, transparent)` }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded"
                style={{ background: "rgba(201,168,76,0.08)", color: "#C9A84C" }}
              >
                Ch. {chapter.id}
              </span>
              <span className="text-white/20 text-xs">{chapter.shortTitle}</span>
            </div>
            <div className="text-white font-semibold text-sm font-serif">{topic.title}</div>
          </div>
          <div className="flex items-center gap-3">
            {/* Audio toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
              style={{
                background: audioEnabled ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${audioEnabled ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.06)"}`,
                color: audioEnabled ? "#C9A84C" : "rgba(255,255,255,0.3)",
              }}
            >
              <span>{audioEnabled ? "🔊" : "🔇"}</span>
              <span className="hidden sm:inline">{audioEnabled ? "Audio On" : "Audio Off"}</span>
            </button>
            <button
              onClick={handleClose}
              className="text-white/30 hover:text-white transition-colors text-lg w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Slide Area */}
        <div
          className="relative overflow-hidden"
          style={{
            height: "400px",
            background: `linear-gradient(160deg, ${slide.color}08 0%, transparent 60%), linear-gradient(160deg, #0F0F16, #0A0A10)`,
          }}
        >
          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Floating accent orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute rounded-full"
              style={{
                width: "300px", height: "300px",
                background: `radial-gradient(circle, ${slide.color}10 0%, transparent 70%)`,
                top: "10%", right: "5%",
                filter: "blur(40px)",
              }}
            />
          </div>

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-12 text-center">
            {/* Slide dots */}
            <div className="absolute top-5 right-6 flex gap-1.5">
              {topic.slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === currentSlide ? "20px" : "6px",
                    height: "6px",
                    background: i === currentSlide ? "#C9A84C" : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>

            <div
              className="text-[10px] font-bold uppercase tracking-[0.25em] mb-5"
              style={{ color: "#C9A84C" }}
            >
              Slide {currentSlide + 1} of {topic.slides.length}
            </div>

            <h2 className="font-serif text-3xl font-bold text-white mb-6 leading-tight max-w-2xl">
              {slide.heading}
            </h2>

            <div className="text-white/60 text-sm leading-[1.8] max-w-2xl whitespace-pre-line">
              {slide.body}
            </div>
          </div>

          {/* Key Fact Banner */}
          {showKeyFact && (
            <div
              className="absolute bottom-0 left-0 right-0 px-6 py-4 flex items-start gap-3 slide-in-right"
              style={{
                background: `linear-gradient(0deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.03) 60%, transparent 100%)`,
                borderTop: "1px solid rgba(201,168,76,0.1)",
              }}
            >
              <span className="text-lg mt-0.5 shrink-0">💡</span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-1">
                  Key Exam Fact
                </div>
                <div className="text-white/70 text-sm font-medium">
                  {slide.keyFact}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-t border-white/5">
          {/* Progress bar */}
          <div className="mb-3 rounded-full overflow-hidden" style={{ height: "3px", background: "rgba(255,255,255,0.04)" }}>
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #C9A84C, #E8D5A3)",
              }}
            />
          </div>

          <div className="flex items-center justify-between text-white/25 text-[11px] mb-4 font-mono tracking-wider">
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>

          <div className="flex items-center justify-center gap-5">
            <button
              onClick={() => goToSlide(currentSlide - 1)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="19,20 9,12 19,4" /><line x1="5" y1="19" x2="5" y2="5" />
              </svg>
            </button>

            <button
              onClick={() => setPlaying(!playing)}
              className="w-14 h-14 rounded-full flex items-center justify-center text-[#0A0A0F] font-bold text-lg transition-all"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #B8943F)",
                boxShadow: playing
                  ? "0 4px 20px rgba(201,168,76,0.3)"
                  : "0 4px 20px rgba(201,168,76,0.15)",
              }}
            >
              {playing ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            <button
              onClick={() => goToSlide(currentSlide + 1)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5,4 15,12 5,20" /><line x1="19" y1="5" x2="19" y2="19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
