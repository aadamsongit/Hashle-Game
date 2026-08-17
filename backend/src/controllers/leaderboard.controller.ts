import type { Request, Response } from "express";
import { createLeaderboardService } from "../services/leaderboard.service.js";
import { getWinStatsByUser } from "../repositories/leaderboard.repository.js";

const leaderboardService = createLeaderboardService({ getWinStatsByUser });

export async function leaderboard(_req: Request, res: Response) {
  const rows = await leaderboardService.getLeaderboard();
  res.status(200).json(rows);
}
