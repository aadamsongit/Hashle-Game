# Architecture Notes

## ⚙️ Technical Debt & Future Improvements

- Expand regression and end-to-end test coverage around gameplay and state transitions.
- Continue validating responsive behavior across browsers and devices, with particular attention to Android.
- Consider a small backend. Maybe a simple auth with a basic login and OAuth. Prefer Google or some simple login flow.
- Introduce an authentication layer with persistent user data. Anonymous users can continue using localStorage, while authenticated users store progress, streaks, and achievements in a database.
- Weigh trade-off in BaaS for data vs. maybe simple Express.js setup with perhaps light SQL or NoSQL or Postgres.

## ⚙️ Architectural Tradeoffs

**Backend-as-a-Service**

Supabase reduces the amount of backend infrastructure you need to build, making it an attractive option for prototypes and small applications. In exchange, you accept platform-specific abstractions and operational behavior. For example, projects on the free tier can become inactive after periods of inactivity, which may require additional handling for demos or open source projects. Supabase also provides built-in authentication and Row-Level Security (RLS), although those policies still need to be configured rather than being automatically enabled for every use case.

**Custom Backend**

Building the backend with PostgreSQL, Prisma, and TypeScript requires more setup but provides greater control over the data model and application architecture. Prisma's schema-first approach and generated TypeScript client encourage explicit modeling and type-safe database access, making it a good fit for strengthening backend fundamentals.

Express.js pairs naturally with a React + Vite application as a lightweight backend. One consideration is that much of the Express ecosystem still uses CommonJS examples, whereas I've become accustomed to ES Modules and TypeScript-first workflows.

**Would I migrate to Next.js?**

Hashle could certainly be migrated to Next.js, but I don't think it's an automatic improvement. The application was designed around React and Vite, and Express is a natural companion for that architecture.

## ⚙️ Recommended Approach

Prioritize the testing layer before adding backend/data features. The codebase has already been refactored toward modularity, making it a better candidate for unit, E2E, and accessibility testing.

Next.js becomes more compelling if Hashle grows to include authenticated users, server-rendered data, or more sophisticated persistence. Its App Router, Server Actions, authentication ecosystem, and TypeScript-first workflow provide strong patterns for data-driven applications, but they may introduce unnecessary complexity for a relatively small game.

Post-deployment, some behavioral bugs were reported. The next step is to reproduce and guard against those bugs with a combination of unit tests and E2E tests. Accessibility should also be validated with axe-core. See [TESTING.md](./TESTING.md) for progress on this.
