Updated and condensed notes as of 2026:

Hashle began as an elaboration of Scrimba's Hangman game. Hangman introduces some particularities of local state in a React component. The Scrimba Hangman "Assembly"-themed game from the capstone is a fun exercise in Hooks and local state, but not very DRY or modular code. 

I built from these patterns and used a brute force approach, then refactored the codebase into more modular/DRY code using some agentic guidance from Cursor tools in helping with patterns. This surfaced a couple of bugs, which I fixed. I spent a while studying the more modular codebase. The monolith component has been refactored into custom Hooks and pure functions to make it easier to continue with testing. 

I set up Vitest, axe-core for accessibility testing, and Playwright for end-to-end testing. The testing infrastructure is in place, but the suites themselves still need to be reviewed and validated. I haven't yet performed a thorough inspection of the generated tests.
