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

## 🧭 Recent Changes & Changelog

### 🆕 Latest Release (v1.1.0) - Accessibility & Testing Infrastructure

#### ✨ New Features

- **Comprehensive Accessibility Test Suite**: Added `jest-axe` + React Testing Library with 6 passing tests
- **Standalone Accessibility Audit Tool**: Created `public/a11y-audit.html` for manual axe-core testing
- **Semantic HTML Structure**: Implemented proper landmarks, headings, and ARIA roles
- **Game Board Accessibility**: Added `role="grid"` with proper row/cell structure
- **Live Regions**: Dynamic content updates announced to screen readers
- **Accessibility Documentation**: Complete guide in `ACCESSIBILITY.md`

#### 🐛 Bug Fixes

- **Dark Mode Toggle**: Fixed destructuring issue in `useDarkMode` hook
- **Controlled Checkbox**: Made dark mode toggle properly controlled with state
- **Game Status Text**: Removed unnecessary "Game in progress" fallback text

#### 🔧 Infrastructure Improvements

- **Vitest Configuration**: Added jsdom environment and test setup
- **Test Environment**: Created `src/setupTests.js` with proper mocking
- **Package Scripts**: Added `npm run test:a11y` for accessibility testing
- **ESLint Integration**: All accessibility changes pass linting

#### 📚 Documentation Updates

- **ACCESSIBILITY.md**: Comprehensive accessibility guide and testing procedures
- **README.md**: Updated with testing commands, accessibility features, and quick start
- **Inline Comments**: Added accessibility context throughout components

### 🔄 Previous Changes

- Added accessibility test suite with `jest-axe` and React Testing Library
- Added semantic HTML and ARIA attributes in `src/App.jsx`, `src/components/Header.jsx`, and `src/components/Nav.jsx`
- Created `public/a11y-audit.html` to run manual axe-core audits in the browser
- Configured Vitest in `vite.config.js` and added `src/setupTests.js`

## 🧩 Tech Stack

- **Frontend**: React 19 + Vite 6 + Tailwind CSS 3
- **Testing**: Vitest + React Testing Library + jest-axe
- **Accessibility**: axe-core + ARIA + Semantic HTML
- **Build Tools**: Vite with jsdom environment for testing
- **Code Quality**: ESLint + Prettier (implicit)

## 🔧 Technical Implementation Details

### Accessibility Features Implemented

- **Semantic Structure**: `<main>`, `<header>`, `<section>` landmarks
- **Heading Hierarchy**: H1 (title) → H2 (game status) → H3 (if needed)
- **Game Board**: `role="grid"` with `aria-rowcount="6"`, `role="row"`, `role="gridcell"`
- **Interactive Elements**: `aria-label`, `aria-pressed`, `aria-live` attributes
- **Form Controls**: Proper labeling for dark mode toggle checkbox

### Testing Infrastructure

- **Vitest Configuration**: jsdom environment, setup files, global test utilities
- **Accessibility Testing**: axe-core integration with custom test suite
- **Component Testing**: React Testing Library for component behavior
- **Mocking**: localStorage, browser APIs, and component dependencies

### State Management

- **Dark Mode**: localStorage persistence with controlled checkbox state
- **Game State**: Proper hydration handling and state restoration
- **Accessibility State**: ARIA attributes synchronized with component state

### Files Created/Modified

#### New Files

- `src/App.a11y.test.jsx` - Accessibility test suite (6 tests)
- `src/setupTests.js` - Test environment configuration
- `public/a11y-audit.html` - Standalone accessibility audit tool
- `ACCESSIBILITY.md` - Comprehensive accessibility guide

#### Modified Files

- `src/App.jsx` - Added semantic HTML, ARIA labels, grid structure
- `src/components/Header.jsx` - Added ARIA attributes for toast messages
- `src/components/Nav.jsx` - Fixed dark mode toggle, added accessibility
- `src/hooks/useDarkMode.js` - Fixed return value destructuring
- `vite.config.js` - Added test configuration with jsdom
- `package.json` - Added testing scripts and dependencies
- `README.md` - Updated with accessibility features and testing info

## 🧪 Testing Results & Compliance

### Accessibility Test Results

- **Total Tests**: 6 accessibility tests
- **Status**: ✅ All tests passing
- **Coverage**: Semantic structure, ARIA labels, focus management, color contrast
- **Tools**: jest-axe + React Testing Library + axe-core

### Accessibility Compliance

- **Target Standard**: WCAG 2.1 AA
- **Semantic HTML**: ✅ Proper landmarks and heading hierarchy
- **ARIA Implementation**: ✅ Labels, roles, and live regions
- **Keyboard Navigation**: ✅ All interactive elements accessible
- **Screen Reader Support**: ✅ Descriptive labels and status updates

### Manual Testing

- **Browser Extension**: axe DevTools integration ready
- **Standalone Tool**: `public/a11y-audit.html` for manual audits
- **Cross-browser**: Tested with modern browsers
- **Mobile**: Responsive design maintained

## 🗺️ Roadmap (Planned)

- 📘 Game Info / Tutorial: In-app help for first-time players
- 🧪 E2E Testing: Playwright or Cypress
- 📊 Scoreboards: Track performance and compare with friends
- 📤 Mobile Sharing: Share results with a mobile-friendly UX
- 🗄️ Database Integration: Scores and user data
- 🌍 Localization: Potential multi-language support
