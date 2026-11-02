import "server-only";
import { betterAuth, type BetterAuthPlugin } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { API_TOKEN_TTL_SECONDS, AUTH_COOKIE_NAME, signApiToken } from "@/lib/api-token";
import { db } from "@/lib/db";
import { validatePassword } from "@/lib/validation/password";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Mirrors the authenticated session into an HTTPOnly JWT cookie that the Express API
 * verifies. The cookie is minted on sign-in and refreshed on every session check, and
 * removed on sign-out, so JavaScript on the page can never read the token.
 */
const apiTokenCookie = {
  id: "api-token-cookie",
  hooks: {
    after: [
      {
        matcher: () => true,
        handler: createAuthMiddleware(async (ctx) => {
          const cookieOptions = {
            httpOnly: true,
            sameSite: "lax" as const,
            secure: isProduction,
            path: "/",
          };

          if (ctx.path === "/sign-out") {
            ctx.setCookie(AUTH_COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 });
            return;
          }

          const session = ctx.context.session ?? ctx.context.newSession;
          if (!session?.user) return;

          const token = await signApiToken(session.user);
          ctx.setCookie(AUTH_COOKIE_NAME, token, { ...cookieOptions, maxAge: API_TOKEN_TTL_SECONDS });
        }),
      },
    ],
  },
} satisfies BetterAuthPlugin;

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : [],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    useSecureCookies: isProduction,
  },
  hooks: {
    // The same password policy is enforced here so it cannot be bypassed by calling the API directly.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const message = validatePassword(String(ctx.body?.password ?? ""));
      if (message) throw new APIError("BAD_REQUEST", { message });
    }),
  },
  plugins: [apiTokenCookie],
});
