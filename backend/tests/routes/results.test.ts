import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("POST /results", () => {
  it("returns 401 when not authenticated", async () => {
    const response = await request(app)
      .post("/results")
      .send({ dayIndex: 1, outcome: "win", guesses: 3 });

    expect(response.status).toBe(401);
  });
});
