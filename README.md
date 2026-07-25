Updated and condensed notes as of 2026:

Hashle began as an elaboration of Scrimba's Hangman game. Hangman introduces some particularities of local state in a React component. The Scrimba Hangman "Assembly"-themed game from the capstone is a fun exercise in Hooks and local state, but not very DRY or modular code. 

I built from these patterns and used a brute force approach, then refactored the codebase into more modular/DRY code using some agentic guidance from Cursor tools in helping with patterns. This surfaced a couple of bugs, which I fixed. I spent a while studying the more modular codebase. The monolith component has been refactored into custom Hooks and pure functions to make it easier to continue with testing. 

I set up Vitest, axe-core for accessibility testing, and Playwright for end-to-end testing. That infrastructure has since been reviewed, fixed where it was silently broken, and expanded — see Testing Progress below for what that turned up. The stack is also now on pnpm and Tailwind CSS 4 (see Dependency Upgrades below).

---

## ⚙️ Technical Debt & Future Improvements

- Review and validate the existing Vitest, Playwright, and axe-core test suites.
- Expand regression and end-to-end test coverage around gameplay and state transitions.
- Continue validating responsive behavior across browsers and devices, with particular attention to Android.
- Consider a small backend. Maybe a simple auth with a basic login and OAuth. Prefer Google or some simple login flow. 
- Introduce an authentication layer with persistent user data. Anonymous users can continue using localStorage, while authenticated users store progress, streaks, and achievements in a database.
- Weigh trade-off in BaaS for data vs. maybe simple Express.js setup with perhaps light SQL or NoSQL or Postgres.

 ## ⚙️ Architectural Tradeoffs

Backend-as-a-Service

Supabase reduces the amount of backend infrastructure you need to build, making it an attractive option for prototypes and small applications. In exchange, you accept platform-specific abstractions and operational behavior. For example, projects on the free tier can become inactive after periods of inactivity, which may require additional handling for demos or open source projects. Supabase also provides built-in authentication and Row-Level Security (RLS), although those policies still need to be configured rather than being automatically enabled for every use case.

Custom Backend

Building the backend with PostgreSQL, Prisma, and TypeScript requires more setup but provides greater control over the data model and application architecture. Prisma's schema-first approach and generated TypeScript client encourage explicit modeling and type-safe database access, making it a good fit for strengthening backend fundamentals.

Express.js pairs naturally with a React + Vite application as a lightweight backend. One consideration is that much of the Express ecosystem still uses CommonJS examples, whereas I've become accustomed to ES Modules and TypeScript-first workflows.

Would I migrate to Next.js?

Hashle could certainly be migrated to Next.js, but I don't think it's an automatic improvement. The application was designed around React and Vite, and Express is a natural companion for that architecture.

## ⚙️ Recommended Approach

Prioritize the testing layer before adding backend/data features. The codebase has already been refactored toward modularity, making it a better candidate for unit, E2E, and accessibility testing.

Next.js becomes more compelling if Hashle grows to include authenticated users, server-rendered data, or more sophisticated persistence. Its App Router, Server Actions, authentication ecosystem, and TypeScript-first workflow provide strong patterns for data-driven applications, but they may introduce unnecessary complexity for a relatively small game.

Post-deployment, some behavioral bugs were reported. The next step is to reproduce and guard against those bugs with a combination of unit tests and E2E tests. Accessibility should also be validated with axe-core.

## ⚙️ Still Open on Testing

- Add unit-level coverage for `addStatusesandClasses` (the live-guess coloring path in `useWordLogic.js`) directly, not just via the one E2E case — it's currently only checked against a single duplicate-letter scenario.
- Reproduce and guard against the reported all-gray-row bug specifically — see the open question in Testing Progress below.
- Run axe-core against more states of the app (mid-game, win, loss), not just initial render.
- Prioritize deeper test coverage because Hashle is small enough to serve as a focused testing practice project.

## ✅ Testing Progress (2026-07-25)

Followed through on the plan above. What actually turned up:

