import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  // @resvg/resvg-js is a native (.node) module used only in the OG-image server
  // route. Keep it out of Vite's dev dep-optimization (which can't load the
  // binary) and external in SSR so Node loads the native binding directly.
  optimizeDeps: {
    exclude: ['@resvg/resvg-js'],
  },
  ssr: {
    external: ['@resvg/resvg-js'],
  },
  plugins: [tailwindcss(), tanstackStart(), viteReact(), nitro()],
})
