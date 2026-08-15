import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { Pool } from "pg";
import { passport } from "./config/passport.js";
import { healthRouter } from "./routes/health.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { resultsRouter } from "./routes/results.routes.js";
import { statsRouter } from "./routes/stats.routes.js";

const PgSession = pgSession(session);
const sessionPool = new Pool({ connectionString: process.env.DATABASE_URL });

export const app = express();

app.use(express.json());

// Mounted before the session middleware so health checks never depend on
// the database being reachable.
app.use("/health", healthRouter);

app.use(
  session({
    store: new PgSession({ pool: sessionPool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET ?? "",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/results", resultsRouter);
app.use("/me", statsRouter);
