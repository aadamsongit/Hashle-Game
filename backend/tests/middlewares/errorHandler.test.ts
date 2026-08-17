import { describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { errorHandler } from "../../src/middlewares/errorHandler.js";
import { AppError } from "../../src/utils/AppError.js";

function fakeResponse() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

describe("errorHandler", () => {
  it("uses the AppError's own status and message", () => {
    const res = fakeResponse();
    errorHandler(
      new AppError(404, "Not found"),
      {} as Request,
      res,
      vi.fn()
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  it("falls back to 500 for unexpected errors", () => {
    const res = fakeResponse();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    errorHandler(new Error("boom"), {} as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });

    consoleSpy.mockRestore();
  });
});
