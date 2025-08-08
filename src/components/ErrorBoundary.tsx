/**
 * ==============================================================================
 * 供物台（Kumotsudai）- エラー境界コンポーネント
 * ==============================================================================
 * 
 * 【概要】
 * エンタープライズ級エラー境界コンポーネント。
 * エラーの分類、ログ記録、復旧処理を統合。
 * 
 * 【機能】
 * - JavaScript エラーのキャッチ
 * - エラー分類・記録
 * - 自動復旧機能
 * - ユーザーフレンドリーなUI
 * 
 * @version 2.0.0
 * @author 供物台開発チーム
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { IErrorBoundaryProps , IErrorBoundaryState, IErrorDetails} from '../types/enterprise';
import { LoggerService } from '../services/logger';
import { AppConfigManager } from '../services/config';

/**
 * エンタープライズ級エラー境界コンポーネント
 * エラーの分類、ログ記録、復旧処理を統合
 */
export class EnterpriseErrorBoundary extends React.Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  /** ログサービス */
  private readonly logger: LoggerService;
  
  /** 設定管理 */
  private readonly config: AppConfigManager;
  
  /** 最大復旧試行回数 */
  private readonly MAX_RETRY_COUNT = 3;
  
  /**
   * コンストラクタ
   */
  constructor(props: IErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorDetails: null,
      retryCount: 0
    };
    
    this.logger = LoggerService.getInstance();
    this.config = AppConfigManager.getInstance();
  }

  /**
   * エラー発生時の状態更新
   */
  static getDerivedStateFromError(error: Error): Partial<IErrorBoundaryState> {
    return { 
      hasError: true, 
      error,
      errorDetails: {
        code: error.name || 'UnknownError',
        message: error.message || '不明なエラーが発生しました',
        stack: error.stack,
        timestamp: new Date()
      }
    };
  }

  /**
   * エラーキャッチ時の処理
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorDetails: IErrorDetails = {
      code: error.name || 'UnknownError',
      message: error.message || '不明なエラーが発生しました',
      stack: error.stack,
      timestamp: new Date(),
      context: {
        componentStack: errorInfo.componentStack,
        errorBoundary: 'EnterpriseErrorBoundary',
        retryCount: this.state.retryCount,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    };
    
    // エラーログ記録
    this.logger.error('アプリケーションエラーをキャッチしました', {
      error: errorDetails,
      errorInfo
    });
    
    // 状態更新
    this.setState({ errorDetails });
    
    // 本番環境でのエラー追跡
    if (this.config.environment === 'production') {
      this.sendErrorToTracking(errorDetails, errorInfo);
    }
    
    // 自動復旧の試行
    this.attemptAutoRecovery();
  }
  
  /**
   * エラー追跡サービスに送信
   */
  private sendErrorToTracking(errorDetails: IErrorDetails, errorInfo: React.ErrorInfo): void {
    // TODO: AWS CloudWatch Insights や外部サービス（Sentry等）にエラー送信
    console.info('エラー追跡サービスに送信 (未実装)', {
      errorDetails,
      errorInfo
    });
  }
  
  /**
   * 自動復旧の試行
   */
  private attemptAutoRecovery(): void {
    if (this.state.retryCount < this.MAX_RETRY_COUNT) {
      const retryDelay = Math.pow(2, this.state.retryCount) * 1000; // 指数バックオフ
      
      setTimeout(() => {
        this.logger.info('自動復旧を試行します', {
          retryCount: this.state.retryCount + 1,
          delay: retryDelay
        });
        
        this.handleRetry();
      }, retryDelay);
    }
  }
  
  /**
   * 手動復旧処理
   */
  private handleRetry = (): void => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorDetails: null,
      retryCount: prevState.retryCount + 1
    }));
  }
  
  /**
   * コンポーネント再読み込み
   */
  private handleReload = (): void => {
    this.logger.info('ページ再読み込みを実行します');
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      const { error, errorDetails, retryCount } = this.state;
      
      // カスタムフォールバック使用
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={error!} retry={this.handleRetry} />;
      }
      
      // デフォルトエラー画面
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-lg w-full space-y-6 text-center">
            {/* エラーアイコン */}
            <div className="flex justify-center">
              <AlertCircle size={64} className="text-destructive animate-pulse" />
            </div>
            
            {/* エラータイトル */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                申し訳ございません
              </h1>
              <p className="text-lg text-muted-foreground">
                予期しないエラーが発生しました
              </p>
            </div>
            
            {/* エラー詳細 (開発環境のみ) */}
            {this.config.environment === 'development' && errorDetails && (
              <details className="text-left text-sm bg-muted p-4 rounded-lg">
                <summary className="cursor-pointer font-medium mb-2">
                  エラー詳細を表示
                </summary>
                <div className="space-y-2">
                  <div>
                    <strong>エラーコード:</strong> {errorDetails.code}
                  </div>
                  <div>
                    <strong>メッセージ:</strong> {errorDetails.message}
                  </div>
                  <div>
                    <strong>発生時刻:</strong> {errorDetails.timestamp.toISOString()}
                  </div>
                  {errorDetails.stack && (
                    <div>
                      <strong>スタックトレース:</strong>
                      <pre className="mt-1 overflow-auto text-xs bg-background p-2 rounded border">
                        {errorDetails.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* 再試行ボタン */}
              <button
                onClick={this.handleRetry}
                disabled={retryCount >= this.MAX_RETRY_COUNT}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed large-clickable haptic-feedback"
              >
                再試行 ({this.MAX_RETRY_COUNT - retryCount}回残り)
              </button>
              
              {/* 再読み込みボタン */}
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors large-clickable haptic-feedback"
              >
                ページ再読み込み
              </button>
            </div>
            
            {/* サポート情報 */}
            <div className="text-sm text-muted-foreground">
              <p>
                問題が続く場合は、
                <a 
                  href="mailto:support@kumotsudai.com"
                  className="text-primary hover:underline ml-1"
                >
                  サポートチーム
                </a>
                までお問い合わせください。
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}