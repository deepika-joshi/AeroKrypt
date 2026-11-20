
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

function githubPagesSpaFallbackPlugin() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist')
      const indexHtml = path.join(distDir, 'index.html')
      const notFoundHtml = path.join(distDir, '404.html')

      if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, notFoundHtml)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), githubPagesSpaFallbackPlugin()],
  base: process.env.GITHUB_PAGES === 'true' ? '/AeroKrypt/' : '/', server: {
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
