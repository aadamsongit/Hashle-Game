import type { Request, Response } from "express";
import { env } from "../config/env.js";

export function googleCallback(_req: Request, res: Response) {
  res.redirect(env.FRONTEND_URL);
}

export function logout(req: Request, res: Response, next: (err?: unknown) => void) {
  req.logout((err) => {
    if (err) {
      next(err);
      return;
    }
    res.status(204).end();
  });
}

export function me(req: Request, res: Response) {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { id, email, displayName } = req.user;
  res.status(200).json({ id, email, displayName });
}
