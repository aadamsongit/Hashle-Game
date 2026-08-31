import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { resultsRateLimit } from "../middlewares/resultsRateLimit.js";
import { validateBody } from "../middlewares/validate.js";
import { submitResultSchema } from "../schemas/result.schema.js";
import { submitResult } from "../controllers/results.controller.js";

export const resultsRouter = Router();

resultsRouter.post(
  "/",
  requireAuth,
  resultsRateLimit,
  validateBody(submitResultSchema),
  submitResult,
);
