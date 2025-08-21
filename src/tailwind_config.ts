/**
 * Tailwind CSS V4 設定ファイル - 供物台（Kumotsudai）専用
 * 
 * AWS Amplify デプロイ対応の最適化設定
 * 秋・冬テーマの神秘的なデザインシステム
 */

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './App.tsx'
  ],
  
  // V4対応：テーマ設定
  theme: {
    extend: {
      // カスタムカラーパレット
      colors: {
        // 秋テーマカラー
        'autumn-primary': 'var(--autumn-primary)',
        'autumn-secondary': 'var(--autumn-secondary)', 
        'autumn-accent': 'var(--autumn-accent)',
        'autumn-warm': 'var(--autumn-warm)',
        'autumn-gold': 'var(--autumn-gold)',
        'autumn-crimson': 'var(--autumn-crimson)',
        'autumn-ochre': 'var(--autumn-ochre)',
        'autumn-leaf': 'var(--autumn-leaf)',
        'autumn-text': 'var(--autumn-text)',
        'autumn-text-light': 'var(--autumn-text-light)',
        
        // 冬テーマカラー
        'winter-primary': 'var(--winter-primary)',
        'winter-secondary': 'var(--winter-secondary)',
        'winter-accent': 'var(--winter-accent)',
        'winter-ice': 'var(--winter-ice)',
        'winter-frost': 'var(--winter-frost)',
        'winter-deep': 'var(--winter-deep)',
        'winter-silver': 'var(--winter-silver)',
        'winter-snow': 'var(--winter-snow)',
        'winter-text': 'var(--winter-text)',
        'winter-text-muted': 'var(--winter-text-muted)',
        'winter-text-secondary': 'var(--winter-text-secondary)',
        'winter-text-tertiary': 'var(--winter-text-tertiary)',
        'winter-text-dark': 'var(--winter-text-dark)',
        'winter-input-background': 'var(--winter-input-background)',
        'winter-input-border': 'var(--winter-input-border)',
        
        // システムカラー
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        'input-background': 'var(--input-background)',
        ring: 'var(--ring)',
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
      },
      
      // カスタムフォントサイズ（アクセシビリティ重視）
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.4' }],   // 12px
        'sm': ['0.875rem', { lineHeight: '1.4' }],  // 14px
        'base': ['1rem', { lineHeight: '1.6' }],    // 16px
        'lg': ['1.125rem', { lineHeight: '1.4' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.4' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '1.4' }],   // 24px
        '3xl': ['1.875rem', { lineHeight: '1.4' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '1.4' }],  // 36px
      },
      
      // カスタムボーダー半径
      borderRadius: {
        'sm': 'calc(var(--radius) - 4px)',
        'md': 'calc(var(--radius) - 2px)', 
        'lg': 'var(--radius)',
        'xl': 'calc(var(--radius) + 4px)',
      },
      
      // カスタムアニメーション
      animation: {
        'ultra-fast-fade-in': 'ultraFastFadeIn 0.2s ease-out',
        'autumn-float': 'autumnFloat 15s ease-in-out infinite',
        'winter-float': 'winterFloat 20s ease-in-out infinite',
        'mystical-glow': 'mysticalGlow 3s ease-in-out infinite',
        'spirit-dance': 'spiritDance 6s linear infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'shimmer': 'shimmer 1s infinite',
        'error-shake': 'errorShake 0.3s ease-in-out',
        'celebration': 'celebration 0.4s ease-in-out',
        'shake': 'shake 0.2s ease-in-out',
        'satisfying-click': 'satisfyingClick 0.1s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.2s ease-out',
        'pulse': 'pulse 1.5s infinite',
      },
      
      // カスタムキーフレーム
      keyframes: {
        ultraFastFadeIn: {
          'from': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        autumnFloat: {
          '0%, 100%': {
            opacity: '0.3',
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            opacity: '0.7',
            transform: 'translateY(-10px) rotate(180deg)',
          },
        },
        winterFloat: {
          '0%, 100%': {
            opacity: '0.2',
            transform: 'translateY(0px) scale(1)',
          },
          '50%': {
            opacity: '0.5',
            transform: 'translateY(-5px) scale(1.1)',
          },
        },
        mysticalGlow: {
          '0%, 100%': {
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            opacity: '0.5',
          },
          '50%': {
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            opacity: '0.8',
          },
        },
        spiritDance: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '33%': { transform: 'rotate(120deg) scale(1.1)' },
          '66%': { transform: 'rotate(240deg) scale(0.9)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        errorShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        celebration: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.1) rotate(5deg)' },
          '50%': { transform: 'scale(1.2) rotate(-5deg)' },
          '75%': { transform: 'scale(1.1) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        satisfyingClick: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          'from': { opacity: '0', transform: 'translateX(-30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          'from': { opacity: '0', transform: 'translateX(30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
      },
      
      // カスタムトランジション
      transitionTimingFunction: {
        'ultra-fast': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'mystical': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      
      // カスタムサイズ
      minHeight: {
        'touch-target': '48px',
        'touch-target-large': '56px',
      },
      
      minWidth: {
        'touch-target': '48px', 
        'touch-target-large': '56px',
      },
      
      // カスタムシャドウ
      boxShadow: {
        'mystical': '0 0 8px currentColor, 0 0 16px currentColor',
        'premium': '0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
        'autumn': '0 2px 8px rgba(196, 68, 45, 0.08)',
        'winter': '0 2px 8px rgba(30, 58, 138, 0.12), 0 4px 16px rgba(59, 130, 246, 0.08)',
      },
      
      // カスタムフィルター
      filter: {
        'mystical-glow': 'drop-shadow(0 0 8px currentColor) drop-shadow(0 0 16px currentColor)',
      },
      
      // カスタムバックドロップフィルター
      backdropBlur: {
        'mystical': '8px',
      },
    },
  },
  
  // V4対応：プラグイン設定
  plugins: [
    // カスタムユーティリティクラス
    function({ addUtilities, addComponents }: any) {
      addUtilities({
        // パフォーマンス最適化
        '.performance-optimized': {
          contain: 'layout style paint',
          transform: 'translateZ(0)',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        
        // 高速トランジション
        '.ultra-fast-transition': {
          transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        
        // テーマトランジション
        '.theme-transition': {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        
        // タッチターゲット
        '.large-clickable': {
          minHeight: '48px',
          minWidth: '48px',
        },
        
        '.large-clickable-mobile': {
          '@media (max-width: 768px)': {
            minHeight: '56px',
            minWidth: '56px',
          },
        },
        
        // ハプティックフィードバック
        '.haptic-feedback': {
          transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        
        // 高コントラストテキスト
        '.high-contrast-text': {
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        },
        
        // ローディング状態
        '.loading-shimmer': {
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(90deg, var(--muted) 25%, var(--accent) 50%, var(--muted) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1s infinite',
        },
        
        // エラー状態
        '.error-state': {
          border: '2px solid var(--destructive)',
          boxShadow: '0 0 0 3px rgba(212, 24, 61, 0.1)',
          animation: 'errorShake 0.3s ease-in-out',
        },
        
        // 神秘的な光彩
        '.mystical-glow': {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            opacity: '0',
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
          },
          '&:hover::after': {
            opacity: '1',
          },
        },
        
        // プログレスバー
        '.progress-bar': {
          width: '100%',
          height: '8px',
          background: 'var(--muted)',
          borderRadius: '999px',
          overflow: 'hidden',
        },
        
        '.progress-fill': {
          height: '100%',
          background: 'linear-gradient(90deg, var(--primary), var(--accent))',
          borderRadius: '999px',
          transition: 'width 0.2s ease',
        },
      });
      
      addComponents({
        // カスタムカードコンポーネント
        '.card-mystical': {
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: 'var(--premium-shadow)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          },
        },
        
        // カスタムボタンコンポーネント
        '.btn-mystical': {
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          fontWeight: '500',
          fontSize: '1rem',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          minHeight: '48px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            transform: 'translateY(-1px)',
            filter: 'brightness(1.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
            transition: 'all 0.1s',
          },
        },
        
        // カスタム入力フィールド
        '.input-mystical': {
          width: '100%',
          padding: '0.75rem 1rem',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          background: 'var(--input-background)',
          fontSize: '1rem',
          lineHeight: '1.4',
          transition: 'all 0.15s ease',
          '&:focus': {
            outline: 'none',
            borderColor: 'var(--ring)',
            boxShadow: '0 0 0 3px rgba(var(--ring), 0.2)',
          },
        },
      });
    },
  ],
}

export default config