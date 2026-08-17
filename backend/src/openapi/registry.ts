import "./zod-extend.js";
import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { healthResponseSchema } from "../schemas/health.schema.js";
import { meResponseSchema, unauthenticatedErrorSchema } from "../schemas/auth.schema.js";
import {
  submitResultSchema,
  resultResponseSchema,
} from "../schemas/result.schema.js";
import { statsResponseSchema } from "../schemas/stats.schema.js";
import { leaderboardResponseSchema } from "../schemas/leaderboard.schema.js";
import { importSchema, importResponseSchema } from "../schemas/import.schema.js";

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "sessionCookie", {
  type: "apiKey",
  in: "cookie",
  name: "connect.sid",
  description:
    "Session cookie set after a successful /auth/google/callback. Not a bearer token — the browser sends it automatically once logged in.",
});

const authRequired = [{ sessionCookie: [] }];

registry.registerPath({
  method: "get",
  path: "/health",
  summary: "Health check",
  description: "Does not touch the database. Safe for load balancer checks.",
  tags: ["Health"],
  responses: {
    200: {
      description: "Server is up",
      content: { "application/json": { schema: healthResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/google",
  summary: "Start Google login",
  description: "Redirects the browser to Google's consent screen.",
  tags: ["Auth"],
  responses: {
    302: { description: "Redirect to accounts.google.com" },
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/google/callback",
  summary: "Google OAuth callback",
  description:
    "Google redirects here after consent. On success, establishes a session and redirects to the frontend.",
  tags: ["Auth"],
  responses: {
    302: { description: "Redirect to the frontend, session cookie set" },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/logout",
  summary: "Log out",
  description: "Destroys the current session.",
  tags: ["Auth"],
  responses: {
    204: { description: "Logged out" },
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/me",
  summary: "Current logged-in user",
  tags: ["Auth"],
  security: authRequired,
  responses: {
    200: {
      description: "The logged-in user",
      content: { "application/json": { schema: meResponseSchema } },
    },
    401: {
      description: "Not logged in",
      content: { "application/json": { schema: unauthenticatedErrorSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/results",
  summary: "Submit today's result",
  description:
    "One result per user per day. Calling it again for the same day updates the existing row instead of creating a new one.",
  tags: ["Results"],
  security: authRequired,
  request: {
    body: {
      content: { "application/json": { schema: submitResultSchema } },
    },
  },
  responses: {
    200: {
      description: "The saved result",
      content: { "application/json": { schema: resultResponseSchema } },
    },
    401: {
      description: "Not logged in",
      content: { "application/json": { schema: unauthenticatedErrorSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/me/stats",
  summary: "Current user's stats",
  description: "Streaks and win rate, derived from stored results.",
  tags: ["Stats"],
  security: authRequired,
  responses: {
    200: {
      description: "Stats for the logged-in user",
      content: { "application/json": { schema: statsResponseSchema } },
    },
    401: {
      description: "Not logged in",
      content: { "application/json": { schema: unauthenticatedErrorSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/leaderboard",
  summary: "Leaderboard",
  description:
    "Ranked by total wins, average guesses as tie-break. Public, no login needed.",
  tags: ["Leaderboard"],
  responses: {
    200: {
      description: "Ranked list of players",
      content: { "application/json": { schema: leaderboardResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/import",
  summary: "Import local game history",
  description:
    "One-time import of localStorage game history on first login. Skips in-progress games. Does nothing if the account already has results.",
  tags: ["Import"],
  security: authRequired,
  request: {
    body: {
      content: { "application/json": { schema: importSchema } },
    },
  },
  responses: {
    200: {
      description: "Import summary",
      content: { "application/json": { schema: importResponseSchema } },
    },
    401: {
      description: "Not logged in",
      content: { "application/json": { schema: unauthenticatedErrorSchema } },
    },
  },
});

const generator = new OpenApiGeneratorV31(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.1.0",
  info: {
    title: "Hashle Backend API",
    version: "1.0.0",
    description:
      "Endpoints the frontend consumes: auth, daily results, stats, leaderboard, and the one-time local-history import.",
  },
  servers: [{ url: "http://localhost:4000", description: "Local development" }],
});
