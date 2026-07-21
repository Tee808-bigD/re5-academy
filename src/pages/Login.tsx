import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
        credentials: "include",
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      // Invalidate all queries to refresh user state
      await utils.invalidate();
      navigate("/");
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0A0A0F" }}
    >
      <div className="w-full max-w-sm mx-4">
        <Card
          className="border overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #111118, #0D0D14)",
            borderColor: "rgba(201,168,76,0.12)",
          }}
        >
          <div
            className="h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }}
          />
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mx-auto mb-3"
              style={{
                background: "linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.03))",
                border: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              ⚖️
            </div>
            <CardTitle className="text-white font-serif">Sign In</CardTitle>
            <CardDescription className="text-white/30 text-xs">
              Enter your email to start or continue studying
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                  Your name <span className="text-white/20">(optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="Student"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>

              {error && (
                <div
                  className="text-xs text-red-400 p-3 rounded-lg"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full font-semibold"
                style={{
                  background: !email ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #C9A84C, #B8962E)",
                  color: !email ? "rgba(255,255,255,0.3)" : "#0A0A0F",
                  border: "none",
                }}
              >
                {loading ? "Signing in..." : "Continue Studying"}
              </Button>

              <p className="text-center text-white/15 text-[10px]">
                No password needed &middot; Free for all students
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
