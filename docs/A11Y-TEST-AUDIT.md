# Audit: `src/App.a11y.test.jsx` (2026-10-20)

A review of the Vitest + jsdom accessibility tests, after the Playwright axe spec (`e2e-tests/a11y.spec.js`, #8) caught a real bug this file missed (#9). Findings fall into two groups: **brittle** tests that can fail when nothing is wrong, and **weak** tests that pass when something is.

## Why the jsdom axe scan missed #9

Verified by temporarily restoring the pre-#9 `Header.jsx` (`aria-label` on a role-less `<span>`) and running this file: **all 5 tests passed.**

- The scan runs 100 ms after render. At that point the typewriter title has typed only "🚀", so the span has text content.
- With text present, axe classified `aria-prohibited-attr` as **incomplete** (needs review): "aria-label attribute is not well supported on a span with no valid role attribute."
- `toHaveNoViolations()` only fails on **violations**, so incomplete results pass silently.
- The Playwright spec reported the same issue as a violation, which is why it caught the bug. Exactly why the browser run classified it differently isn't confirmed; typewriter timing is the likely factor.

Takeaway: the jsdom scan is a cheap first pass, not a substitute for the Playwright scan. Keep both.

## Brittle

- **Fixed 100 ms `setTimeout` before every test** (lines 51, 79, 98, 119 at time of audit). A guess at hydration time: too short on a slow CI machine, and an arbitrary mid-animation snapshot on a fast one (see above). Replace with a wait on a real condition. The keyboard only renders after hydration, so e.g. `await screen.findByRole("button", { name: "Press letter A" })`.
- **Hard-coded title string** (line 64): `toHaveAccessibleName("🚀Hashle: An Evolving Word Game")` duplicates `TITLE_TEXT` in `Header.jsx`. Changing the title copy breaks the test without any accessibility change. Minor, and arguably intentional (it pins the exact announced name).
- **Tag-name queries for landmarks** (lines 103-111): `container.querySelector("main" | "header" | "section")` checks HTML tags, not what assistive tech sees. `screen.getByRole("main")` / `getByRole("banner")` test the landmark itself and survive an equally accessible refactor (e.g. `<div role="main">`).

## Weak

- **`length > 0` assertions** (lines 85, 112, 125): pass on almost any page.
- **Focus test** (lines 128-130): only checks that no button has `tabindex="-1"`. The comment says "not explicitly disabled," but `disabled` is never checked. Real focus behavior (Tab order, where focus lands after a guess) needs a real browser.
- **First test only checks violations**: incomplete results are ignored (see above).

## Solid

- The heading check (lines 61-65) and RGB-toggle check (lines 88-91) query by role and accessible name, the way Testing Library recommends.

Tracked in #15.
