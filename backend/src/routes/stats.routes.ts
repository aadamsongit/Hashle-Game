import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { meStats } from "../controllers/stats.controller.js";

export const statsRouter = Router();

statsRouter.get("/stats", requireAuth, meStats);
