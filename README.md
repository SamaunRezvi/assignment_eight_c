# StudioSpace

**Peer-to-peer marketplace for creative workspaces and production studios.**
Hosts list photo studios, film stages, podcast lounges, music suites and art workshops; creators discover, filter and book them by the hour.

- **Live site:** _add the deployed URL here after deployment_
- **API repository:** https://github.com/SamaunRezvi/assignment_eight_s
- **Client repository:** https://github.com/SamaunRezvi/assignment_eight_c

## Features

- **Discover and filter** studios by keyword, category, city, price range and capacity, with sorting, pagination and URL-synced filters
- **Hero slider, featured studios, category shortcuts**, a booking walkthrough and host guarantees on the home page
- **Secure authentication**: email/password and Google sign-in with Better Auth, enforced password rules, and an HTTPOnly JWT cookie that the API verifies (unauthorised requests get `401`)
- **Full studio CRUD**: add, edit and delete listings with image upload, gallery, amenity tags and ownership checks, plus delete confirmation modals
- **Smart bookings**: live price breakdown, availability hints, double-booking prevention against confirmed slots, host confirm/decline/complete flow and guest cancellation
- **PDF receipts** for confirmed bookings, **saved studios wishlist**, reviews with rating aggregation and a host/guest **dashboard** with revenue chart
- **Light and dark themes**, fully responsive layout, branded skeleton loaders, empty states, custom 404 and toast notifications for every action

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Swiper, Recharts, Motion |
| Data and forms | TanStack Query, React Hook Form, Zod, Sonner toasts |
| Auth | Better Auth with the MongoDB adapter, HS256 JWT in an HTTPOnly cookie |
| Backend | Express 5, TypeScript, MongoDB, Zod, jose, PDFKit |

## Examiner test credentials

Create an account on the Register page, or use the account below if it has been provisioned on the live site.

| Field | Value |
| --- | --- |
| Email | `examiner@studiospace.test` |
| Password | `Examiner123` |

You can also sign in with Google. A second account is handy for trying the host/guest flow: one account lists a studio and the other books it.

## Local setup

Prerequisites: Node.js 20+, a MongoDB Atlas cluster (replica set, so transactions work), the [API](https://github.com/SamaunRezvi/assignment_eight_s) running locally.

```bash
git clone https://github.com/SamaunRezvi/assignment_eight_c.git
cd assignment_eight_c
npm install
cp .env.example .env.local     # fill in the values
npm run dev                    # http://localhost:3000
```

Environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` | Public site URL and a random 32+ character secret |
| `MONGODB_URI`, `MONGODB_DB` | Same database the API uses |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth (redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google`) |
| `API_URL` | Base URL of the Express API (requests to `/api/*` are proxied there) |
| `API_JWT_SECRET` | Must equal the API's `JWT_SECRET` |

Seed demo studios from the API repository with `npm run seed`.

## Architecture notes

- Requests to `/api/*` are proxied to the Express API through a Next.js fallback rewrite, so the auth cookie stays first-party and no CORS is needed. `/api/auth/*` is handled by Better Auth.
- A Better Auth plugin mints the HTTPOnly API token on sign-in and session refresh and clears it on sign-out. The API client retries once after refreshing the session if a token has lapsed.
- Private pages are gated by a `proxy.ts` cookie check, then by a client guard that waits for the session, so reloading a private route never bounces a signed-in user to login.

## Scripts

`npm run dev` · `npm run build` · `npm start` · `npm run lint`
