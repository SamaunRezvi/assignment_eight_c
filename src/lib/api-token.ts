import "server-only";
import { SignJWT } from "jose";

export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "studiospace_token";
export const API_TOKEN_TTL_SECONDS = 60 * 60;

interface TokenUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

/** Signs the short-lived JWT that the Express API verifies from the HTTPOnly cookie. */
export async function signApiToken(user: TokenUser): Promise<string> {
  const secret = process.env.API_JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error("API_JWT_SECRET must be at least 32 characters");

  return new SignJWT({ email: user.email, name: user.name ?? "", picture: user.image ?? "" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer("studiospace")
    .setAudience("studiospace-api")
    .setIssuedAt()
    .setExpirationTime(`${API_TOKEN_TTL_SECONDS}s`)
    .sign(new TextEncoder().encode(secret));
}
