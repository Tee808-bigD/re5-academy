import { useState, useRef, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

export default function Coaching() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    navigate("/login");
  }

  // Get or create session
  const { data: sessions } = trpc.coaching.sessions.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createSession = trpc.coaching.createSession.useMutation({
    onSuccess: (session) => {
      setSessionId(session.id);
      utils.coaching.sessions.invalidate();
    },
  });

  const { data: messages } = trpc.coaching.messages.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId },
  );

  const sendMessage = trpc.coaching.sendMessage.useMutation({
    onSuccess: () => {
      utils.coaching.messages.invalidate({ sessionId: sessionId! });
      setIsTyping(false);
    },
    onError: () => setIsTyping(false),
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-create session on first load
  useEffect(() => {
    if (isAuthenticated && sessions && sessions.length === 0 && !sessionId && !createSession.isPending) {
      createSession.mutate({});
    } else if (sessions && sessions.length > 0 && !sessionId) {
      setSessionId(sessions[0].id);
    }
  }, [sessions, isAuthenticated]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || sendMessage.isPending) return;
    setIsTyping(true);
    sendMessage.mutate({ sessionId, content: input.trim() });
    setInput("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0A0F" }}>
        <div className="text-[#C9A84C] text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0A0A0F" }}>
      {/* Header */}
      <div
        className="border-b shrink-0"
        style={{ borderColor: "rgba(201,168,76,0.06)", background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="text-white/30 hover:text-[#C9A84C] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
              </svg>
            </button>
            <div className="w-px h-4" style={{ background: "rgba(201,168,76,0.15)" }} />
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}
            >
              🎓
            </div>
            <div>
              <div className="text-white/80 text-xs font-semibold font-serif">Study Coach</div>
              <div className="text-white/20 text-[10px]">Personalized RE5 guidance</div>
            </div>
          </div>
          {user?.name && (
            <div className="text-white/30 text-[10px]">{user.name}</div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
          {!messages?.length && (
            <div className="text-center py-20">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-xl mx-auto mb-4"
                style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}
              >
                🎓
              </div>
              <div className="font-serif text-white text-lg font-bold mb-2">Your Personal RE5 Coach</div>
              <div className="text-white/30 text-sm max-w-sm mx-auto leading-relaxed">
                Ask about study plans, exam strategies, timeframes, or specific chapters.
                I'll tailor my guidance to your progress.
              </div>
            </div>
          )}

          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  msg.role === "user" ? "ml-8" : "mr-8"
                }`}
                style={
                  msg.role === "user"
                    ? {
                        background: "rgba(201,168,76,0.1)",
                        border: "1px solid rgba(201,168,76,0.15)",
                      }
                    : {
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.04)",
                      }
                }
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5"
                  style={{ color: msg.role === "user" ? "#C9A84C" : "rgba(255,255,255,0.3)" }}
                >
                  {msg.role === "user" ? "You" : "Coach"}
                </div>
                <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div
                className="mr-8 rounded-lg px-4 py-3"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="border-t shrink-0"
        style={{ borderColor: "rgba(201,168,76,0.06)", background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)" }}
      >
        <form onSubmit={handleSend} className="max-w-3xl mx-auto px-6 py-3 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 2000))}
            placeholder="Ask about study plans, exam tips, timeframes..."
            className="flex-1 bg-transparent text-white text-sm placeholder:text-white/15 outline-none"
            disabled={sendMessage.isPending}
          />
          <button
            type="submit"
            disabled={!input.trim() || sendMessage.isPending || !sessionId}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: input.trim()
                ? "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08))"
                : "rgba(255,255,255,0.03)",
              color: input.trim() ? "#E8D5A3" : "rgba(255,255,255,0.2)",
              border: `1px solid ${input.trim() ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.04)"}`,
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
