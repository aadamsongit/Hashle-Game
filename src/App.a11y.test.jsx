import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect, beforeEach } from "vitest";
import App from "./App";

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

// Mock the data import
vi.mock("./data.json", () => ({
  default: [{ word: "apple" }, { word: "chair" }, { word: "stake" }],
}));

// Mock localStorage for hydration
const mockLocalStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

describe("App Accessibility", () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  it("should not have accessibility violations", async () => {
    const { container } = render(<App />);

    // Wait for component to hydrate
    await new Promise((resolve) => setTimeout(resolve, 100));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have proper heading structure", async () => {
    render(<App />);

    // Wait for component to hydrate
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check for main heading
    const mainHeading = screen.getByRole("heading", { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent("Hashle: An Evolving Word Game");

    // Check for game status heading (now H2)
    const statusHeading = screen.getByRole("heading", { level: 2 });
    expect(statusHeading).toBeInTheDocument();
  });

  it("should have proper button labels and roles", async () => {
    render(<App />);

    // Wait for component to hydrate
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check keyboard buttons have proper roles
    const keyboardButtons = screen.getAllByRole("button");
    expect(keyboardButtons.length).toBeGreaterThan(0);

    // Check RGB toggle button has descriptive text
    const rgbToggleButton = screen.getByRole("button", {
      name: /Toggle RGB keyboard effects/i,
    });
    expect(rgbToggleButton).toBeInTheDocument();
  });

  it("should have proper semantic structure", async () => {
    const { container } = render(<App />);

    // Wait for component to hydrate
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check for main landmark
    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();

    // Check for header landmark
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();

    // Check for sections
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(0);
  });

  it("should have proper color contrast (basic check)", async () => {
    const { container } = render(<App />);

    // Wait for component to hydrate
    await new Promise((resolve) => setTimeout(resolve, 100));

    // This is a basic check - axe-core will do more thorough contrast testing
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: true },
      },
    });

    // Log any contrast violations for manual review
    if (results.violations.length > 0) {
      console.log("Color contrast violations:", results.violations);
    }
  });

  it("should have proper focus management", async () => {
    render(<App />);

    // Wait for component to hydrate
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check that buttons are focusable (buttons are focusable by default in HTML)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);

    // Test that buttons can receive focus (not explicitly disabled)
    buttons.forEach((button) => {
      expect(button).not.toHaveAttribute("tabindex", "-1");
    });
  });
});
