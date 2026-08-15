import type { Request, Response } from "express";
import { createResultsService } from "../services/results.service.js";
import { upsertResult } from "../repositories/result.repository.js";
import type { SubmitResultInput } from "../schemas/result.schema.js";

const resultsService = createResultsService({ upsertResult });

export async function submitResult(req: Request, res: Response) {
  const input = req.body as SubmitResultInput;
  // requireAuth ran before this handler, so req.user is guaranteed.
  const result = await resultsService.submitResult(req.user!.id, input);
  res.status(200).json(result);
}
