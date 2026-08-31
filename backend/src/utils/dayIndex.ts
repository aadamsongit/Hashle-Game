// Mirrors the frontend's day-index calculation exactly (src/utils/gameHelpers.js,
// getDayIndex) -- same epoch, same day-length arithmetic. Used server-side to
// reject a submitted dayIndex that hasn't happened yet, per the PR discussion
// on unvalidated results (github.com/aadamsongit/Hashle-Game/pull/5).
const EPOCH = Date.UTC(2023, 0, 1);
const DAY_MS = 1000 * 60 * 60 * 24;

export function getCurrentDayIndex(now: Date = new Date()): number {
  return Math.floor((now.getTime() - EPOCH) / DAY_MS);
}
