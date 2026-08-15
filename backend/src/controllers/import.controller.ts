import type { Request, Response } from "express";
import { createImportService } from "../services/import.service.js";
import {
  countResultsByUserId,
  createManyResults,
} from "../repositories/result.repository.js";
import type { ImportInput } from "../schemas/import.schema.js";

const importService = createImportService({
  countResultsByUserId,
  createManyResults,
});

export async function importResults(req: Request, res: Response) {
  const { results } = req.body as ImportInput;
  // requireAuth ran before this handler, so req.user is guaranteed.
  const summary = await importService.importResults(req.user!.id, results);
  res.status(200).json(summary);
}
