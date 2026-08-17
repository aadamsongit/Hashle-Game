import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

const EXPECTED_PATHS = [
  "/health",
  "/auth/google",
  "/auth/google/callback",
  "/auth/logout",
  "/auth/me",
  "/results",
  "/me/stats",
  "/leaderboard",
  "/import",
];

describe("GET /openapi.json", () => {
  it("generates a spec covering every route", async () => {
    const response = await request(app).get("/openapi.json");

    expect(response.status).toBe(200);
    expect(Object.keys(response.body.paths).sort()).toEqual(
      [...EXPECTED_PATHS].sort()
    );
  });
});

describe("GET /docs", () => {
  it("serves the Swagger UI page", async () => {
    const response = await request(app).get("/docs/");

    expect(response.status).toBe(200);
    expect(response.text).toContain("swagger-ui");
  });
});
