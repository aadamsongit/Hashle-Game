// e2e-tests/keyboard.spec.js
import { test, expect } from "@playwright/test";

test("keyboard P press works", async ({ page }) => {
  await page.goto("http://localhost:3000"); // your dev server
  const button = page.getByRole("button", { name: "Press letter P" });

  await expect(button).toHaveAttribute("data-delay", "8");

  await button.click();
  // add any checks for state change after clicking P
});
