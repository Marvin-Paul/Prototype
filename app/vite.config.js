import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

const entry = (file) => fileURLToPath(new URL(file, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: entry('index.html'),
        dashboard: entry('dashboard.html'),
        settings: entry('settings.html'),
        support: entry('support.html'),
        chatbot: entry('chatbot.html'),
        adminLogin: entry('admin-login.html'),
        adminDashboard: entry('admin-dashboard.html'),
      },
    },
  },
})
