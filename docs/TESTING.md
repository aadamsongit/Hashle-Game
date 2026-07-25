# Testing

## ⚙️ Still Open

- Add unit-level coverage for `addStatusesandClasses` (the live-guess coloring path in `useWordLogic.js`) directly, not just via the one E2E case — it's currently only checked against a single duplicate-letter scenario.
- Reproduce and guard against the reported all-gray-row bug specifically — see the open question below.
- Run axe-core against more states of the app (mid-game, win, loss), not just initial render.
- Prioritize deeper test coverage because Hashle is small enough to serve as a focused testing practice project.
- **TODO: add visuals.** Drop screenshots into `docs/images/` and reference them here: a code screenshot (e.g. the `rebuildStatuses.js` test file or the fix diff), a Playwright console/UI-mode screenshot, and the reported bug screenshot (the all-gray guess row from the open question below). Also worth doing the manual visual smoke test under Tailwind 4 while in there (dark mode, RGB keyboard gradient, tile border colors) — that check was deferred at merge time.

## ✅ Testing Progress (2026-07-25)

Set up Vitest, axe-core, and Playwright originally, but the suites needed review and validation before they meant anything. Here's what that turned up:

- **The existing test suite was silently broken.** `vitest.config.js` only loaded `vitest.setup.js`, never `src/setupTests.js` — so the `@testing-library/jest-dom` matchers (`toHaveAttribute`, etc.) that the accessibility tests depend on were never registered. 7 of 18 tests were failing for that reason alone. Fixed by loading both setup files.
- **That fix immediately surfaced a real accessibility bug**, previously invisible because the test asserting on it was broken too: the game-status announcement was rendered as an `<h2>` that's empty by default (no message until a game is won or lost) — an empty heading is a genuine axe violation, since screen-reader users navigating by heading structure would hit a heading with no text. Fixed by changing it to `<div role="status">`, which is also the more correct element for a transient live-region announcement in the first place. Updated the one existing test that had encoded the wrong assumption — it only checked an `<h2>` existed, never checked it had content, which is why it never caught this.
- **Added unit tests for `rebuildStatuses.js`** (`src/utils/rebuildStatuses.test.js`) — the core duplicate-letter scoring logic, previously untested. 8 targeted cases: exact match, no match, a duplicate letter exceeding the target word's count (the classic Wordle-clone bug), green-before-yellow pass ordering, and keyboard-key-status not downgrading across guesses. All pass — the algorithm was correct, it just had zero coverage proving it.
- **Playwright was half set up.** No `playwright.config.js` existed despite the dependency being installed, and the one E2E spec pointed at the wrong port with an unfinished assertion. Added the config, fixed the spec, and added `duplicate-letters.spec.js` — an E2E test that submits a real duplicate-letter guess through the UI and checks it scores the same way the (now-verified) `rebuildStatuses` logic says it should. This matters because there are two independent implementations of the same coloring algorithm in this codebase: `rebuildStatuses.js` (only used when the board reloads from localStorage) and `addStatusesandClasses` inside `useWordLogic.js` (used for every live guess — never tested before this). The E2E test confirmed they agree on this case.
- **Open question, not yet resolved:** a user reported an all-gray guess row that shouldn't have been possible given the word list. The live-vs-rebuilt implementation divergence is now ruled out as the cause for the tested case. The stronger remaining hypothesis is `getDayIndex()` computing the daily word boundary from local `Date.now()` with no timezone/day-rollover defensiveness — a classic "happened once, near midnight, never reproduced" bug shape. Not confirmed yet.

Current state: 26/26 unit/component/a11y tests passing, 2/2 E2E tests passing.

## Running the suites

```bash
pnpm test              # unit/component tests, run once
pnpm run test:watch    # unit/component tests, watch mode
npx vitest --ui        # interactive UI for stepping through unit tests
pnpm exec playwright test          # E2E, headless
pnpm exec playwright test --ui     # E2E, interactive step-through
```
