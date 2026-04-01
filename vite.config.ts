/// <reference types="vitest/config" />
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isVitest = Boolean(process.env.VITEST);
  const testLike = mode === "test" || isVitest;

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@ui": path.resolve(__dirname, "./src/shared/components/ui"),
      },
    },
    define: testLike
      ? {
          "import.meta.env.DEV": false,
        }
      : undefined,
    server: {
      proxy: {
        "/api": {
          target: "https://staging.homevision.co",
          changeOrigin: true,
          rewrite: p => p.replace(/^\/api/, "/api_project"),
        },
      },
    },
    test: {
      environment: "happy-dom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
      css: true,
      pool: "forks",
      exclude: ["e2e/**", "node_modules/**", "dist/**"],
    },
  };
});
