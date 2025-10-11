import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  preview: {
    allowedHosts: ['logistics-drone.onrender.com']
  }
})