- **The existing test suite was silently broken.** `vitest.config.js` only loaded `vitest.setup.js`, never `src/setupTests.js` — so the `@testing-library/jest-dom` matchers (`toHaveAttribute`, etc.) that the accessibility tests depend on were never registered. 7 of 18 tests were failing for that reason alone. Fixed by loading both setup files.
- **That fix immediately surfaced a real accessibility bug**, previously invisible because the test asserting on it was broken too: the game-status announcement was rendered as an `<h2>` that's empty by default (no message until a game is won or lost) — an empty heading is a genuine axe violation, since screen-reader users navigating by heading structure would hit a heading with no text. Fixed by changing it to `<div role="status">`, which is also the more correct element for a transient live-region announcement in the first place. Updated the one existing test that had encoded the wrong assumption — it only checked an `<h2>` existed, never checked it had content, which is why it never caught this.
- **Added unit tests for `rebuildStatuses.js`** (`src/utils/rebuildStatuses.test.js`) — the core duplicate-letter scoring logic, previously untested. 8 targeted cases: exact match, no match, a duplicate letter exceeding the target word's count (the classic Wordle-clone bug), green-before-yellow pass ordering, and keyboard-key-status not downgrading across guesses. All pass — the algorithm was correct, it just had zero coverage proving it.
- **Playwright was half set up.** No `playwright.config.js` existed despite the dependency being installed, and the one E2E spec pointed at the wrong port with an unfinished assertion. Added the config, fixed the spec, and added `duplicate-letters.spec.js` — an E2E test that submits a real duplicate-letter guess through the UI and checks it scores the same way the (now-verified) `rebuildStatuses` logic says it should. This matters because there are two independent implementations of the same coloring algorithm in this codebase: `rebuildStatuses.js` (only used when the board reloads from localStorage) and `addStatusesandClasses` inside `useWordLogic.js` (used for every live guess — never tested before this). The E2E test confirmed they agree on this case.
- **Open question, not yet resolved:** a user reported an all-gray guess row that shouldn't have been possible given the word list. The live-vs-rebuilt implementation divergence is now ruled out as the cause for the tested case. The stronger remaining hypothesis is `getDayIndex()` computing the daily word boundary from local `Date.now()` with no timezone/day-rollover defensiveness — a classic "happened once, near midnight, never reproduced" bug shape. Not confirmed yet.

Current state: 26/26 unit/component/a11y tests passing, 2/2 E2E tests passing.

## 📦 Dependency Upgrades (2026-07-25)

Migrated off npm and Tailwind CSS 3, on a dedicated branch, verifying with the full test suite after each step rather than as one large change.

- **npm → pnpm.** Used `pnpm import` to preserve exact resolved versions from `package-lock.json` rather than letting a fresh install re-resolve anything. esbuild's postinstall script was being silently blocked by pnpm's build-script approval gate — approved via `pnpm-workspace.yaml` so a fresh clone works without a manual interactive step.
- **Tailwind CSS 3 → 4.** Used the official `@tailwindcss/upgrade` codemod rather than hand-editing config. It converted the `@tailwind` directives to a single `@import`, and linked the existing `tailwind.config.js` via `@config` compat mode (it didn't auto-convert to native CSS `@theme` syntax — that's a possible later follow-up, not required right now). Manually updated `postcss.config.mjs` to `@tailwindcss/postcss` (the codemod can't touch files with dynamic JS in them) and removed `autoprefixer`, since v4's Lightning CSS engine handles vendor prefixing internally.
- **Regression scare, investigated and resolved:** right after the Tailwind 4 change, both E2E tests failed — looked like a real break. Root cause turned out to be unrelated to Tailwind: a stale dev server from earlier in the session was still bound to port 5173, and Playwright's `reuseExistingServer` config was silently testing against that old instance instead of the current code. Killed the stray process, fixed `playwright.config.js`'s `webServer` command to use `pnpm run dev`, and confirmed clean against a fresh server. Worth noting given a previous agentic refactor of this project broke a live deployment — this time the test suite caught the apparent break immediately, and it got root-caused correctly instead of blamed on the actual change.

