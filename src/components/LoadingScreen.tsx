/**
 * ==============================================================================
 * 供物台（Kumotsudai）- ローディング画面コンポーネント
 * ==============================================================================
 * 
 * 【概要】
 * 高速ローディングスクリーンコンポーネント。
 * テーマに応じた神秘的な演出とプログレス表示を提供。
 * 
 * 【機能】
 * - テーマ別ローディングメッセージ
 * - プログレスバーアニメーション
 * - 段階的ローディング表示
 * - アクセシビリティ対応
 * 
 * @version 2.0.0
 * @author 供物台開発チーム
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import type { ILoadingScreenProps } from '../types/enterprise';
import { LoggerService } from '../services/logger';

/**
 * 高速ローディングスクリーンコンポーネント
 * テーマに応じた神秘的な演出とプログレス表示
 */
export const UltraFastLoadingScreen: React.FC<ILoadingScreenProps> = React.memo(({ 
  theme, 
  progress = 0, 
  stage = '' 
}) => {
  // 依存関係注入
  const logger = useMemo(() => LoggerService.getInstance(), []);
  
  // 状態管理
  const [loadingText, setLoadingText] = useState('');
  const [animationPhase, setAnimationPhase] = useState(0);

  // テーマ別メッセージ（メモ化でパフォーマンス向上）
  const loadingMessages = useMemo(() => ({
    autumn: [
      '秋の森が目覚めています...',
      '紅葉の精霊が集まっています...',
      '神秘の力が満ちています...',
      '古の知恵が蘇ります...'
    ],
    winter: [
      '冬の精霊が準備中...',
      '雪の結晶が舞っています...',
      '氷の宮殿が輝いています...',
      '静寂の力が集まっています...'
    ]
  }), []);

  // プログレスに応じたメッセージ更新
  useEffect(() => {
    const messages = loadingMessages[theme];
    const messageIndex = Math.min(Math.floor(progress / 25), messages.length - 1);
    const message = messages[messageIndex];
    
    setLoadingText(message);
    setAnimationPhase(messageIndex);
    
    // ローディング状態をログ記録
    logger.debug('ローディング進捗更新', {
      theme,
      progress,
      stage,
      message,
      animationPhase: messageIndex
    });
  }, [theme, progress, stage, loadingMessages, logger]);

  return (
    <div 
      className={`${theme === 'autumn' ? 'autumn-theme' : 'winter-theme'} min-h-screen flex items-center justify-center performance-optimized`}
      role="main"
      aria-label="アプリケーション読み込み中"
    >
      <div className="text-center space-y-6 animate-fade-in max-w-md mx-auto px-4">
        {/* メインローディングアニメーション */}
        <div className="relative">
          <div className="relative z-10">
            <Loader2 size={64} className="animate-spin text-primary mx-auto" />
          </div>
          
          {/* 背景の神秘的な光彩効果 */}
          <div className="absolute inset-0 animate-ping opacity-20">
            <Loader2 size={64} className="text-accent mx-auto" />
          </div>
          
          {/* さらなる光彩効果 */}
          <div className="absolute inset-0 animate-pulse opacity-10">
            <div className="w-32 h-32 bg-primary rounded-full mx-auto blur-xl"></div>
          </div>
        </div>
        
        {/* ローディングテキスト */}
        <div className="space-y-3">
          <h2 className="text-2xl font-medium text-primary animate-pulse">
            {loadingText}
          </h2>
          <p className="text-muted-foreground">
            {stage || '神秘的な世界への扉を開いています'}
          </p>
        </div>
        
        {/* プログレスバー */}
        <div className="w-full max-w-sm mx-auto space-y-2">
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${Math.min(progress, 100)}%`,
                background: theme === 'autumn' 
                  ? 'linear-gradient(90deg, var(--autumn-primary), var(--autumn-gold), var(--autumn-crimson))'
                  : 'linear-gradient(90deg, var(--winter-primary), var(--winter-accent), var(--winter-ice))'
              }}
            />
          </div>
          
          {/* プログレス表示 */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>進捗状況</span>
            <span className="font-medium">{Math.min(progress, 100)}%</span>
          </div>
        </div>
        
        {/* アニメーション段階に応じた追加要素 */}
        {animationPhase >= 2 && (
          <div className="animate-slide-in-right">
            <p className="text-xs text-muted-foreground opacity-70">
              まもなく完了します...
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

UltraFastLoadingScreen.displayName = 'UltraFastLoadingScreen';