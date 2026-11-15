
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Custom Vite plugin for GitHub Pages SPA deployment.
 * Duplicates dist/index.html to dist/404.html so GitHub Pages can route
 * direct hits and page refreshes on nested paths (e.g. /locations, /assessment)
 * directly into the client-side Single-Page Application.
 */
function githubPagesSpaFallbackPlugin() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      try {
        const distDir = path.resolve(process.cwd(), 'dist')
        const indexHtml = path.join(distDir, 'index.html')
        const notFoundHtml = path.join(distDir, '404.html')
        if (fs.existsSync(indexHtml)) {
          fs.copyFileSync(indexHtml, notFoundHtml)
          console.log('[vite:github-pages] Successfully generated dist/404.html SPA fallback.')
        }
      } catch (err) {
        console.warn('[vite:github-pages] Warning: Could not generate dist/404.html:', err.message)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), githubPagesSpaFallbackPlugin()],
  base: '/AeroKrypt/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
