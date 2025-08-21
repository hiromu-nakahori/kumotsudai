/**
 * Vite 設定ファイル - 供物台（Kumotsudai）
 * AWS Amplify デプロイ最適化対応
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcssPostcss from '@tailwindcss/postcss'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcssPostcss()
      ],
    },
  },
  build: {
    cssCodeSplit: false, // CSS を一つのファイルにまとめる
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  
  // 開発サーバー設定
  server: {
    host: true,
    port: 3000,
    strictPort: false,
    
    // HMR 設定
    hmr: {
      overlay: true,
    },
    
    // プロキシ設定（開発時のAPI接続用）
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // プレビューサーバー設定
  preview: {
    host: true,
    port: 4173,
    strictPort: false,
  },
  
  // 依存関係の最適化
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'sonner',
    ],
    exclude: [
      // 最適化から除外する依存関係
    ],
  },
  
  // 環境変数の設定
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  
  // 実験的機能
  experimental: {
    // より高速なビルド
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` }
      } else {
        return { relative: true }
      }
    },
  },
  
  // ログレベル
  logLevel: 'info',
  
  // Amplify 固有の設定
  base: '/',
  
  // 公開ディレクトリ
  publicDir: 'public',
  
  // アセット処理
  assetsInclude: ['**/*.woff', '**/*.woff2'],
  
  // ワーカー設定
  worker: {
    format: 'es',
  },
})