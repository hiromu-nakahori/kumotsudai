/**
 * ==============================================================================
 * 供物台（Kumotsudai）- ログ管理サービス
 * ==============================================================================
 * 
 * 【概要】
 * 統一ログサービス。AWS CloudWatch Logsとの連携を前提とした設計。
 * Figma Make環境対応済み。
 * 
 * 【機能】
 * - 構造化ログ出力
 * - ログレベルフィルタリング
 * - バッファリング・バッチ送信
 * - CloudWatch統合準備
 * - 環境安全性確保
 * 
 * @version 2.1.0
 * @author 供物台開発チーム
 */

import type { ILogEntry } from '../types/enterprise';

// 循環依存を避けるため、設定は遅延インポート
let AppConfigManager: any = null;

/**
 * 統一ログサービスクラス
 * AWS CloudWatch Logsとの連携を前提とした設計
 */
export class LoggerService {
  /** シングルトンインスタンス */
  private static instance: LoggerService | null = null;
  
  /** ログバッファ (CloudWatchへのバッチ送信用) */
  private readonly logBuffer: ILogEntry[] = [];
  
  /** 設定管理 */
  private config: any = null;
  
  /** バッファサイズ制限 */
  private readonly BUFFER_LIMIT = 100;
  
  /** フラッシュ間隔 (ミリ秒) */
  private readonly FLUSH_INTERVAL = 5000;
  
  /** フラッシュタイマー */
  private flushTimer: number | null = null;
  
  /** 初期化済みフラグ */
  private initialized = false;
  
  /**
   * コンストラクタ (private - Singleton)
   */
  private constructor() {
    // 遅延初期化で循環依存を回避
    this.initializeAsync();
  }
  
  /**
   * 非同期初期化
   * 設定管理サービスとの循環依存を回避
   */
  private async initializeAsync(): Promise<void> {
    try {
      // 設定管理サービスを遅延取得
      setTimeout(() => {
        try {
          if (!AppConfigManager) {
            import('./config').then(module => {
              AppConfigManager = module.AppConfigManager;
              this.config = AppConfigManager.getInstance();
              this.setupPeriodicFlush();
              this.initialized = true;
              
              if (this.config.environment === 'development') {
                console.info('🔧 LoggerService: 初期化完了');
              }
            }).catch(error => {
              console.warn('LoggerService: 設定管理サービスの取得に失敗しました', error);
              this.initialized = true;
            });
          }
        } catch (error) {
          console.warn('LoggerService: 設定管理サービスの取得に失敗しました', error);
          this.initialized = true;
        }
      }, 0);
    } catch (error) {
      console.warn('LoggerService: 初期化中にエラーが発生しました', error);
      this.initialized = true;
    }
  }
  
