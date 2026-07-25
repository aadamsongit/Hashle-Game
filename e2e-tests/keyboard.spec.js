import { test, expect } from "@playwright/test";

test("keyboard letter press fills the next empty board cell", async ({
  page,
}) => {
  await page.goto("/");

  const pButton = page.getByRole("button", { name: "Press letter P" });
  await expect(pButton).toHaveAttribute("data-delay", "8");

  await pButton.click();

  // The first cell of the active row should now visibly show "P". Note:
  // the cell's aria-label does NOT update for in-progress (unsubmitted)
  // letters — it only reflects the committed guess after Enter — so we
  // check rendered text here, not the accessible name. That's a real,
  // separate a11y gap worth its own fix later: a screen-reader user gets
  // no live feedback on what they've typed until they submit the row.
  const firstCell = page.getByRole("gridcell").first();
  await expect(firstCell).toHaveText("P");
});
