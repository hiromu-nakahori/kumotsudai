import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    build: {
      cssCodeSplit: false, // CSSを一つのファイルにまとめる
      rollupOptions: {
        output: {
          manualChunks: undefined, // すべてのモジュールを一つのチャンクにまとめる
        },
      },
    }
})
