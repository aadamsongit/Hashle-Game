import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("POST /import", () => {
  it("returns 401 when not authenticated", async () => {
    const response = await request(app)
      .post("/import")
      .send({ results: {} });

    expect(response.status).toBe(401);
  });
});
