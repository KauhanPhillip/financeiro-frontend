import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // ADICIONE ISSO

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ADICIONE ISSO
  ],
})