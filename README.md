# Hashle: Decode the Words

A Wordle-style word game built with React, Vite, and Tailwind CSS.

Hashle began as an elaboration of Scrimba's Hangman game. Hangman introduces some particularities of local state in a React component. The Scrimba Hangman "Assembly"-themed game from the capstone is a fun exercise in Hooks and local state, but not very DRY or modular code.

I built from these patterns and used a brute force approach, then refactored the codebase into more modular/DRY code using some agentic guidance from Cursor tools in helping with patterns. This surfaced a couple of bugs, which I fixed. I spent a while studying the more modular codebase. The monolith component has been refactored into custom Hooks and pure functions to make it easier to continue with testing.

## ✅ Testing

**26/26 unit/component/accessibility tests passing · 2/2 E2E tests passing**

The test suite was set up early, but it went unvalidated for a while — and it turned out to be silently broken: 7 of 18 tests were failing because a required setup file was never actually being loaded, so `@testing-library/jest-dom` matchers didn't exist. Fixing that immediately surfaced a real, previously-invisible accessibility bug (an empty `<h2>` used for a live status announcement — a genuine axe violation). From there: added targeted unit tests for the core duplicate-letter scoring logic (previously zero coverage on the highest-risk function in the app), and built out Playwright from scratch to cross-check that live gameplay scores guesses the same way the verified logic says it should.

Full writeup, including an open bug investigation and a regression scare that turned out to be a test-environment issue (not a real break): **[docs/TESTING.md](./docs/TESTING.md)**.

## Getting Started

```bash
pnpm install
pnpm run dev       # start the dev server
pnpm test          # run the unit/component test suite
pnpm exec playwright test   # run the E2E suite
pnpm run build      # production build
```

## Documentation

- [Testing](./docs/TESTING.md) — current test suite status, what's still open, how to run everything
- [Dependency Upgrades](./docs/DEPENDENCY-UPGRADES.md) — the pnpm and Tailwind CSS 4 migrations
- [Architecture Notes](./docs/ARCHITECTURE.md) — technical debt, backend tradeoffs under consideration, recommended next steps
