import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8154,
    proxy: {
      '/login':            'http://127.0.0.1:8153',
      '/signup':           'http://127.0.0.1:8153',
      '/events':           'http://127.0.0.1:8153',
      '/event':            'http://127.0.0.1:8153',
      '/classify_upload':  'http://127.0.0.1:8153',
      '/live_feed':        'http://127.0.0.1:8153',
      '/admin-dashboard':  'http://127.0.0.1:8153',
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 8154,
  },
})
