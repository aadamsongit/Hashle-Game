import "../openapi/zod-extend.js";
import { z } from "zod";

export const healthResponseSchema = z
  .object({
    status: z.literal("ok").openapi({ example: "ok" }),
  })
  .openapi("HealthResponse");
