# Hashle: Decode the Words

A Wordle-style word game built with React, Vite, and Tailwind CSS.

Hashle began as an elaboration of Scrimba's Hangman game. Hangman introduces some particularities of local state in a React component. The Scrimba Hangman "Assembly"-themed game from the capstone is a fun exercise in Hooks and local state, but not very DRY or modular code.

I built from these patterns and used a brute force approach, then refactored the codebase into more modular/DRY code using some agentic guidance from Cursor tools in helping with patterns. This surfaced a couple of bugs, which I fixed. I spent a while studying the more modular codebase. The monolith component has been refactored into custom Hooks and pure functions to make it easier to continue with testing.

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
