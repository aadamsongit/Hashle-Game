import { Router } from "express";
import { passport } from "../config/passport.js";
import { googleCallback, logout, me } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google" }),
  googleCallback
);

authRouter.post("/logout", logout);
authRouter.get("/me", me);
