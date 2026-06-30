Updated and condensed notes as of 2026:

Hashle began as an elaboration of Scrimba's Hangman game. Hangman introduces some particularities of local state in a React component. The Scrimba Hangman "Assembly"-themed game from the capstone is a fun exercise in Hooks and local state, but not very DRY or modular code. 

I built from these patterns and used a brute force approach, then refactored the codebase into more modular/DRY code using some agentic guidance from Cursor tools in helping with patterns. This surfaced a couple of bugs, which I fixed. I spent a while studying the more modular codebase. The monolith component has been refactored into custom Hooks and pure functions to make it easier to continue with testing. 

I set up Vitest, axe-core for accessibility testing, and Playwright for end-to-end testing. The testing infrastructure is in place, but the suites themselves still need to be reviewed and validated. I haven't yet performed a thorough inspection of the generated tests.

---

## ⚙️ Technical Debt & Future Improvements

- Upgrade from Tailwind CSS 3 to Tailwind CSS 4.
- Evaluate migrating from npm to pnpm for stricter dependency management.
- Review and validate the existing Vitest, Playwright, and axe-core test suites.
- Expand regression and end-to-end test coverage around gameplay and state transitions.
- Continue validating responsive behavior across browsers and devices, with particular attention to Android.
- Consider a small backend. Maybe a simple auth with a basic login and oath. Prefer Google or some simple login flow. 
- Introduce an authentication layer with persistent user data. Anonymous users can continue using localStorage, while authenticated users store progress, streaks, and achievements in a database.
- Weigh trade-off in BaaS for data vs. maybe simple Express.js setup with perhaps light SQL or NoSQL or Postgres.

 ## ⚙️ Tradeoffs
Supabase reduces the amount of backend infrastructure you need to build, making it an attractive option for prototypes and small applications. In exchange, you accept platform-specific abstractions and operational behavior. For example, projects on the free tier can become inactive after periods of inactivity, which may require additional handling for demos or open source projects.
   

