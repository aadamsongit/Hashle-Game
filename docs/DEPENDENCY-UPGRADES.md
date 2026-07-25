# Dependency Upgrades

## 📦 pnpm and Tailwind CSS 4 (2026-07-25)

Migrated off npm and Tailwind CSS 3, on a dedicated branch, verifying with the full test suite after each step rather than as one large change.

- **npm → pnpm.** Used `pnpm import` to preserve exact resolved versions from `package-lock.json` rather than letting a fresh install re-resolve anything. esbuild's postinstall script was being silently blocked by pnpm's build-script approval gate — approved via `pnpm-workspace.yaml` so a fresh clone works without a manual interactive step.
- **Tailwind CSS 3 → 4.** Used the official `@tailwindcss/upgrade` codemod rather than hand-editing config. It converted the `@tailwind` directives to a single `@import`, and linked the existing `tailwind.config.js` via `@config` compat mode (it didn't auto-convert to native CSS `@theme` syntax — that's a possible later follow-up, not required right now). Manually updated `postcss.config.mjs` to `@tailwindcss/postcss` (the codemod can't touch files with dynamic JS in them) and removed `autoprefixer`, since v4's Lightning CSS engine handles vendor prefixing internally.
- **Regression scare, investigated and resolved:** right after the Tailwind 4 change, both E2E tests failed — looked like a real break. Root cause turned out to be unrelated to Tailwind: a stale dev server from earlier in the session was still bound to port 5173, and Playwright's `reuseExistingServer` config was silently testing against that old instance instead of the current code. Killed the stray process, fixed `playwright.config.js`'s `webServer` command to use `pnpm run dev`, and confirmed clean against a fresh server. Worth noting given a previous agentic refactor of this project broke a live deployment — this time the test suite caught the apparent break immediately, and it got root-caused correctly instead of blamed on the actual change.

## Not yet done

- Native Tailwind v4 `@theme` conversion — currently running in `@config` compatibility mode against the original `tailwind.config.js`, not yet ported to CSS-native theme syntax.

## Follow-up: the deferred visual smoke test found real bugs

The manual visual check that was deliberately deferred at merge time (see above) turned up two real layout bugs once actually done — a header overflow issue and a Tailwind-cascade-layers issue affecting every button in the app. Both root-caused, fixed, covered with new cross-browser E2E tests, and merged. Full writeup: [TESTING.md](./TESTING.md#-uilayout-fixes-2026-07-25).
