/// vitest.config.js
import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js", "./src/setupTests.js"],
    exclude: [...configDefaults.exclude, "e2e-tests/**"],
  },
});
