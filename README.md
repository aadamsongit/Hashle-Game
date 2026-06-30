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
- Consider a small backend. Maybe a simple auth with a basic login and Oath. Prefer Google or some simple login flow. 
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

Next.js becomes more compelling if the application grows to include authenticated users, server-rendered data, or more sophisticated persistence. Its App Router, Server Actions, authentication ecosystem, and TypeScript-first workflow provide strong patterns for data-driven applications, but they also introduce additional architectural complexity that may not be necessary for a relatively small game.

