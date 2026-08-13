# Architecture Notes

## ⚙️ Backend: decided

The custom-backend option below is confirmed, not just under consideration: **Express, TypeScript, ESM, PostgreSQL, Prisma.** A collaborator ([Ayomide Asaniyan](https://github.com/aadamsongit/Hashle-Game/tree/backend-express-refactor)) is building it via fork + PR against the `backend-express-refactor` branch. See **[BACKEND.md](./BACKEND.md)** for the actual scope/requirements (data model, API surface, frontend/backend boundary).

## ⚙️ Technical Debt & Future Improvements

- Expand regression and end-to-end test coverage around gameplay and state transitions.
- Continue validating responsive behavior across browsers and devices, with particular attention to Android.
- Introduce an authentication layer with persistent user data. Anonymous users can continue using localStorage, while authenticated users store progress, streaks, and achievements in a database.

## ⚙️ Architectural Tradeoffs (history -- kept for context on how the backend decision was reached)

**Backend-as-a-Service**

Supabase reduces the amount of backend infrastructure you need to build, making it an attractive option for prototypes and small applications. In exchange, you accept platform-specific abstractions and operational behavior. For example, projects on the free tier can become inactive after periods of inactivity, which may require additional handling for demos or open source projects. Supabase also provides built-in authentication and Row-Level Security (RLS), although those policies still need to be configured rather than being automatically enabled for every use case.

**Custom Backend**

Building the backend with PostgreSQL, Prisma, and TypeScript requires more setup but provides greater control over the data model and application architecture. Prisma's schema-first approach and generated TypeScript client encourage explicit modeling and type-safe database access, making it a good fit for strengthening backend fundamentals.

Express.js pairs naturally with a React + Vite application as a lightweight backend. One consideration is that much of the Express ecosystem still uses CommonJS examples, whereas I've become accustomed to ES Modules and TypeScript-first workflows.

**Would I migrate to Next.js?**

Hashle could certainly be migrated to Next.js, but I don't think it's an automatic improvement. The application was designed around React and Vite, and Express is a natural companion for that architecture.

## ⚙️ Recommended Approach (history)

Testing was prioritized before adding backend/data features, on the reasoning that the codebase needed to be modular and well-covered first. That's now done -- see [TESTING.md](./TESTING.md) -- which is what unblocked starting the backend for real. See [BACKEND.md](./BACKEND.md) for what's next.

Next.js becomes more compelling if Hashle grows to include authenticated users, server-rendered data, or more sophisticated persistence. Its App Router, Server Actions, authentication ecosystem, and TypeScript-first workflow provide strong patterns for data-driven applications, but they may introduce unnecessary complexity for a relatively small game -- not revisited as part of the current backend work, which stays with Express per the decision above.
