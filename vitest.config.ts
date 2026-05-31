import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    // Only run our unit specs; never let Vitest wander into e2e/build output.
    include: ["**/*.test.{ts,tsx}"],
  },
});
