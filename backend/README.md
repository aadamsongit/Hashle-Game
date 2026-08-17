# Hashle Backend

Express, TypeScript, PostgreSQL, and Prisma backend for Hashle. Full
requirements and API design are in [`../docs/BACKEND.md`](../docs/BACKEND.md).

## Setup

1. Copy the env file:
   ```
   cp .env.example .env
   ```
2. Fill in real Google OAuth values in `.env` (from Google Cloud Console).
   Everything else in `.env.example` works as-is for local development.
3. Start local Postgres:
   ```
   docker compose up -d
   ```
4. Install dependencies (from the repo root):
   ```
   pnpm install
   ```
5. Run database migrations:
   ```
   pnpm prisma:migrate
   ```
6. Start the dev server:
   ```
   pnpm dev
   ```

The server runs on `http://localhost:4000` by default.

## Scripts

| Command                  | What it does                          |
| ------------------------- | -------------------------------------- |
| `pnpm dev`                | Start the dev server with auto-reload  |
| `pnpm build`               | Compile TypeScript to `dist/`          |
| `pnpm start`                | Run the compiled build                 |
| `pnpm lint`                 | Run eslint                             |
| `pnpm test`                  | Run the test suite                     |
| `pnpm prisma:generate`        | Regenerate the Prisma client           |
| `pnpm prisma:migrate`          | Create and apply a migration           |

## API docs

Interactive docs (Swagger UI): `http://localhost:4000/docs`
Raw OpenAPI spec (JSON): `http://localhost:4000/openapi.json`

Generated from the same Zod schemas used to validate requests, so the docs
can't drift from what the code actually accepts.

## API

| Method | Path                    | Auth required | Notes                                   |
| ------ | ------------------------ | -------------- | ---------------------------------------- |
| GET    | `/health`                 | No             | Does not touch the database              |
| GET    | `/auth/google`             | No             | Starts the Google OAuth flow             |
| GET    | `/auth/google/callback`     | No             | OAuth redirect target                    |
| POST   | `/auth/logout`               | No             | Ends the session                         |
| GET    | `/auth/me`                     | Yes            | Current logged-in user                   |
| POST   | `/results`                       | Yes            | Submit today's result, one per user/day  |
| GET    | `/me/stats`                       | Yes            | Streaks and win rate                     |
| GET    | `/leaderboard`                      | No             | Ranked by total wins, avg guesses tiebreak |
| POST   | `/import`                             | Yes            | One-time import of local game history    |

## Tests

Tests run without a live database — service tests use fake repositories,
and route tests only cover paths that don't need the database (auth guards,
public routes returning an empty result). Run them with:

```
pnpm test
```
