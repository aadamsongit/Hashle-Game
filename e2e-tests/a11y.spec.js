import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests", () => {
  test("has no accessibility violations in a real browser", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("heading", { level: 1, name: "Hashle" }).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });
});
