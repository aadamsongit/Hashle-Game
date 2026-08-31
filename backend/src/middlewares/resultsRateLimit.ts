import rateLimit from "express-rate-limit";

// One result per day per user is the actual valid usage pattern -- this
// isn't rate-limiting normal traffic, it's a cheap backstop against the
// trivial case of a script hammering the endpoint, per the PR discussion
// on unvalidated results (github.com/aadamsongit/Hashle-Game/pull/5).
// Must run after requireAuth so req.user is guaranteed for the key.
export const resultsRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user!.id,
});
