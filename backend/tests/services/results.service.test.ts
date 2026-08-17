import { describe, expect, it } from "vitest";
import {
  createResultsService,
  type ResultRepository,
} from "../../src/services/results.service.js";
import type { DailyResult } from "@prisma/client";

describe("results.service", () => {
  it("upserts a result for the given user", async () => {
    const calls: unknown[] = [];
    const fakeRepository: ResultRepository = {
      upsertResult: async (data) => {
        calls.push(data);
        return { id: "1", completedAt: new Date(), ...data } as DailyResult;
      },
    };

    const service = createResultsService(fakeRepository);
    const result = await service.submitResult("user-1", {
      dayIndex: 5,
      outcome: "win",
      guesses: 3,
    });

    expect(calls).toEqual([
      { userId: "user-1", dayIndex: 5, outcome: "win", guesses: 3 },
    ]);
    expect(result.id).toBe("1");
  });
});
