import { Router } from "express";
import { leaderboard } from "../controllers/leaderboard.controller.js";

export const leaderboardRouter = Router();

leaderboardRouter.get("/", leaderboard);
