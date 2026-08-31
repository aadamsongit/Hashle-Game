# Backend Requirements

The note promised to [@AyomideAsaniyan](https://github.com/AyomideAsaniyan) before starting the backend. Stack is confirmed: **Express, TypeScript, ESM, PostgreSQL, Prisma.** Work happens via fork + PR against [`backend-express-refactor`](https://github.com/aadamsongit/Hashle-Game/tree/backend-express-refactor) (kept current with `main`).

## What stays on the frontend

- **Daily word selection.** Already fully deterministic and client-side (`src/utils/getRandomWord.js`): a fixed seed shuffles the public word list, and the day index picks from it. Every player computes the same word independently -- there's no "ask the server what today's word is" step, and no reason to add one. The backend never needs to know or validate the word.
- **Guess validation and board state.** `gameReducer.ts` and the guess-length/word-list checks in the component stay exactly as they are. The backend doesn't referee gameplay, only persists its outcome.
- **Anonymous play via `localStorage`.** Unauthenticated users keep working exactly as today (`dailyResults` keyed by day index, in `src/utils/gameHelpers.js`). The backend is additive, not a replacement for this path.

## What moves to the backend

- **Auth.** Turns anonymous play into an identified user.
- **Persisting daily results per user**, replacing (for authenticated users) what `saveToLocalStorage` currently does client-only.
- **Deriving streaks/stats** from that history -- not something `localStorage` can do across devices, which is the actual reason to have a backend at all.
- **Leaderboard** -- aggregating results across users. This is the one piece with no existing frontend equivalent to crib from; see open questions below.

## Data model (starting point, not final)

Mirrors the shape `dailyResults` already uses client-side, so the migration story stays simple:

```
User
  id
  email (or provider id, depending on auth choice -- see open questions)
  created_at

DailyResult
  id
  user_id       -> User
  day_index      // same definition as getDayIndex() on the frontend
  outcome        // "win" | "loss" | "in_progress" -- matches Outcome type in gameReducer.ts
  guesses        // number of rows used -- needed for any per-game scoring
  completed_at
```

Streaks are a derived read (consecutive `day_index` entries with `outcome: "win"`), not a separately-stored counter that could drift out of sync with the underlying results -- same reasoning the frontend already applies to `getDisabledLetters` in `gameReducer.ts`.

## API surface (starting point)

- `POST /auth/...` -- shape depends on the auth provider decision below.
- `POST /results` -- submit the authenticated user's result for a given `day_index`. Idempotent per user+day (a user can only have one result per day).
- `GET /me/stats` -- current streak, longest streak, win rate.
- `GET /leaderboard` -- see open questions on ranking.

## Result integrity (resolved 2026-08-31, see PR #5)

The backend does not referee gameplay -- it doesn't know the day's word and doesn't replay a user's guesses server-side, so `POST /results` and `POST /import` trust the client's reported `outcome` and `guesses` as-is. This was a deliberate decision from early on, not an oversight: the full fix (deriving each day's answer and validating guesses against it server-side) is real work and would reverse the original choice not to have the backend referee gameplay, which isn't judged worth the complexity for a casual/social leaderboard right now.

Two cheap safeguards ship instead, as the accepted middle ground -- not a fix for a determined cheater, just closing the most trivial cases:

- `POST /results` and `POST /import` reject any `dayIndex` greater than the server's own computed current day index (same epoch/day-length math as the frontend's `getDayIndex()` in `src/utils/gameHelpers.js`) -- a submission can't claim a day that hasn't happened yet.
- `POST /results` is rate-limited per authenticated user (10 requests/hour) -- one real result per day is the actual usage pattern, so this only bites a script hammering the endpoint, not a real player.

If the leaderboard's integrity needs to be stronger than this later, revisit deriving/validating the actual answer server-side -- that's the real fix, this is the documented interim position.

## Open questions -- for you and Ayomide to settle, not decided here

- **Auth provider and session strategy.** `ARCHITECTURE.md` has a standing preference for Google OAuth, but that was never confirmed in the actual conversation with Ayomide -- worth explicitly re-confirming rather than assuming it's locked. Also undecided: session cookies vs. JWT, and whether Express owns sessions directly or defers to something like Passport/Auth.js.
- **Leaderboard ranking metric.** Win streak? Total wins? Average guesses-to-win? Time-boxed (today's leaderboard) vs. all-time? This is a real product decision, not an engineering one -- needs your call before Ayomide builds against it.
- **Anonymous-to-authenticated migration.** When a `localStorage`-only player signs in for the first time, does their existing local history get imported into the backend, or does authenticated tracking just start fresh from that point? Affects whether `POST /results` needs to accept a batch/backfill, not just today's single result.
- **Same-repo vs. separate deploy.** The Express app's own repo/deploy topology (same repo different directory vs. fully separate service) isn't settled in the chat log -- confirm with Ayomide before he picks a project layout.