  /**
   * 定期フラッシュの設定
   */
  private setupPeriodicFlush(): void {
    // 本番環境のみ定期フラッシュを有効化
    if (this.config && this.config.environment === 'production') {
      if (typeof setInterval !== 'undefined') {
        this.flushTimer = window.setInterval(() => {
          this.flushLogs();
        }, this.FLUSH_INTERVAL);
      }
    }
  }
  
  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    
    return LoggerService.instance;
  }
  
  /**
   * デバッグログ
   * @param message メッセージ
   * @param data 追加データ
   */
  public debug(message: string, data?: Record<string, any>): void {
    this.log('debug', message, data);
  }
  
  /**
   * 情報ログ
   * @param message メッセージ
   * @param data 追加データ
   */
  public info(message: string, data?: Record<string, any>): void {
    this.log('info', message, data);
  }
  
  /**
   * 警告ログ
   * @param message メッセージ
   * @param data 追加データ
   */
  public warn(message: string, data?: Record<string, any>): void {
    this.log('warn', message, data);
  }
  
  /**
   * エラーログ
   * @param message メッセージ
   * @param data 追加データ
   */
  public error(message: string, data?: Record<string, any>): void {
    this.log('error', message, data);
  }
  
  /**
   * ログ記録処理
   * @param level ログレベル
   * @param message メッセージ
   * @param data 追加データ
   */
  private log(level: ILogEntry['level'], message: string, data?: Record<string, any>): void {
    try {
      // ログレベルフィルタリング
      if (!this.shouldLog(level)) {
        return;
      }
      
      const logEntry: ILogEntry = {
        level,
        message,
        timestamp: new Date(),
        source: 'LoggerService',
        data,
        traceId: this.generateTraceId()
      };
      
      // コンソール出力（開発環境または設定が取得できない場合）
      const isDevelopment = !this.config || this.config.environment === 'development';
      if (isDevelopment) {
        this.logToConsole(logEntry);
      }
      
      // バッファに追加
      this.logBuffer.push(logEntry);
      
      // バッファ制限チェック
      if (this.logBuffer.length >= this.BUFFER_LIMIT) {
        this.flushLogs();
      }
    } catch (error) {
      // ログ処理でエラーが発生した場合は、最低限コンソールに出力
      console.error('LoggerService: ログ処理中にエラーが発生しました', error);
      console.log(`[${level.toUpperCase()}] ${message}`, data);
    }
  }
  
  /**
   * ログレベル判定
   * @param level ログレベル
   * @returns ログ出力するかどうか
   */
  private shouldLog(level: ILogEntry['level']): boolean {
    if (!this.config) {
      // 設定が取得できない場合は全レベル出力
      return true;
    }
    
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevel = levels.indexOf(this.config.logLevel);
    const currentLevel = levels.indexOf(level);
    
    return currentLevel >= configLevel;
  }
  
  /**
   * コンソール出力
   * @param entry ログエントリ
   */
  private logToConsole(entry: ILogEntry): void {
    try {
      const timestamp = entry.timestamp.toISOString();
      const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;
      
      // ブラウザの対応状況に応じてログ出力
      const consoleMethod = this.getConsoleMethod(entry.level);
      
      if (entry.data && Object.keys(entry.data).length > 0) {
        consoleMethod(`${prefix} ${entry.message}`, entry.data);
      } else {
        consoleMethod(`${prefix} ${entry.message}`);
      }
    } catch (error) {
      // フォールバック: 基本的なconsole.log
      console.log(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.data);
    }
  }
  
  /**
   * レベルに応じたコンソールメソッド取得
   * @param level ログレベル
   * @returns コンソールメソッド
   */
  private getConsoleMethod(level: ILogEntry['level']): (...args: any[]) => void {
    switch (level) {
      case 'debug':
        return console.debug?.bind(console) || console.log.bind(console);
      case 'info':
        return console.info?.bind(console) || console.log.bind(console);
      case 'warn':
        return console.warn?.bind(console) || console.log.bind(console);
      case 'error':
        return console.error?.bind(console) || console.log.bind(console);
      default:
        return console.log.bind(console);
    }
  }
  
  /**
   * ログフラッシュ (CloudWatchに送信)
   */
  private flushLogs(): void {
    if (this.logBuffer.length === 0) {
      return;
    }
    
    try {
      // 本番環境では AWS SDK を使用してCloudWatchに送信
      const isProduction = this.config && this.config.environment === 'production';
      
      if (isProduction) {
        // TODO: AWS CloudWatch Logs への送信実装
        console.info(`CloudWatchに${this.logBuffer.length}件のログを送信 (未実装)`);
      }
      
      // バッファをクリア
      this.logBuffer.splice(0, this.logBuffer.length);
    } catch (error) {
      console.warn('ログフラッシュ中にエラーが発生しました', error);
    }
  }
  
  /**
   * トレースID生成
   * @returns トレースID
   */
  private generateTraceId(): string {
    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 9);
      return `trace-${timestamp}-${random}`;
    } catch (error) {
      // フォールバック
      return `trace-${Date.now()}-fallback`;
    }
  }
  
  /**
   * ログ統計取得
   * @returns ログレベル別件数
   */
  public getLogStats(): Record<string, number> {
    const stats = { debug: 0, info: 0, warn: 0, error: 0 };
    
    try {
      for (const entry of this.logBuffer) {
        if (stats.hasOwnProperty(entry.level)) {
          stats[entry.level]++;
        }
      }
    } catch (error) {
      console.warn('ログ統計取得中にエラーが発生しました', error);
    }
    
    return stats;
  }
  
  /**
   * サービス状態取得
   * @returns サービス状態情報
   */
  public getServiceStatus(): Record<string, any> {
    return {
      initialized: this.initialized,
      hasConfig: !!this.config,
      bufferSize: this.logBuffer.length,
      hasTimer: !!this.flushTimer,
      environment: this.config?.environment || 'unknown',
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * サービス終了処理
   */
  public dispose(): void {
    try {
      // タイマーのクリア
      if (this.flushTimer) {
        if (typeof clearInterval !== 'undefined') {
          clearInterval(this.flushTimer);
        }
        this.flushTimer = null;
      }
      
      // 残りのログをフラッシュ
      this.flushLogs();
      
      console.info('LoggerService: サービスを終了しました');
    } catch (error) {
      console.warn('LoggerService: 終了処理中にエラーが発生しました', error);
    }
  }
}