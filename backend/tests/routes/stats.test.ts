import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("GET /me/stats", () => {
  it("returns 401 when not authenticated", async () => {
    const response = await request(app).get("/me/stats");

    expect(response.status).toBe(401);
  });
});
