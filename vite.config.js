import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'preview-production-routes',
      configurePreviewServer(server) {
        const routes = new Set([...readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname))
        const { redirects } = JSON.parse(readFileSync('vercel.json', 'utf8'))
        const rules = redirects.map(rule => ({
          pattern: new RegExp('^' + rule.source.replace(/:(\w+)\(([^)]+)\)/g, '(?<$1>$2)') + '$'),
          destination: rule.destination
        }))
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url, 'http://localhost')
          for (const rule of rules) {
            const match = rule.pattern.exec(url.pathname)
            if (match) {
              res.writeHead(308, { Location: rule.destination.replace(/:(\w+)/g, (_, key) => match.groups[key]) + url.search })
              return res.end()
            }
          }
          if (routes.has(url.pathname)) req.url = (url.pathname === '/' ? '/index' : url.pathname) + '.html' + url.search
          else if (!url.pathname.split('/').pop().includes('.')) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
            return res.end(readFileSync('dist/404.html'))
          }
          next()
        })
      }
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('i18next')) {
              return 'vendor-i18n';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-other';
          }
        }
      }
    }
  }
})
