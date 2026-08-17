import type { Request, Response } from "express";
import { createStatsService } from "../services/stats.service.js";
import { findResultsByUserId } from "../repositories/result.repository.js";

const statsService = createStatsService({ findResultsByUserId });

export async function meStats(req: Request, res: Response) {
  // requireAuth ran before this handler, so req.user is guaranteed.
  const stats = await statsService.getStatsForUser(req.user!.id);
  res.status(200).json(stats);
}
