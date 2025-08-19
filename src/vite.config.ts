/**
 * Vite 設定ファイル - 供物台（Kumotsudai）
 * AWS Amplify デプロイ最適化対応
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      // React の最適化
      jsxImportSource: '@emotion/react',
    })
  ],
  
  // CSS 処理の最適化
  css: {
    postcss: {
      plugins: [
        // Tailwind CSS V4 の統合は globals.css で行う
      ],
    },
    // CSS の圧縮
    devSourcemap: false,
  },
  
  // ビルド最適化
  build: {
    // 出力ディレクトリ
    outDir: 'dist',
    
    // ソースマップ無効化（本番環境）
    sourcemap: false,
    
    // ターゲット環境
    target: 'es2022',
    
    // 圧縮設定
    minify: 'esbuild',
    cssMinify: true,
    
    // バンドル最適化
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // チャンク分割
        manualChunks: {
          // React 関連
          'vendor-react': ['react', 'react-dom'],
          
          // UI ライブラリ
          'vendor-ui': [
            'lucide-react',
            'sonner',
            '@radix-ui/react-dialog',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select'
          ],
          
          // ユーティリティ
          'vendor-utils': [
            'date-fns',
            'clsx'
          ]
        },
        
        // ファイル名のパターン
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const extType = info[info.length - 1]
          
          // ファイルタイプ別のディレクトリ分け
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/img/[name]-[hash][extname]`
          }
          if (/css/i.test(extType)) {
            return `assets/css/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          
          return `assets/[name]-[hash][extname]`
        },
      },
    },
    
    // バンドルサイズ制限
    chunkSizeWarningLimit: 1000,
    
    // CSS コード分割を無効化（Amplify での安定性向上）
    cssCodeSplit: false,
    
    // 依存関係の最適化
    commonjsOptions: {
      include: [/node_modules/],
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
  
  // パス解決
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@components': resolve(__dirname, 'components'),
      '@styles': resolve(__dirname, 'styles'),
      '@services': resolve(__dirname, 'services'),
      '@types': resolve(__dirname, 'types'),
    },
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