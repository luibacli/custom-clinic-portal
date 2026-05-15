import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: 'dist',
  },
  base: '/',
  server: {
    headers: {
      'Permissions-Policy': 'camera=(self), microphone=(self)',
    },
  },
})
