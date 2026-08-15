import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { Pool } from "pg";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { passport } from "./config/passport.js";
import { healthRouter } from "./routes/health.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { resultsRouter } from "./routes/results.routes.js";
import { statsRouter } from "./routes/stats.routes.js";
import { leaderboardRouter } from "./routes/leaderboard.routes.js";
import { importRouter } from "./routes/import.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const PgSession = pgSession(session);
const sessionPool = new Pool({ connectionString: env.DATABASE_URL });

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Mounted before the session middleware so health checks never depend on
// the database being reachable.
app.use("/health", healthRouter);

const isProduction = env.NODE_ENV === "production";

app.use(
  session({
    store: new PgSession({ pool: sessionPool, createTableIfMissing: true }),
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // Frontend and backend are different origins in
      // production, so the session cookie must be sameSite=none + secure
      // there. Locally both run on localhost, where lax + non-secure works.
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/results", resultsRouter);
app.use("/me", statsRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/import", importRouter);

app.use(errorHandler);
