import { test, expect } from "@playwright/test";

// This test exists to answer a specific open question: rebuildStatuses.js
// (used only when the board is rebuilt from localStorage) was unit-tested
// and confirmed correct for duplicate-letter scoring. But live gameplay
// uses a completely separate, hand-written implementation in
// useWordLogic.js's addStatusesandClasses — never tested. This test
// exercises THAT live path directly, submitting a real guess through the
// UI, to confirm it agrees with the already-verified logic (or catch a
// divergence if it doesn't).
//
// The daily word is date-derived, so the test pins the clock to a fixed
// date. For that fixed date, the daily word resolves to "TASES" (T-A-S-E-S,
// one A, two S's). The guess "ABASE" (A-B-A-S-E, two A's) is chosen because
// it has more A's than the target has — the exact "duplicate letter
// exceeds target's count" case that's the classic Wordle-clone bug.
//
// Expected per-letter result for guess ABASE against target TASES:
//   A (pos 1) -> present (yellow): target has 1 A, this consumes it
//   B (pos 2) -> absent  (gray):   not in target at all
//   A (pos 3) -> absent  (gray):   target's only A was already consumed
//   S (pos 4) -> present (yellow): target has 2 S's, this consumes one
//   E (pos 5) -> present (yellow): target has 1 E, this consumes it

const FIXED_DATE = new Date(Date.UTC(2024, 0, 1, 12, 0, 0));
const GUESS = ["A", "B", "A", "S", "E"];
const EXPECTED_CLASSES = [
  "bg-yellow",
  "bg-gray",
  "bg-gray",
  "bg-yellow",
  "bg-yellow",
];

test("live guess submission scores a duplicate letter the same way rebuildStatuses does", async ({
  page,
}) => {
  await page.clock.install({ time: FIXED_DATE });
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  for (const letter of GUESS) {
    await page
      .getByRole("button", { name: `Press letter ${letter}`, exact: true })
      .click();
  }
  await page
    .getByRole("button", { name: "Press letter Enter", exact: true })
    .click();

  // Tile color updates are staggered with setTimeout(i * 300ms) in
  // addStatusesandClasses — wait for the last one before asserting.
  await page.waitForTimeout(GUESS.length * 300 + 200);

  for (let i = 0; i < GUESS.length; i++) {
    const cell = page.getByRole("gridcell", {
      name: new RegExp(`Position ${i + 1}, Row 1: ${GUESS[i]}`),
    });
    await expect(cell).toHaveClass(new RegExp(EXPECTED_CLASSES[i]));
  }
});
