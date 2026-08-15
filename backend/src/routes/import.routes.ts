import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validateBody } from "../middlewares/validate.js";
import { importSchema } from "../schemas/import.schema.js";
import { importResults } from "../controllers/import.controller.js";

export const importRouter = Router();

importRouter.post("/", requireAuth, validateBody(importSchema), importResults);
