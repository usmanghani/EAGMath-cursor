import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true,
    strictPort: true
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets'
  },
  preview: {
    port: 5173,
    host: true,
    open: true
  }
}) 