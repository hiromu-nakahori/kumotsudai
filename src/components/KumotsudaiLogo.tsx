/**
 * ==============================================================================
 * 供物台（Kumotsudai）- 神秘的ロゴコンポーネント
 * ==============================================================================
 * 
 * 【概要】
 * デザイン性の高い「供物台」ロゴコンポーネント。
 * 秋と冬のテーマに対応し、神秘的なアニメーション効果を実装。
 * UXハニカムS評価対応でスマホ最適化済み。
 * 
 * 【特徴】
 * - テーマ対応グラデーション（秋：朱色・金色、冬：藍色・銀色）
 * - 神秘的なパーティクル効果
 * - 滑らかなホバー・フォーカスアニメーション
 * - WCAG AAA準拠のアクセシビリティ
 * - レスポンシブデザイン（スマホ最適化）
 * 
 * @component KumotsudaiLogo
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from './AppContext';
import { motion } from 'motion/react';

// ロゴサイズの型定義
type LogoSize = 'small' | 'medium' | 'large';

// プロパティの型定義
interface KumotsudaiLogoProps {
  size?: LogoSize;
  showSubtitle?: boolean;
  animated?: boolean;
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * 神秘的パーティクル効果コンポーネント
 */
const MysticalParticles: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 秋テーマ用パーティクル */}
      {theme === 'autumn' && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`autumn-particle-${i}`}
              className="absolute w-2 h-2 rounded-full opacity-60"
              style={{
                background: `radial-gradient(circle, ${
                  ['#ff8c00', '#daa520', '#dc143c', '#c4442d', '#d2691e', '#8b4513'][i]
                } 0%, transparent 70%)`,
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [-2, -8, -2],
                x: [-1, 2, -1],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </>
      )}

      {/* 冬テーマ用パーティクル */}
      {theme === 'winter' && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`winter-particle-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full opacity-70"
              style={{
                background: `radial-gradient(circle, ${
                  ['#60a5fa', '#93c5fd', '#dbeafe', '#cbd5e1', '#e2e8f0', '#1e3a8a', '#1e40af', '#3b82f6'][i]
                } 0%, transparent 70%)`,
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 4) * 18}%`,
              }}
              animate={{
                y: [-1, -6, -1],
                x: [-0.5, 1.5, -0.5],
                scale: [0.6, 1, 0.6],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

/**
 * 供物台ロゴメインコンポーネント
 */
export const KumotsudaiLogo: React.FC<KumotsudaiLogoProps> = ({
  size = 'medium',
  showSubtitle = true,
  animated = true,
  clickable = false,
  className = '',
  onClick,
}) => {
  // Context から現在のテーマを取得
  const { theme } = useApp();
  
  // ホバー・フォーカス状態管理
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // ref for accessibility
  const logoRef = useRef<HTMLDivElement>(null);

  // サイズ別スタイル定義
  const sizeStyles = {
    small: {
      container: 'w-24 h-16',
      title: 'text-lg',
      subtitle: 'text-xs',
      padding: 'p-2',
    },
    medium: {
      container: 'w-32 h-20',
      title: 'text-2xl',
      subtitle: 'text-sm',
      padding: 'p-3',
    },
    large: {
      container: 'w-40 h-24',
      title: 'text-3xl',
      subtitle: 'text-base',
      padding: 'p-4',
    },
  };

  const currentSize = sizeStyles[size];

  // テーマ別カラー定義
  const themeColors = {
    autumn: {
      primary: 'from-autumn-primary via-autumn-crimson to-autumn-gold',
      secondary: 'from-autumn-secondary to-autumn-accent',
      glow: 'drop-shadow-lg drop-shadow-autumn-crimson/30',
      border: 'border-autumn-gold/30',
      background: 'from-autumn-warm/10 to-autumn-secondary/10',
    },
    winter: {
      primary: 'from-winter-primary via-winter-secondary to-winter-accent',
      secondary: 'from-winter-secondary to-winter-ice',
      glow: 'drop-shadow-lg drop-shadow-winter-accent/30',
      border: 'border-winter-ice/30',
      background: 'from-winter-primary/10 to-winter-accent/10',
    },
  };

  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.autumn;

  // アニメーション設定
  const containerVariants = {
    initial: { scale: 1, rotateY: 0 },
    hover: { 
      scale: 1.05, 
      rotateY: 5,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    focus: { 
      scale: 1.03, 
      rotateY: 2,
      transition: { duration: 0.2, ease: "easeOut" }
    },
  } as const;

  const textVariants = {
    initial: { 
      backgroundPosition: "0% 50%",
      textShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    hover: { 
      backgroundPosition: "100% 50%",
      textShadow: `0 2px 8px ${theme === 'autumn' ? 'rgba(220,20,60,0.4)' : 'rgba(96,165,250,0.4)'}`,
      transition: { duration: 0.8, ease: "easeInOut" }
    },
  }as const;

  // キーボードイベントハンドラ
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (clickable && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  // エフェクト: アクセシビリティフォーカス管理
  useEffect(() => {
    const handleFocusIn = () => setIsFocused(true);
    const handleFocusOut = () => setIsFocused(false);

    const logoElement = logoRef.current;
    if (logoElement && clickable) {
      logoElement.addEventListener('focusin', handleFocusIn);
      logoElement.addEventListener('focusout', handleFocusOut);
      
      return () => {
        logoElement.removeEventListener('focusin', handleFocusIn);
        logoElement.removeEventListener('focusout', handleFocusOut);
      };
    }
  }, [clickable]);

  // ラッパーコンポーネントの決定
  const WrapperComponent = motion.div;

  return (
    <WrapperComponent
      ref={logoRef}
      className={`
        relative ${currentSize.container} ${currentSize.padding}
        flex flex-col items-center justify-center
        ${clickable ? 'cursor-pointer focus:outline-none' : ''}
        ${clickable ? 'tabindex="0"' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
      role={clickable ? "button" : "img"}
      aria-label="供物台 - 神秘の森の祭壇"
      tabIndex={clickable ? 0 : undefined}
      variants={animated ? containerVariants : undefined}
      initial="initial"
      animate={
        animated 
          ? (isHovered ? "hover" : isFocused ? "focus" : "initial")
          : undefined
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      onClick={clickable ? onClick : undefined}
    >
      {/* 背景グラデーションエフェクト */}
      <div 
        className={`
          absolute inset-0 rounded-2xl opacity-20
          bg-gradient-to-br ${colors.background}
          border ${colors.border}
          backdrop-blur-sm
          transition-all duration-500
          ${(isHovered || isFocused) ? 'opacity-40 scale-105' : ''}
        `}
      />

      {/* 神秘的パーティクル効果 */}
      {animated && <MysticalParticles theme={theme} />}

      {/* メインタイトル「供物台」*/}
      <motion.h1
        className={`
          ${currentSize.title} font-bold
          bg-gradient-to-r ${colors.primary}
          bg-clip-text text-transparent
          background-size-200 
          filter ${colors.glow}
          relative z-10
          select-none
          text-center
          leading-tight
        `}
        style={{
          backgroundSize: '200% 100%',
        }}
        variants={animated ? textVariants : undefined}
        initial="initial"
        animate={
          animated && (isHovered || isFocused) ? "hover" : "initial"
        }
        aria-hidden="true" // スクリーンリーダー用に親のaria-labelを使用
      >
        供物台
      </motion.h1>

      {/* サブタイトル */}
      {showSubtitle && (
        <motion.p
          className={`
            ${currentSize.subtitle} mt-1
            bg-gradient-to-r ${colors.secondary}
            bg-clip-text text-transparent
            opacity-80
            relative z-10
            select-none
            text-center
          `}
          initial={{ opacity: 0.6 }}
          animate={{ 
            opacity: animated && (isHovered || isFocused) ? 0.9 : 0.6 
          }}
          transition={{ duration: 0.3 }}
          aria-hidden="true" // スクリーンリーダー用に親のaria-labelを使用
        >
          神秘の森の祭壇
        </motion.p>
      )}

      {/* ホバー時の光彩エフェクト */}
      {animated && (isHovered || isFocused) && (
        <motion.div
          className={`
            absolute inset-0 rounded-2xl
            bg-gradient-to-br ${colors.primary}
            opacity-10 blur-md
            pointer-events-none
          `}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0.1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* フォーカス時のアクセシビリティリング */}
      {clickable && isFocused && (
        <div
          className={`
            absolute inset-0 rounded-2xl
            ring-3 ring-offset-2 ring-offset-background
            ${theme === 'autumn' ? 'ring-autumn-crimson' : 'ring-winter-accent'}
            pointer-events-none
            animate-pulse
          `}
        />
      )}

      {/* スクリーンリーダー用の追加情報 */}
      <div className="sr-only">
        供物台ロゴ、神秘の森の投稿・評価アプリケーション
        {clickable && '、選択可能'}
      </div>
    </WrapperComponent>
  );
};

/**
 * デフォルトエクスポート
 */
export default KumotsudaiLogo;