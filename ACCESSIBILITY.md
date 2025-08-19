# Accessibility Guide for Hashle Game

This document outlines the accessibility features, testing procedures, and best practices implemented in the Hashle game.

## 🎯 Accessibility Features Implemented

### Semantic HTML Structure
- **Proper heading hierarchy**: H1 for main title, H2 for game status
- **Landmark regions**: `<main>`, `<header>`, `<section>` elements
- **Grid structure**: Game board uses proper `role="grid"` with `role="row"` and `role="gridcell"`
- **Button types**: All interactive elements have proper `type="button"` attributes

### ARIA Labels and Roles
- **Game board**: `aria-label="Game Board"`, `role="grid"`, `aria-rowcount="6"`
- **Game tiles**: `aria-label` with position and content information
- **Keyboard**: `aria-label="Virtual Keyboard"`, `role="group"`
- **Buttons**: Descriptive `aria-label` attributes for each letter
- **Toggle button**: `aria-pressed` state for RGB keyboard toggle
- **Game status**: `aria-live="polite"` for dynamic content updates
- **Toast messages**: `role="alert"` with `aria-live="assertive"`

### Focus Management
- All interactive elements are keyboard accessible
- Proper tab order maintained
- Focus indicators preserved

### Screen Reader Support
- Descriptive labels for all interactive elements
- Status updates announced to screen readers
- Game state changes communicated appropriately

## 🧪 Testing Accessibility

### Automated Testing with Vitest

Run accessibility tests:
```bash
npm run test:a11y
```

Run all tests:
```bash
npm run test
```

### Manual Testing with axe-core

1. **Browser Extension**: Install the "axe DevTools" browser extension
2. **Standalone Tool**: Open `public/a11y-audit.html` in your browser
3. **Command Line**: Use the installed axe-core package

### Testing Checklist

- [ ] Run automated accessibility tests
- [ ] Test with keyboard navigation only
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Check color contrast ratios
- [ ] Verify focus indicators
- [ ] Test with high contrast mode
- [ ] Validate semantic structure

## 🔧 Accessibility Testing Setup

### Dependencies
- `@axe-core/react`: React-specific accessibility testing
- `jest-axe`: Jest matchers for accessibility testing
- `@testing-library/react`: React component testing utilities

### Test Files
- `src/App.a11y.test.jsx`: Main accessibility test suite
- `src/setupTests.js`: Test environment configuration

### Configuration
- Vitest configured with jsdom environment
- Jest DOM matchers for enhanced assertions
- Proper mocking for browser APIs

## 📱 Responsive Accessibility

### Mobile Considerations
- Touch targets meet minimum size requirements (44px)
- Gesture alternatives for mouse interactions
- Viewport meta tag properly configured

### Keyboard Navigation
- Tab order follows logical flow
- Enter/Space key support for buttons
- Escape key handling where appropriate

## 🎨 Color and Contrast

### Current Implementation
- Dark/light mode support
- High contrast color schemes
- Accessible color combinations

### Testing
- Use browser dev tools to check contrast ratios
- Test with color blindness simulators
- Verify readability in different lighting conditions

## 🚀 Running Accessibility Audits

### Quick Audit
```bash
# Check axe-core version
npm run a11y:audit

# Run accessibility tests
npm run test:a11y
```

### Comprehensive Testing
1. Start development server: `npm run dev`
2. Open `public/a11y-audit.html` in browser
3. Run audit on your game page
4. Review and fix violations

### Continuous Integration
- Accessibility tests run with unit tests
- Automated violation detection
- Build fails on critical accessibility issues

## 📚 Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [axe-core Documentation](https://dequeuniversity.com/rules/axe/)

### Tools
- [axe DevTools Browser Extension](https://www.deque.com/axe/browser-extensions/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)

### Testing
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [JAWS Screen Reader](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (macOS)](https://www.apple.com/accessibility/vision/)

## 🔍 Common Issues and Fixes

### Missing ARIA Labels
- Add descriptive `aria-label` attributes
- Use `aria-labelledby` for complex relationships
- Ensure labels are unique and meaningful

### Color Contrast
- Use contrast ratio checkers
- Implement high contrast mode
- Test with color blindness simulators

### Focus Management
- Ensure all interactive elements are focusable
- Maintain logical tab order
- Provide visible focus indicators

### Screen Reader Support
- Test with actual screen readers
- Verify announcement order
- Check for redundant information

## 📈 Continuous Improvement

### Regular Audits
- Run accessibility tests weekly
- Review new features for accessibility
- Update testing procedures as needed

### User Feedback
- Gather feedback from users with disabilities
- Test with assistive technologies
- Monitor accessibility-related issues

### Standards Compliance
- Target WCAG 2.1 AA compliance
- Stay updated with accessibility guidelines
- Implement best practices consistently

---

**Remember**: Accessibility is not a one-time task but an ongoing commitment to inclusive design. Regular testing and user feedback are essential for maintaining and improving accessibility standards.
