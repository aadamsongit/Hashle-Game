import type { DailyResult, Outcome } from "@prisma/client";

export type ResultRepository = {
  upsertResult: (data: {
    userId: string;
    dayIndex: number;
    outcome: Outcome;
    guesses: number;
  }) => Promise<DailyResult>;
};

export function createResultsService(resultRepository: ResultRepository) {
  function submitResult(
    userId: string,
    input: { dayIndex: number; outcome: Outcome; guesses: number }
  ) {
    return resultRepository.upsertResult({ userId, ...input });
  }

  return { submitResult };
}
