import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// After deploying, put the live address here (no trailing slash), e.g. 'https://nagaprajwalith.vercel.app'.
// Link previews on LinkedIn/WhatsApp need full URLs for the image.
const SITE_URL = 'https://nagaprajwalith.github.io'

function siteUrl(): Plugin {
  return { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL) }
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), siteUrl()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    rolldownOptions: {
      output: {
        // keep big libraries in their own cached files so content edits don't re-download them
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules[\/](react|react-dom|scheduler)[\/]/ },
            { name: 'motion', test: /node_modules[\/](motion|framer-motion|motion-dom|motion-utils)[\/]/ },
          ],
        },
      },
    },
  },
})
