import { test, expect } from "@playwright/test";

// These are E2E-only checks on purpose: jsdom (what the Vitest suite uses)
// doesn't do real CSS layout or cascade-layer resolution, so this whole
// class of bug — content overflowing its container, cascade-layer
// precedence silently overriding utility classes — is invisible to unit
// tests. Only a real browser catches it, which is exactly how both of
// these were found.

test.describe("header title layout", () => {
  const widths = [
    { width: 1920, height: 1080, label: "wide desktop" },
    { width: 1131, height: 800, label: "typical desktop window" },
    { width: 800, height: 900, label: "narrow desktop / custom ipad-range breakpoint" },
  ];

  for (const { width, height, label } of widths) {
    test(`title never overflows its container (${label}, ${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/");

      const container = page.locator(".terminal-container");
      const span = page.locator(".terminal-title");

      // Wait for the typewriter to finish so the span is at its full,
      // final rendered width before measuring.
      await expect(span).toHaveClass(/terminal-title--done/, {
        timeout: 10000,
      });

      const containerBox = await container.boundingBox();
      const spanBox = await span.boundingBox();

      expect(spanBox.x + spanBox.width).toBeLessThanOrEqual(
        containerBox.x + containerBox.width + 1 // 1px tolerance for sub-pixel rounding
      );
    });
  }

  test("title is horizontally centered on a typical desktop width", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1131, height: 800 });
    await page.goto("/");

    const span = page.locator(".terminal-title");
    await expect(span).toHaveClass(/terminal-title--done/, { timeout: 10000 });

    const h1Box = await page.locator(".terminal-title-parent").boundingBox();
    const spanBox = await span.boundingBox();

    const leftGap = spanBox.x - h1Box.x;
    const rightGap = h1Box.x + h1Box.width - (spanBox.x + spanBox.width);

    expect(Math.abs(leftGap - rightGap)).toBeLessThanOrEqual(2);
  });
});

test.describe("on-screen keyboard layout", () => {
  test("QWERTYUIOP row stays on a single line on a narrow phone-width viewport", async ({
    page,
  }) => {
    // Matches the width the original bug was reported at.
    await page.setViewportSize({ width: 434, height: 738 });
    await page.goto("/");

    const firstRow = page.locator(".keyboard-row").first();
    const buttons = firstRow.locator("button");
    await expect(buttons).toHaveCount(10);

    const tops = await buttons.evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().top))
    );
    const uniqueTops = new Set(tops);

    // All 10 keys must share the same top offset — if the row wrapped,
    // some keys would be pushed to a second line with a different top.
    expect(uniqueTops.size).toBe(1);
  });

  test("keyboard buttons use Tailwind's spacing, not the legacy unlayered button reset", async ({
    page,
  }) => {
    // Regression guard for the actual root cause: a plain `button {}`
    // rule in index.css was unlayered CSS, and unlayered styles always
    // beat @layer'd styles (where all of Tailwind's utilities live)
    // regardless of specificity — silently overriding every utility
    // class applied to any button in the app. If that rule (or an
    // equivalent unlayered one) reappears, this padding value will
    // drift back to the legacy 0.6em/1.2em (19.2px at a 16px root),
    // instead of Tailwind's px-2 (8px).
    //
    // Viewport pinned below the sm: breakpoint (640px) on purpose —
    // sm:px-4 legitimately overrides px-2 to 16px above that, which
    // isn't the bug this test is guarding against.
    await page.setViewportSize({ width: 434, height: 738 });
    await page.goto("/");

    const key = page.getByRole("button", { name: "Press letter Q" });
    const padding = await key.evaluate(
      (el) => getComputedStyle(el).paddingLeft
    );

    expect(padding).toBe("8px");
  });
});
