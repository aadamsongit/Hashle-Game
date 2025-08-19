# 🚀 Hashle Word Game: Wordle with the Possibility for Variants and New Features

Hashle is a feature-rich, scalable Wordle-style game built with React, Vite, and Tailwind CSS (v3). Hashle has been played and tested by real users! The game was designed to give hands-on practice with React architecture and experience iterating and debugging features. 

# 🚀 Features

🎮 Classic Wordle gameplay: Guess a five-letter word in six tries.

🌈 RGB Keyboard mode: Toggle a vibrant rainbow-wave animation on the keyboard — a nod to gaming aesthetics.

🌗 Light/Dark Mode: Toggle between themes with persistent settings saved to localStorage.

🧠 Smart game logic: Handles edge cases in letter placement, repeat letters, and more.

💾 Persistence: Your guesses and game state are saved across refreshes via localStorage.

🏆 Win/Loss Toasts: Custom animated toasts appear when you win or lose, enhancing the UX.

🔄 Animations: Staggered tile flips, bounce effects, and smooth transitions throughout the game.

🧰 React Best Practices: Includes custom hooks (useDarkMode.js), utility functions, and clean component separation.

📱 Responsive Design: Works seamlessly across desktop and mobile devices.

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start dev server (Vite)
npm run dev

# Build for production
npm run build

# Lint the project
npm run lint
```

## 🧪 Testing

We have both unit tests and accessibility tests set up.

```bash
# Run all tests
npm run test

# Run accessibility tests only
npm run test:a11y
```

- Unit tests use Vitest and live alongside utilities like `src/utils/wordHelpers.test.js`.
- Accessibility tests use `jest-axe` + Testing Library in `src/App.a11y.test.jsx`.
- Test environment is configured via Vitest with `jsdom` and a setup file at `src/setupTests.js`.

## ♿ Accessibility

Significant accessibility improvements were added:

- Semantic landmarks: `main`, `header`, and structured `section`s
- Clear heading hierarchy: `h1` for title, `h2` for status
- Game board modeled as a grid with `role="grid"`, rows (`role="row"`), and cells (`role="gridcell"`)
- Descriptive labels for tiles and keyboard buttons
- Live regions for dynamic status and alerts
- Labeled dark mode toggle

See the full guide and checklist in `ACCESSIBILITY.md`.

### Manual a11y audits

- Open `public/a11y-audit.html` in your browser to run an in-page axe-core audit.
- Alternatively, install the "axe DevTools" browser extension and audit the running app at `http://localhost:5173/`.

## 📦 Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run test      # Run all tests (Vitest)
npm run test:a11y # Run accessibility tests only
```

## 🧭 What changed recently

- Added accessibility test suite with `jest-axe` and React Testing Library
- Added semantic HTML and ARIA attributes in `src/App.jsx`, `src/components/Header.jsx`, and `src/components/Nav.jsx`
- Created `public/a11y-audit.html` to run manual axe-core audits in the browser
- Configured Vitest in `vite.config.js` and added `src/setupTests.js`

## 🧩 Tech

- React 19 + Vite 6 + Tailwind CSS 3
- Vitest + Testing Library + jest-axe for tests

## 🗺️ Roadmap (Planned)

- 📘 Game Info / Tutorial: In-app help for first-time players
- 🧪 E2E Testing: Playwright or Cypress
- 📊 Scoreboards: Track performance and compare with friends
- 📤 Mobile Sharing: Share results with a mobile-friendly UX
- 🗄️ Database Integration: Scores and user data
- 🌍 Localization: Potential multi-language support
