import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("GET /auth/me", () => {
  it("returns 401 when not authenticated", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
  });
});

describe("GET /auth/google", () => {
  it("redirects to Google's OAuth consent screen", async () => {
    const response = await request(app).get("/auth/google");

    expect(response.status).toBe(302);
    expect(response.headers.location).toContain("accounts.google.com");
  });
});
