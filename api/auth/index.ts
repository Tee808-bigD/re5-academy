import * as cookie from "cookie";
import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { getDb } from "../queries/connection";
import { users } from "@db/schema";
import { Errors } from "@contracts/errors";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "../lib/cookies";
import { signSessionToken, verifySessionToken } from "./session";
import { env } from "../lib/env";

const JWT_SECRET = env.jwtSecret;

/**
 * Authenticate a request by reading the session cookie.
 * Returns the user record or throws if the token is invalid.
 */
export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) {
    throw Errors.forbidden("Authentication required. Please sign in.");
  }
  const claim = await verifySessionToken(token, JWT_SECRET);
  if (!claim) {
    throw Errors.forbidden("Session expired. Please sign in again.");
  }
  const db = getDb();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, claim.userId))
    .limit(1);
  if (!rows.length) {
    throw Errors.forbidden("User not found. Please sign in again.");
  }
  return rows[0];
}

/**
 * Handle login: find or create a user by email, issue a session cookie.
 * Returns the redirect response.
 */
export async function handleLogin(c: Context) {
  try {
    const body = await c.req.json<{ email: string; name?: string }>();
    const email = body?.email?.trim().toLowerCase();
    const name = body?.name?.trim() || email?.split("@")[0] || "Student";

    if (!email || !email.includes("@")) {
      return c.json({ error: "A valid email address is required." }, 400);
    }

    const db = getDb();

    // Find or create user
    let user = (
      await db.select().from(users).where(eq(users.email, email)).limit(1)
    ).at(0);

    if (user) {
      // Update last sign-in
      await db
        .update(users)
        .set({ lastSignInAt: new Date(), name: name || user.name })
        .where(eq(users.id, user.id));
    } else {
      // Create new user
      await db.insert(users).values({ email, name, lastSignInAt: new Date() });
      user = (
        await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)
      ).at(0);
    }

    if (!user) {
      return c.json({ error: "Failed to create user account." }, 500);
    }

    // Issue session token
    const token = await signSessionToken(
      { userId: user.id, email: user.email!, role: user.role },
      JWT_SECRET,
    );

    const cookieOpts = getSessionCookieOptions(c.req.raw.headers);
    setCookie(c, Session.cookieName, token, {
      ...cookieOpts,
      maxAge: Session.maxAgeMs / 1000,
    });

    return c.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("[auth] Login failed:", error);
    return c.json({ error: "Login failed. Please try again." }, 500);
  }
}
