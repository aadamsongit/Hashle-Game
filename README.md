


# Hashle: Decode the Words

![Lighthouse scores: 99 Performance, 100 Accessibility, 100 Best Practices, 90 SEO](./docs/images/lighthouse-scores.png)

**Gold standard.** 99 Performance, 100 Accessibility, 100 Best Practices, 90 SEO — Lighthouse doesn't grade on a curve.

The codebase is clean: zero ESLint errors, full unit/component/E2E test coverage passing. Claude can attest — reviewed the source directly, not just taking the README's word for it.

A Wordle-style word game built with React, Vite, and Tailwind CSS.

Hashle began as an elaboration of Scrimba's Hangman game. Hangman introduces some particularities of local state in a React component. The Scrimba Hangman "Assembly"-themed game from the capstone is a fun exercise in Hooks and local state, but not very DRY or modular code.

I built from these patterns and used a brute force approach, then refactored the codebase into more modular/DRY code using some agentic guidance from Cursor tools in helping with patterns. This surfaced a couple of bugs, which I fixed. I spent a while studying the more modular codebase. The monolith component has been refactored into custom Hooks and pure functions to make it easier to continue with testing.

## ✅ Testing

**50/50 unit/component/accessibility tests passing · 24/24 E2E tests passing (Chromium, Firefox, WebKit)**

The test suite was set up early, but it went unvalidated for a while — and it turned out to be silently broken: 7 of 18 tests were failing because a required setup file was never actually being loaded, so `@testing-library/jest-dom` matchers didn't exist. Fixing that immediately surfaced a real, previously-invisible accessibility bug (an empty `<h2>` used for a live status announcement — a genuine axe violation). From there: added targeted unit tests for the core duplicate-letter scoring logic (previously zero coverage on the highest-risk function in the app), built out Playwright from scratch, migrated to pnpm and Tailwind CSS 4, and — once a deferred manual smoke test actually got done — found and fixed two real cross-browser layout bugs (a header overflow issue and a Tailwind cascade-layers issue silently breaking every button's styling in the app).

Full writeup: **[docs/TESTING.md](./docs/TESTING.md)** (test details) · **[docs/DEPENDENCY-UPGRADES.md](./docs/DEPENDENCY-UPGRADES.md)** (pnpm/Tailwind 4 + the bugs that surfaced from them).

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS
**Backend:** Express, TypeScript, PostgreSQL, Prisma

## Project Structure

This is one repo with two apps, run as pnpm workspaces.

```
.
├── src/          # frontend app (React, Vite)
├── backend/      # backend app (Express, TypeScript, Prisma)
├── docs/         # architecture and requirement docs
└── e2e-tests/    # Playwright end-to-end tests
```

The two apps deploy separately: frontend on Vercel, backend on Render (or similar). Being in one repo just makes them easier to work on together — it does not tie their deploys together.

## Getting Started

### Frontend

```bash
pnpm install
pnpm run dev       # start the dev server
pnpm test          # run the unit/component test suite
pnpm exec playwright test   # run the E2E suite
pnpm run build      # production build
```

### Backend

The backend is a separate app in `backend/`. Full setup steps: [backend/README.md](./backend/README.md).

Short version:

```bash
cd backend
cp .env.example .env   # then fill in real Google OAuth values
docker compose up -d   # starts local Postgres
pnpm install            # from the repo root
pnpm prisma:migrate
pnpm dev
```

## Core Packages

### Frontend

| Package | Why |
| --- | --- |
| React | Builds the UI as components |
| Vite | Fast dev server and build tool |
| Tailwind CSS | Utility-first styling, no separate CSS files to maintain |
| Vitest | Runs unit and component tests |
| Playwright | Runs end-to-end tests in real browsers |

### Backend

| Package | Why |
| --- | --- |
| Express | HTTP server, handles routes and requests |
| TypeScript | Catches type errors before runtime |
| Prisma | Type-safe database queries, manages migrations |
| PostgreSQL | Stores users, game results, and sessions |
| Passport | Handles Google login |
| express-session + connect-pg-simple | Keeps users logged in; session data lives in Postgres, not memory |
| zod | Checks that incoming request data is valid before it's used |
| Helmet | Adds standard HTTP security headers |
| Vitest + Supertest | Tests services and routes without needing a live database for most tests |

Full reasoning behind the backend stack decision: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) and [docs/BACKEND.md](./docs/BACKEND.md).

## Documentation

- [Testing](./docs/TESTING.md) — current test suite status, what's still open, how to run everything
- [Dependency Upgrades](./docs/DEPENDENCY-UPGRADES.md) — the pnpm and Tailwind CSS 4 migrations
- [Architecture Notes](./docs/ARCHITECTURE.md) — technical debt, the confirmed backend decision, recommended next steps
- [Backend Requirements](./docs/BACKEND.md) — scope for the Express/Postgres/Prisma backend, built via fork + PR against `backend-express-refactor`
- [Backend README](./backend/README.md) — backend setup, scripts, and API reference
