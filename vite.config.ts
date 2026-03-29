import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["tests/e2e/**"]
  },
  server: {
    host: "127.0.0.1",
    port: 3000,
    strictPort: true
  },
  preview: {
    host: "127.0.0.1",
    port: 3000,
    strictPort: true
  }
});
