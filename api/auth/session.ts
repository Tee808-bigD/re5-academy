import * as jose from "jose";

const JWT_ALG = "HS256";

export interface SessionPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Sign a JWT session token for the given payload.
 * Uses JWT_SECRET from env (falls back to a dev-only default).
 */
export async function signSessionToken(
  payload: SessionPayload,
  secret: string,
): Promise<string> {
  const encoded = new TextEncoder().encode(secret);
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("365 days")
    .sign(encoded);
}

/**
 * Verify a JWT session token and return the decoded payload,
 * or null if the token is invalid/expired.
 */
export async function verifySessionToken(
  token: string,
  secret: string,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const encoded = new TextEncoder().encode(secret);
    const { payload } = await jose.jwtVerify(token, encoded, {
      algorithms: [JWT_ALG],
    });
    const { userId, email, role } = payload as unknown as SessionPayload;
    if (!userId || !email) {
      console.warn("[session] JWT payload missing required fields");
      return null;
    }
    return { userId, email, role: role || "user" };
  } catch (error) {
    console.warn("[session] JWT verification failed:", (error as Error)?.message);
    return null;
  }
}
