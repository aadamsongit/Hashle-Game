import "../openapi/zod-extend.js";
import { z } from "zod";

export const meResponseSchema = z
  .object({
    id: z.string().uuid().openapi({ example: "5d9a7b5d-d210-4815-a6d9-feeb03a81253" }),
    email: z.string().email().openapi({ example: "player@example.com" }),
    displayName: z.string().openapi({ example: "Ayomide Paul Asaniyan" }),
  })
  .openapi("MeResponse");

export const unauthenticatedErrorSchema = z
  .object({
    error: z.literal("Not authenticated").openapi({ example: "Not authenticated" }),
  })
  .openapi("UnauthenticatedError");
