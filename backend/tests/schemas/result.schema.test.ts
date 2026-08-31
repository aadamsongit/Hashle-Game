import { describe, expect, it } from "vitest";
import { submitResultSchema } from "../../src/schemas/result.schema.js";
import { getCurrentDayIndex } from "../../src/utils/dayIndex.js";

describe("submitResultSchema", () => {
  it("accepts today's dayIndex", () => {
    const result = submitResultSchema.safeParse({
      dayIndex: getCurrentDayIndex(),
      outcome: "win",
      guesses: 3,
    });

    expect(result.success).toBe(true);
  });

  it("accepts a past dayIndex", () => {
    const result = submitResultSchema.safeParse({
      dayIndex: getCurrentDayIndex() - 10,
      outcome: "loss",
      guesses: 6,
    });

    expect(result.success).toBe(true);
  });

  it("rejects a future dayIndex", () => {
    const result = submitResultSchema.safeParse({
      dayIndex: getCurrentDayIndex() + 1,
      outcome: "win",
      guesses: 1,
    });

    expect(result.success).toBe(false);
  });
});
