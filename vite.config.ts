import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Avoid browser CORS against staging API in local dev; fetch uses /api/... in dev.
    proxy: {
      '/api': {
        target: 'https://staging.homevision.co',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '/api_project'),
      },
    },
  },
})
