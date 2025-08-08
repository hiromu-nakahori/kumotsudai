/**
 * ==============================================================================
 * 供物台（Kumotsudai）- ネットワーク監視コンポーネント
 * ==============================================================================
 * 
 * 【概要】
 * 最適化されたネットワーク監視コンポーネント。
 * リアルタイムネットワーク状態監視とユーザーフィードバックを提供。
 * 
 * 【機能】
 * - ネットワーク接続状態の監視
 * - 接続品質チェック
 * - ユーザーへの状態通知
 * - アクセシビリティ対応
 * 
 * @version 2.0.0
 * @author 供物台開発チーム
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { LoggerService } from '../services/logger';

/**
 * 最適化されたネットワーク監視コンポーネント
 * リアルタイムネットワーク状態監視とユーザーフィードバック
 */
export const OptimizedNetworkMonitor: React.FC = React.memo(() => {
  // 依存関係注入
  const logger = useMemo(() => LoggerService.getInstance(), []);
  
  // 状態管理
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<'high' | 'medium' | 'low'>('high');
  
  /**
   * ネットワーク品質チェック
   * 軽量なHTTPヘッドリクエストでレイテンシを測定
   */
  const checkNetworkQuality = useCallback(async () => {
    if (!isOnline) {
      setConnectionQuality('low');
      return;
    }
    
    try {
      const startTime = performance.now();
      const response = await fetch('https://httpbin.org/get', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(3000)
      });
      const endTime = performance.now();
      
      if (response.ok) {
        const latency = endTime - startTime;
        
        if (latency < 200) {
          setConnectionQuality('high');
        } else if (latency < 1000) {
          setConnectionQuality('medium');
        } else {
          setConnectionQuality('low');
        }
        
        logger.debug('ネットワーク品質チェック完了', {
          latency,
          quality: connectionQuality
        });
      }
    } catch (error) {
      setConnectionQuality('low');
      logger.warn('ネットワーク品質チェックに失敗', { error });
    }
  }, [isOnline, logger, connectionQuality]);
  
  useEffect(() => {
    /**
     * オンライン復旧時の処理
     */
    const handleOnline = () => {
      setIsOnline(true);
      
      // ネットワーク品質チェック
      checkNetworkQuality();
      
      toast.success('🌐 ネットワーク復旧', {
        description: '接続が復旧しました',
        icon: <Wifi className="w-4 h-4" />,
        duration: 2000,
      });
      
      logger.info('ネットワーク接続復旧', {
        timestamp: new Date(),
        userAgent: navigator.userAgent
      });
    };

    /**
     * オフライン時の処理
     */
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionQuality('low');
      
      toast.error('📡 オフライン', {
        description: '一部機能が制限されます',
        icon: <WifiOff className="w-4 h-4" />,
        duration: 3000,
      });
      
      logger.warn('ネットワーク接続失敗', {
        timestamp: new Date(),
        userAgent: navigator.userAgent
      });
    };

    // イベントリスナー登録
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // 初期品質チェック
    if (isOnline) {
      checkNetworkQuality();
    }

    // クリーンアップ関数
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkNetworkQuality, logger]);
  
  // オンライン時は何も表示しない
  if (isOnline && connectionQuality === 'high') {
    return null;
  }

  // オフライン時または接続品質低下時の表示
  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Alert 
        variant={isOnline ? "default" : "destructive"} 
        className={`border-${isOnline ? 'border' : 'destructive'}/20 bg-${isOnline ? 'card' : 'destructive'}/10`}
      >
        {isOnline ? (
          connectionQuality === 'medium' ? (
            <Wifi className="h-4 w-4 text-yellow-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-orange-500" />
          )
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <AlertDescription>
          {isOnline ? (
            connectionQuality === 'medium' 
              ? '接続品質が低下しています'
              : '接続が不安定です'
          ) : (
            'オフライン状態です。一部機能が制限されます。'
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
});

OptimizedNetworkMonitor.displayName = 'OptimizedNetworkMonitor';